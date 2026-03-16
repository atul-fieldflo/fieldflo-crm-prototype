import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import { productionTasks, taskGroups, clientRateSheets, clients } from '../../mockData';
import type { ProductionTask } from '../../mockData';
import Dropdown from '../ui/Dropdown';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Search, Info } from 'lucide-react';

interface SelectedTask {
  taskId: string;
  qty: number;
  rate: number;
}

export default function TaskLibraryPicker() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  const [groupFilter, setGroupFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<SelectedTask[]>([]);

  // Determine if active lead's client has a rate sheet
  const clientId = activeLead?.clientId ?? '';
  const client = clients.find((c) => c.id === clientId);
  const rateSheet = clientRateSheets.find(
    (rs) => rs.clientId === clientId && rs.status === 'Active'
  );

  // Build rate lookup: taskId -> clientRate
  const clientRateMap = useMemo(() => {
    const map = new Map<string, number>();
    if (rateSheet) {
      rateSheet.items.forEach((item) => {
        if (item.itemType === 'task') {
          map.set(item.itemId, item.clientRate);
        }
      });
    }
    return map;
  }, [rateSheet]);

  // Filter tasks by group and search
  const filteredTasks = useMemo(() => {
    let tasks = productionTasks;
    if (groupFilter) {
      const group = taskGroups.find((g) => g.id === groupFilter);
      if (group) {
        tasks = tasks.filter((t) => t.groups.includes(group.name));
      }
    }
    if (searchTerm.trim()) {
      const lower = searchTerm.toLowerCase();
      tasks = tasks.filter((t) => t.name.toLowerCase().includes(lower));
    }
    return tasks;
  }, [groupFilter, searchTerm]);

  const isSelected = (taskId: string) => selected.some((s) => s.taskId === taskId);

  const getEffectiveRate = (task: ProductionTask) => {
    return clientRateMap.get(task.id) ?? task.billingRate;
  };

  const toggleTask = (task: ProductionTask) => {
    if (isSelected(task.id)) {
      setSelected((prev) => prev.filter((s) => s.taskId !== task.id));
    } else {
      setSelected((prev) => [
        ...prev,
        { taskId: task.id, qty: 0, rate: getEffectiveRate(task) },
      ]);
    }
  };

  const handleGroupChange = (groupId: string) => {
    setGroupFilter(groupId);
    if (groupId) {
      const group = taskGroups.find((g) => g.id === groupId);
      if (group) {
        const groupTasks = productionTasks.filter((t) => t.groups.includes(group.name));
        const newSelected = [...selected];
        groupTasks.forEach((t) => {
          if (!newSelected.some((s) => s.taskId === t.id)) {
            newSelected.push({ taskId: t.id, qty: 0, rate: getEffectiveRate(t) });
          }
        });
        setSelected(newSelected);
      }
    }
  };

  const selectAllInGroup = () => {
    const newSelected = [...selected];
    filteredTasks.forEach((t) => {
      if (!newSelected.some((s) => s.taskId === t.id)) {
        newSelected.push({ taskId: t.id, qty: 0, rate: getEffectiveRate(t) });
      }
    });
    setSelected(newSelected);
  };

  const unselectAll = () => setSelected([]);

  const updateQty = (taskId: string, qty: number) => {
    setSelected((prev) =>
      prev.map((s) => (s.taskId === taskId ? { ...s, qty } : s))
    );
  };

  const updateRate = (taskId: string, rate: number) => {
    setSelected((prev) =>
      prev.map((s) => (s.taskId === taskId ? { ...s, rate } : s))
    );
  };

  const selectedTasks = selected.map((s) => ({
    ...s,
    task: productionTasks.find((t) => t.id === s.taskId)!,
  }));

  const subtotal = selectedTasks.reduce((sum, s) => sum + s.qty * s.rate, 0);

  const handleContinue = () => {
    // Store selections in context
    selected.forEach((s) => {
      dispatch({ type: 'ADD_QUICK_QUOTE_TASK', payload: s });
    });
    dispatch({ type: 'SET_LINE_ITEMS_EXTRACTED' });
    navigate(`/crm/leads/${leadId}/proposals/section-grouping`);
  };

  const groupOptions = [
    { value: '', label: 'All Groups' },
    ...taskGroups.map((g) => ({ value: g.id, label: g.name })),
  ];

  return (
    <div className="flex gap-0 h-[calc(100vh-240px)] min-h-[500px]">
      {/* Left Panel */}
      <div className="w-[65%] border border-ff-border rounded-l-lg bg-ff-card flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-ff-border space-y-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-ff-text">Task Library</h2>
            <Badge variant="muted" size="sm">Quick Quote</Badge>
          </div>

          <div className="flex items-center gap-3">
            <Dropdown
              options={groupOptions}
              value={groupFilter}
              onChange={handleGroupChange}
              placeholder="Filter by Group"
              className="w-56"
            />
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ff-text-muted" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Rate Sheet Banner */}
          {rateSheet && client && (
            <div className="flex items-center gap-2 bg-ff-teal-light border border-ff-teal rounded-md px-3 py-2">
              <Info size={16} className="text-ff-teal-dark flex-shrink-0" />
              <span className="text-sm text-ff-teal-dark font-medium">
                Rate sheet active for {client.name} &mdash; client rates applied where available.
              </span>
            </div>
          )}

          {/* Bulk actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={selectAllInGroup}
              className="text-xs text-ff-teal-dark hover:underline font-medium"
            >
              Select All in Group
            </button>
            <span className="text-ff-border">|</span>
            <button
              onClick={unselectAll}
              className="text-xs text-ff-text-secondary hover:underline"
            >
              Unselect All
            </button>
            <span className="ml-auto text-xs text-ff-text-muted">
              {selected.length} task{selected.length !== 1 ? 's' : ''} selected
            </span>
          </div>
        </div>

        {/* Task Table */}
        <div className="flex-1 overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 border-b border-ff-border">
              <tr>
                <th className="w-10 px-4 py-2.5"></th>
                <th className="text-left px-3 py-2.5 font-medium text-ff-text-secondary">Task Name</th>
                <th className="text-left px-3 py-2.5 font-medium text-ff-text-secondary w-20">Code</th>
                <th className="text-left px-3 py-2.5 font-medium text-ff-text-secondary w-16">UoM</th>
                <th className="text-right px-3 py-2.5 font-medium text-ff-text-secondary w-24">Base Rate</th>
                {rateSheet && (
                  <th className="text-right px-3 py-2.5 font-medium text-ff-text-secondary w-28">Client Rate</th>
                )}
                <th className="text-center px-3 py-2.5 font-medium text-ff-text-secondary w-20">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => {
                const clientRate = clientRateMap.get(task.id);
                const hasClientRate = clientRate !== undefined;
                const ratesDiffer = hasClientRate && clientRate !== task.billingRate;

                return (
                  <tr
                    key={task.id}
                    onClick={() => toggleTask(task)}
                    className={`border-b border-ff-border-light cursor-pointer transition-colors hover:bg-gray-50 ${
                      ratesDiffer && rateSheet ? 'bg-ff-teal-light/40' : ''
                    }`}
                  >
                    <td className="px-4 py-2.5 text-center">
                      <input
                        type="checkbox"
                        checked={isSelected(task.id)}
                        onChange={() => toggleTask(task)}
                        className="rounded border-ff-border text-ff-teal focus:ring-ff-teal"
                      />
                    </td>
                    <td className="px-3 py-2.5 text-ff-text font-medium">{task.name}</td>
                    <td className="px-3 py-2.5 text-ff-text-secondary font-mono text-xs">{task.code}</td>
                    <td className="px-3 py-2.5 text-ff-text-secondary">{task.uom}</td>
                    <td className="px-3 py-2.5 text-right text-ff-text">
                      ${task.billingRate.toFixed(2)}
                    </td>
                    {rateSheet && (
                      <td className="px-3 py-2.5 text-right">
                        {hasClientRate ? (
                          <span className={ratesDiffer ? 'text-ff-teal-dark font-semibold' : 'text-ff-text-secondary'}>
                            ${clientRate.toFixed(2)}
                          </span>
                        ) : (
                          <span className="text-ff-text-muted">&mdash;</span>
                        )}
                      </td>
                    )}
                    <td className="px-3 py-2.5 text-center">
                      <Badge variant={task.source === 'Seeded' ? 'teal' : 'purple'} size="sm">
                        {task.source}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
              {filteredTasks.length === 0 && (
                <tr>
                  <td colSpan={rateSheet ? 7 : 6} className="px-4 py-8 text-center text-ff-text-muted">
                    No tasks match your filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-[35%] border border-l-0 border-ff-border rounded-r-lg bg-white flex flex-col">
        <div className="p-4 border-b border-ff-border">
          <h3 className="text-sm font-semibold text-ff-text">
            Selected Tasks ({selected.length})
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {selectedTasks.length === 0 && (
            <p className="text-sm text-ff-text-muted text-center py-8">
              Check tasks on the left to add them here.
            </p>
          )}
          {selectedTasks.map(({ task, qty, rate, taskId }) => {
            const extended = qty * rate;
            return (
              <div
                key={taskId}
                className="bg-gray-50 border border-ff-border rounded-md p-3 space-y-2"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-medium text-ff-text">{task.name}</span>
                  <span className="text-xs text-ff-text-muted">{task.uom}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider text-ff-text-muted font-medium">Qty</label>
                    <input
                      type="number"
                      min={0}
                      value={qty || ''}
                      onChange={(e) => updateQty(taskId, Number(e.target.value) || 0)}
                      placeholder="0"
                      className="w-full border border-ff-border rounded px-2 py-1 text-sm text-ff-text focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider text-ff-text-muted font-medium">Rate</label>
                    <input
                      type="number"
                      min={0}
                      step={0.01}
                      value={rate || ''}
                      onChange={(e) => updateRate(taskId, Number(e.target.value) || 0)}
                      className="w-full border border-ff-border rounded px-2 py-1 text-sm text-ff-text focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[10px] uppercase tracking-wider text-ff-text-muted font-medium">Extended</label>
                    <div className="px-2 py-1 text-sm font-medium text-ff-text">
                      ${extended.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-ff-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-ff-text-secondary">Subtotal</span>
            <span className="text-lg font-semibold text-ff-text">
              ${subtotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={selected.length === 0}
            onClick={handleContinue}
          >
            Continue to Line Items &rarr;
          </Button>
        </div>
      </div>
    </div>
  );
}
