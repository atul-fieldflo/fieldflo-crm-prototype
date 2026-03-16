import { useState } from 'react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { ChevronRight, Plus, ChevronDown } from 'lucide-react';

export default function TaskGroups() {
  const { adminTaskGroups, adminTasks } = useAppContext();
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });

  const getTasksInGroup = (groupName: string) =>
    adminTasks.filter((t) => t.groups.includes(groupName));

  const handleAddGroup = () => {
    if (!newGroup.name.trim()) return;
    dispatch({
      type: 'ADD_ADMIN_TASK_GROUP',
      payload: {
        id: `tg-${Date.now()}`,
        name: newGroup.name,
        description: newGroup.description,
        taskCount: 0,
        source: 'User Created',
      },
    });
    setAddingNew(false);
    setNewGroup({ name: '', description: '' });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>Portal Admins</span>
        <ChevronRight size={14} />
        <span>Production Tracking</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Task Groups</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ff-text">Task Groups</h1>
        <Button onClick={() => setAddingNew(true)}>
          <Plus size={16} className="mr-1" />
          Add New Group
        </Button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        Groups appear as filters in the <strong>Quick Quote task picker</strong> and in the <strong>Production Dashboard ADD TASK(S) modal</strong>.
      </div>

      {/* Card grid */}
      <div className="grid grid-cols-2 gap-4">
        {adminTaskGroups.map((group) => {
          const tasksInGroup = getTasksInGroup(group.name);
          const isExpanded = expandedId === group.id;

          return (
            <Card
              key={group.id}
              className="p-5 cursor-pointer"
              hover
              onClick={() => setExpandedId(isExpanded ? null : group.id)}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-ff-text">{group.name}</h3>
                  <Badge variant="muted" size="sm">{tasksInGroup.length} tasks</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={group.source === 'Seeded' ? 'blue' : 'green'} size="sm">
                    {group.source}
                  </Badge>
                  <ChevronDown
                    size={16}
                    className={`text-ff-text-muted transition-transform ${isExpanded ? 'rotate-0' : '-rotate-90'}`}
                  />
                </div>
              </div>
              <p className="text-sm text-ff-text-secondary">{group.description}</p>

              {/* Insurance Residential callout */}
              {group.name === 'Insurance Residential' && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded p-2.5 text-xs text-amber-800">
                  This group is the default filter in the Quick Quote task picker. When an estimator opens Quick Quote for an insurance/residential lead, only tasks in this group are pre-filtered.
                </div>
              )}

              {/* Expanded: task list */}
              {isExpanded && (
                <div className="mt-4 border-t border-ff-border pt-3 space-y-2">
                  <p className="text-xs font-medium text-ff-text-secondary uppercase tracking-wide mb-2">
                    Tasks in this group
                  </p>
                  {tasksInGroup.length === 0 ? (
                    <p className="text-sm text-ff-text-muted">No tasks assigned to this group yet.</p>
                  ) : (
                    <div className="space-y-1.5">
                      {tasksInGroup.map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center justify-between bg-white border border-ff-border rounded px-3 py-2 text-sm"
                        >
                          <span className="text-ff-text font-medium">{task.name}</span>
                          <span className="text-ff-text-muted font-mono text-xs">{task.code}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}

        {/* Add new group card */}
        {addingNew && (
          <Card className="p-5 border-dashed border-2 border-ff-teal/40">
            <h3 className="font-semibold text-ff-text mb-3">New Task Group</h3>
            <div className="space-y-3" onClick={(e) => e.stopPropagation()}>
              <Input
                label="Group Name"
                placeholder="e.g., Structural Demo"
                value={newGroup.name}
                onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
              />
              <Input
                label="Description"
                placeholder="What tasks belong in this group?"
                value={newGroup.description}
                onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
              />
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" onClick={handleAddGroup}>Create Group</Button>
                <Button size="sm" variant="ghost" onClick={() => setAddingNew(false)}>Cancel</Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
