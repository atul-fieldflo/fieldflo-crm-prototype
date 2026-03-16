import { useState, useMemo } from 'react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import { ChevronRight, Plus, Search, ChevronDown } from 'lucide-react';
import type { ProductionTask } from '../../mockData';

export default function ProductionTasks() {
  const { adminTasks, adminTaskGroups } = useAppContext();
  const dispatch = useAppDispatch();
  const [filterGroup, setFilterGroup] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ProductionTask | null>(null);

  const groupOptions = [
    { value: '', label: 'All Groups' },
    ...adminTaskGroups.map((g) => ({ value: g.name, label: g.name })),
  ];

  const filteredTasks = useMemo(() => {
    let result = adminTasks;
    if (filterGroup) {
      result = result.filter((t) => t.groups.includes(filterGroup));
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((t) => t.name.toLowerCase().includes(q));
    }
    return result;
  }, [adminTasks, filterGroup, searchQuery]);

  const handleExpand = (task: ProductionTask) => {
    if (expandedId === task.id) {
      setExpandedId(null);
      setEditDraft(null);
    } else {
      setExpandedId(task.id);
      setEditDraft({ ...task });
    }
  };

  const handleSave = () => {
    if (!editDraft) return;
    dispatch({ type: 'UPDATE_ADMIN_TASK', payload: editDraft });
    setExpandedId(null);
    setEditDraft(null);
  };

  const calcCostPerUnit = (task: ProductionTask) => {
    if (!task.prodRatePerHour || task.prodRatePerHour === 0) return null;
    const laborHoursPerUnit = 1 / task.prodRatePerHour;
    const costPerUnit = laborHoursPerUnit * task.positionBurdenRate;
    const revenuePerUnit = task.billingRate;
    const marginPercent = revenuePerUnit > 0 ? ((revenuePerUnit - costPerUnit) / revenuePerUnit) * 100 : 0;
    return { laborHoursPerUnit, costPerUnit, revenuePerUnit, marginPercent };
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>Portal Admins</span>
        <ChevronRight size={14} />
        <span>Production Tracking</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Tasks</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ff-text">Production Tasks</h1>
        <Button>
          <Plus size={16} className="mr-1" />
          Add New Task
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Dropdown
          options={groupOptions}
          value={filterGroup}
          onChange={setFilterGroup}
          placeholder="Filter by Group"
          className="w-56"
        />
        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ff-text-muted" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-ff-border rounded-md pl-9 pr-3 py-2 text-sm text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ff-border bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Task Name</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Code</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">UoM</th>
                <th className="text-right px-4 py-3 font-medium text-ff-text-secondary">Est Rate/Hr</th>
                <th className="text-right px-4 py-3 font-medium text-white bg-ff-teal-light rounded-t">
                  <span className="flex items-center justify-end gap-1.5 text-ff-teal-dark">
                    Billing Rate
                    <Badge variant="teal" size="sm">NEW</Badge>
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Position</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Groups</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Source</th>
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task) => (
                <>
                  <tr
                    key={task.id}
                    onClick={() => handleExpand(task)}
                    className={`border-b border-ff-border cursor-pointer transition-colors hover:bg-gray-50 ${
                      expandedId === task.id ? 'bg-ff-teal-light/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-ff-text">
                      <span className="flex items-center gap-1">
                        <ChevronDown
                          size={14}
                          className={`text-ff-text-muted transition-transform ${
                            expandedId === task.id ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                        {task.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-ff-text-secondary font-mono text-xs">{task.code}</td>
                    <td className="px-4 py-3 text-ff-text-secondary">{task.uom}</td>
                    <td className="px-4 py-3 text-right text-ff-text-secondary">
                      {task.prodRatePerHour !== null ? task.prodRatePerHour.toFixed(1) : '--'}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-ff-teal-dark">
                      ${task.billingRate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-ff-text-secondary text-xs">{task.positionCode}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {task.groups.map((g) => (
                          <Badge key={g} variant="muted" size="sm">{g}</Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={task.source === 'Seeded' ? 'blue' : 'green'} size="sm">
                        {task.source}
                      </Badge>
                    </td>
                  </tr>

                  {/* Expanded edit panel */}
                  {expandedId === task.id && editDraft && (
                    <tr key={`${task.id}-edit`}>
                      <td colSpan={8} className="px-0 py-0">
                        <div className="bg-gray-50 border-t border-ff-border px-6 py-5 space-y-5">
                          {/* 3-column grid */}
                          <div className="grid grid-cols-3 gap-4">
                            <Input
                              label="Task Name"
                              value={editDraft.name}
                              onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                            />
                            <Input
                              label="Code"
                              value={editDraft.code}
                              onChange={(e) => setEditDraft({ ...editDraft, code: e.target.value })}
                            />
                            <Input
                              label="Unit of Measure"
                              value={editDraft.uom}
                              onChange={(e) => setEditDraft({ ...editDraft, uom: e.target.value })}
                            />
                            <Input
                              label="Production Rate / Hr"
                              type="number"
                              value={editDraft.prodRatePerHour?.toString() ?? ''}
                              onChange={(e) =>
                                setEditDraft({
                                  ...editDraft,
                                  prodRatePerHour: e.target.value ? parseFloat(e.target.value) : null,
                                })
                              }
                            />
                            <div>
                              <label className="block text-sm font-medium text-ff-text mb-1">
                                <span className="flex items-center gap-1.5">
                                  Billing Rate per UoM
                                  <Badge variant="teal" size="sm">NEW</Badge>
                                </span>
                              </label>
                              <input
                                type="number"
                                step="0.01"
                                value={editDraft.billingRate}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    billingRate: parseFloat(e.target.value) || 0,
                                  })
                                }
                                className="w-full bg-white border-2 border-ff-teal rounded-md text-ff-text px-3 py-2 text-sm focus:ring-2 focus:ring-ff-teal/30 outline-none"
                              />
                            </div>
                            <Input
                              label="Position / Burden Rate"
                              value={`${editDraft.positionCode} — $${editDraft.positionBurdenRate.toFixed(2)}/hr`}
                              readOnly
                            />
                          </div>

                          {/* Cost calculation */}
                          {(() => {
                            const calc = calcCostPerUnit(editDraft);
                            if (!calc) return (
                              <div className="bg-white border border-ff-border rounded-lg p-4 text-sm text-ff-text-muted">
                                Cost calculation requires a production rate.
                              </div>
                            );
                            return (
                              <div className="bg-white border border-ff-border rounded-lg p-4">
                                <p className="text-xs font-medium text-ff-text-secondary mb-3 uppercase tracking-wide">Cost Calculation (read-only)</p>
                                <div className="grid grid-cols-4 gap-4 text-sm">
                                  <div>
                                    <p className="text-ff-text-muted text-xs">Labor Hours / Unit</p>
                                    <p className="font-medium text-ff-text">{calc.laborHoursPerUnit.toFixed(3)} hr</p>
                                  </div>
                                  <div>
                                    <p className="text-ff-text-muted text-xs">Cost at Burden Rate</p>
                                    <p className="font-medium text-ff-text">${calc.costPerUnit.toFixed(2)} / {editDraft.uom}</p>
                                  </div>
                                  <div>
                                    <p className="text-ff-text-muted text-xs">Revenue at Billing Rate</p>
                                    <p className="font-medium text-ff-teal-dark">${calc.revenuePerUnit.toFixed(2)} / {editDraft.uom}</p>
                                  </div>
                                  <div>
                                    <p className="text-ff-text-muted text-xs">Margin</p>
                                    <p className={`font-semibold ${calc.marginPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                      {calc.marginPercent.toFixed(1)}%
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })()}

                          {/* Save / Cancel */}
                          <div className="flex items-center gap-3">
                            <Button onClick={handleSave}>Save</Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setExpandedId(null);
                                setEditDraft(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {filteredTasks.length === 0 && (
        <p className="text-sm text-ff-text-muted text-center py-8">No tasks match your filters.</p>
      )}
    </div>
  );
}
