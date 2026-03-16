import { useState, useMemo } from 'react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import { clients } from '../../mockData';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import { ChevronRight, Plus, ChevronDown } from 'lucide-react';
import type { ClientRateSheet, ClientRateSheetItem } from '../../mockData';

export default function ClientRateSheets() {
  const { adminRateSheets } = useAppContext();
  const dispatch = useAppDispatch();
  const clientsWithSheets = clients.filter((c) => c.hasRateSheet);
  const [selectedClientId, setSelectedClientId] = useState(clientsWithSheets[0]?.id ?? '');
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({ itemName: '', itemType: 'task' as ClientRateSheetItem['itemType'], baseRate: '', clientRate: '', unit: '', notes: '' });
  const [howConnectOpen, setHowConnectOpen] = useState(false);
  const clientOptions = [
    { value: '', label: 'Select a client...' },
    ...clientsWithSheets.map((c) => ({ value: c.id, label: c.name })),
  ];

  const activeSheet = useMemo(
    () => adminRateSheets.find((rs) => rs.clientId === selectedClientId) || null,
    [adminRateSheets, selectedClientId]
  );

  const handleRateChange = (sheet: ClientRateSheet, itemIdx: number, newClientRate: number) => {
    const updatedItems = sheet.items.map((item, i) => {
      if (i !== itemIdx) return item;
      const modifier = item.baseRate !== 0 ? ((newClientRate - item.baseRate) / item.baseRate) * 100 : 0;
      return { ...item, clientRate: newClientRate, modifierPercent: Math.round(modifier) };
    });
    dispatch({
      type: 'UPDATE_ADMIN_RATE_SHEET',
      payload: { ...sheet, items: updatedItems },
    });
  };

  const handleNotesChange = (sheet: ClientRateSheet, itemIdx: number, notes: string) => {
    const updatedItems = sheet.items.map((item, i) =>
      i === itemIdx ? { ...item, notes } : item
    );
    dispatch({
      type: 'UPDATE_ADMIN_RATE_SHEET',
      payload: { ...sheet, items: updatedItems },
    });
  };

  const itemTypeBadgeVariant = (type: ClientRateSheetItem['itemType']) => {
    switch (type) {
      case 'task': return 'teal' as const;
      case 'inventory': return 'blue' as const;
      case 'position': return 'purple' as const;
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>CRM</span>
        <ChevronRight size={14} />
        <span>Clients</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Rate Sheets</span>
      </nav>

      <h1 className="text-xl font-semibold text-ff-text">Client Rate Sheets</h1>

      {/* Client selector */}
      <div className="max-w-sm">
        <Dropdown
          options={clientOptions}
          value={selectedClientId}
          onChange={setSelectedClientId}
          placeholder="Select a client..."
        />
      </div>

      {/* No selection state */}
      {!selectedClientId && (
        <div className="text-center py-12 text-ff-text-muted text-sm">
          Select a client above to view their rate sheet.
        </div>
      )}

      {/* Selected client but no sheet */}
      {selectedClientId && !activeSheet && (
        <div className="text-center py-12 text-ff-text-muted text-sm">
          No rate sheet found for this client.
        </div>
      )}

      {/* Rate sheet detail */}
      {activeSheet && (
        <>
          {/* Header */}
          <Card className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-ff-text">{activeSheet.name}</h2>
                <p className="text-sm text-ff-text-secondary mt-1">{activeSheet.clientName}</p>
              </div>
              <Badge variant={activeSheet.status === 'Active' ? 'green' : 'red'} size="md">
                {activeSheet.status}
              </Badge>
            </div>
            <div className="flex items-center gap-6 mt-3 text-sm text-ff-text-secondary flex-wrap">
              <span>
                <span className="text-ff-text-muted">Effective:</span>{' '}
                {new Date(activeSheet.effectiveDate).toLocaleDateString()}
              </span>
              <span>
                <span className="text-ff-text-muted">Expires:</span>{' '}
                {new Date(activeSheet.expirationDate).toLocaleDateString()}
              </span>
              <span>
                <span className="text-ff-text-muted">Items:</span> {activeSheet.items.length}
              </span>
            </div>
          </Card>

          {/* Rate table */}
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ff-border bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Item Name</th>
                    <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Type</th>
                    <th className="text-right px-4 py-3 font-medium text-ff-text-secondary">Base Rate</th>
                    <th className="text-right px-4 py-3 font-medium text-ff-text-secondary">Client Rate</th>
                    <th className="text-right px-4 py-3 font-medium text-ff-text-secondary">Modifier %</th>
                    <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Unit</th>
                    <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {activeSheet.items.map((item, idx) => (
                    <tr
                      key={`${item.itemId}-${idx}`}
                      className={`border-b border-ff-border last:border-0 ${
                        item.modifierPercent !== 0 ? 'bg-ff-teal-light/20' : ''
                      }`}
                    >
                      <td className="px-4 py-3 font-medium text-ff-text">{item.itemName}</td>
                      <td className="px-4 py-3">
                        <Badge variant={itemTypeBadgeVariant(item.itemType)} size="sm">
                          {item.itemType}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right text-ff-text-secondary font-mono">
                        ${item.baseRate.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <input
                          type="number"
                          step="0.01"
                          value={item.clientRate}
                          onChange={(e) =>
                            handleRateChange(activeSheet, idx, parseFloat(e.target.value) || 0)
                          }
                          className="w-24 text-right bg-white border border-ff-border rounded px-2 py-1 text-sm font-mono text-ff-text focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`font-mono text-sm font-medium ${
                            item.modifierPercent < 0
                              ? 'text-red-600'
                              : item.modifierPercent > 0
                              ? 'text-green-600'
                              : 'text-ff-text-muted'
                          }`}
                        >
                          {item.modifierPercent > 0 ? '+' : ''}
                          {item.modifierPercent}%
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ff-text-secondary">{item.unit}</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.notes}
                          onChange={(e) => handleNotesChange(activeSheet, idx, e.target.value)}
                          className="w-full bg-white border border-ff-border rounded px-2 py-1 text-sm text-ff-text-secondary focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                        />
                      </td>
                    </tr>
                  ))}

                  {/* Inline add row */}
                  {addingItem && (
                    <tr className="border-b border-ff-border bg-ff-teal-light/10">
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Item name"
                          value={newItem.itemName}
                          onChange={(e) => setNewItem({ ...newItem, itemName: e.target.value })}
                          className="w-full bg-white border border-ff-border rounded px-2 py-1 text-sm focus:border-ff-teal outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={newItem.itemType}
                          onChange={(e) => setNewItem({ ...newItem, itemType: e.target.value as ClientRateSheetItem['itemType'] })}
                          className="bg-white border border-ff-border rounded px-2 py-1 text-sm focus:border-ff-teal outline-none"
                        >
                          <option value="task">task</option>
                          <option value="inventory">inventory</option>
                          <option value="position">position</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={newItem.baseRate}
                          onChange={(e) => setNewItem({ ...newItem, baseRate: e.target.value })}
                          className="w-20 text-right bg-white border border-ff-border rounded px-2 py-1 text-sm font-mono focus:border-ff-teal outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          placeholder="0.00"
                          value={newItem.clientRate}
                          onChange={(e) => setNewItem({ ...newItem, clientRate: e.target.value })}
                          className="w-20 text-right bg-white border border-ff-border rounded px-2 py-1 text-sm font-mono focus:border-ff-teal outline-none"
                        />
                      </td>
                      <td className="px-4 py-3 text-center text-ff-text-muted text-sm">--</td>
                      <td className="px-4 py-3">
                        <input
                          type="text"
                          placeholder="Unit"
                          value={newItem.unit}
                          onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                          className="w-16 bg-white border border-ff-border rounded px-2 py-1 text-sm focus:border-ff-teal outline-none"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => { setAddingItem(false); setNewItem({ itemName: '', itemType: 'task', baseRate: '', clientRate: '', unit: '', notes: '' }); }}>
                            Save
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => setAddingItem(false)}>
                            Cancel
                          </Button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Add item button */}
          {!addingItem && (
            <Button variant="secondary" onClick={() => setAddingItem(true)}>
              <Plus size={16} className="mr-1" />
              Add Item
            </Button>
          )}

          {/* How Rate Sheets Connect */}
          <Card className="overflow-hidden">
            <button
              onClick={() => setHowConnectOpen(!howConnectOpen)}
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-ff-text">How Rate Sheets Connect</span>
              <ChevronDown
                size={16}
                className={`text-ff-text-muted transition-transform ${howConnectOpen ? 'rotate-0' : '-rotate-90'}`}
              />
            </button>
            {howConnectOpen && (
              <div className="px-5 pb-5 border-t border-ff-border pt-4">
                <ol className="space-y-3 text-sm text-ff-text-secondary">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ff-teal text-white text-xs flex items-center justify-center font-medium">1</span>
                    <span><strong className="text-ff-text">Admin creates a rate sheet</strong> for a client, setting client-specific rates for tasks, inventory items, and positions.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ff-teal text-white text-xs flex items-center justify-center font-medium">2</span>
                    <span><strong className="text-ff-text">A new lead is created</strong> for that client. The system detects the active rate sheet.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ff-teal text-white text-xs flex items-center justify-center font-medium">3</span>
                    <span><strong className="text-ff-text">During bid assembly,</strong> when the estimator adds line items (tasks, materials, labor), the system auto-populates the client rate instead of the base rate.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ff-teal text-white text-xs flex items-center justify-center font-medium">4</span>
                    <span><strong className="text-ff-text">The estimator can override</strong> any auto-populated rate. A visual indicator shows which rates came from the rate sheet vs. manual entry.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-ff-teal text-white text-xs flex items-center justify-center font-medium">5</span>
                    <span><strong className="text-ff-text">On the proposal,</strong> the final rates (whether sheet or override) flow into the bid total. Rate sheet origin is tracked for margin analysis.</span>
                  </li>
                </ol>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
