import { useState } from 'react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { MoreHorizontal, Plus, ChevronRight } from 'lucide-react';
import type { BidLineItemType } from '../../mockData';

export default function BidLineItemTypes() {
  const { adminBidTypes } = useAppContext();
  const dispatch = useAppDispatch();
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [addingNew, setAddingNew] = useState(false);
  const [newRow, setNewRow] = useState({ name: '', code: '', fields: '', connectsTo: '' });

  const handleToggleStatus = (item: BidLineItemType) => {
    dispatch({
      type: 'UPDATE_ADMIN_BID_TYPE',
      payload: {
        ...item,
        status: item.status === 'active' ? 'inactive' : 'active',
      },
    });
  };

  const handleAddNew = () => {
    if (!newRow.name.trim()) return;
    // Prototype only — dispatch not wired for add, just close form
    setAddingNew(false);
    setNewRow({ name: '', code: '', fields: '', connectsTo: '' });
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>Portal Admins</span>
        <ChevronRight size={14} />
        <span>CRM</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Bid Line Item Types</span>
      </nav>

      <h1 className="text-xl font-semibold text-ff-text">Bid Line Item Types</h1>

      {/* Amber Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
        <p className="font-semibold mb-1">Current state:</p>
        <p>
          These 15 types are hardcoded in the production code (<code className="bg-amber-100 px-1 rounded text-xs">bid_line_item.php</code>).
          Adding or removing a type today requires a code deployment.
          The overhaul makes them admin-configurable.
        </p>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ff-border bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Type Name</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Code</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Fields</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Connects To</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Source</th>
                <th className="text-center px-4 py-3 font-medium text-ff-text-secondary">Status</th>
                <th className="w-12 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {adminBidTypes.map((item) => (
                <tr
                  key={item.id}
                  className={`border-b border-ff-border last:border-0 ${
                    item.isNew ? 'bg-ff-teal-light/20' : ''
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-ff-text">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {item.isNew && <Badge variant="teal" size="sm">NEW</Badge>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ff-text-secondary font-mono text-xs">{item.code}</td>
                  <td className="px-4 py-3 text-ff-text-secondary max-w-[240px]">
                    <span className="truncate block">{item.fields.join(', ')}</span>
                  </td>
                  <td className="px-4 py-3 text-ff-text-secondary">
                    {item.connectsTo ? (
                      <Badge variant="blue" size="sm">{item.connectsTo}</Badge>
                    ) : (
                      <span className="text-ff-text-muted">--</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        item.source === 'System Default'
                          ? 'muted'
                          : item.source === 'Seeded'
                          ? 'blue'
                          : 'green'
                      }
                      size="sm"
                    >
                      {item.source}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.status === 'active'}
                        onChange={() => handleToggleStatus(item)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:ring-2 peer-focus:ring-ff-teal/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-ff-teal"></div>
                    </label>
                  </td>
                  <td className="px-4 py-3 relative">
                    <button
                      onClick={() => setMenuOpenId(menuOpenId === item.id ? null : item.id)}
                      className="p-1 rounded hover:bg-gray-100 transition-colors"
                    >
                      <MoreHorizontal size={16} className="text-ff-text-secondary" />
                    </button>
                    {menuOpenId === item.id && (
                      <div className="absolute right-4 top-10 z-20 bg-ff-card border border-ff-border rounded-lg shadow-lg py-1 w-36">
                        <button
                          onClick={() => setMenuOpenId(null)}
                          className="w-full text-left px-3 py-2 text-sm text-ff-text hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            handleToggleStatus(item);
                            setMenuOpenId(null);
                          }}
                          className="w-full text-left px-3 py-2 text-sm text-ff-text hover:bg-gray-50"
                        >
                          {item.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => setMenuOpenId(null)}
                          className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}

              {/* Inline add row */}
              {addingNew && (
                <tr className="border-b border-ff-border bg-ff-teal-light/10">
                  <td className="px-4 py-3">
                    <Input
                      placeholder="Type name"
                      value={newRow.name}
                      onChange={(e) => setNewRow({ ...newRow, name: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      placeholder="code"
                      value={newRow.code}
                      onChange={(e) => setNewRow({ ...newRow, code: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      placeholder="field1, field2, ..."
                      value={newRow.fields}
                      onChange={(e) => setNewRow({ ...newRow, fields: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Input
                      placeholder="inventory / tasks"
                      value={newRow.connectsTo}
                      onChange={(e) => setNewRow({ ...newRow, connectsTo: e.target.value })}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="green" size="sm">User Created</Badge>
                  </td>
                  <td className="px-4 py-3 text-center" colSpan={2}>
                    <div className="flex items-center gap-2 justify-center">
                      <Button size="sm" onClick={handleAddNew}>Save</Button>
                      <Button size="sm" variant="ghost" onClick={() => setAddingNew(false)}>Cancel</Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add button */}
      {!addingNew && (
        <Button variant="secondary" onClick={() => setAddingNew(true)}>
          <Plus size={16} className="mr-1" />
          Add New Type
        </Button>
      )}
    </div>
  );
}
