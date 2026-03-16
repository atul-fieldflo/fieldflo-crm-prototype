import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractedLineItems } from '../../mockData';
import type { LineItem } from '../../mockData';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function LineItemReview() {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [items, setItems] = useState<LineItem[]>(extractedLineItems.map((li) => ({ ...li })));
  const [checkedIds, setCheckedIds] = useState<Set<string>>(
    new Set(extractedLineItems.map((li) => li.id))
  );
  const [editingCell, setEditingCell] = useState<{ rowId: string; field: string } | null>(null);

  const toggleCheck = (id: string) => {
    setCheckedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (checkedIds.size === items.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(items.map((li) => li.id)));
    }
  };

  const updateField = (id: string, field: keyof LineItem, value: string | number) => {
    setItems((prev) =>
      prev.map((li) => {
        if (li.id !== id) return li;
        const updated = { ...li, [field]: value };
        // Recalculate total when qty or rate changes
        if (field === 'quantity' || field === 'rate') {
          updated.total = (field === 'quantity' ? (value as number) : li.quantity) *
            (field === 'rate' ? (value as number) : li.rate);
        }
        return updated;
      })
    );
  };

  const runningTotal = useMemo(() => {
    return items
      .filter((li) => checkedIds.has(li.id))
      .reduce((sum, li) => sum + li.total, 0);
  }, [items, checkedIds]);

  const confidenceBadge = (confidence: LineItem['confidence']) => {
    const map = { high: 'green' as const, medium: 'amber' as const, low: 'red' as const };
    return <Badge variant={map[confidence]} size="sm">{confidence}</Badge>;
  };

  const isEditing = (rowId: string, field: string) =>
    editingCell?.rowId === rowId && editingCell?.field === field;

  const renderEditableCell = (
    li: LineItem,
    field: keyof LineItem,
    value: string | number,
    align: string = 'text-left',
    isNumeric: boolean = false
  ) => {
    if (isEditing(li.id, field)) {
      return (
        <input
          autoFocus
          type={isNumeric ? 'number' : 'text'}
          value={value}
          onChange={(e) =>
            updateField(li.id, field, isNumeric ? Number(e.target.value) || 0 : e.target.value)
          }
          onBlur={() => setEditingCell(null)}
          onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
          className="w-full border border-ff-teal rounded px-1.5 py-0.5 text-sm outline-none focus:ring-1 focus:ring-ff-teal"
        />
      );
    }
    return (
      <span
        onClick={() => setEditingCell({ rowId: li.id, field })}
        className={`cursor-pointer hover:bg-ff-teal-light/50 rounded px-1 py-0.5 -mx-1 transition-colors ${align}`}
      >
        {isNumeric && typeof value === 'number'
          ? field === 'rate' || field === 'total'
            ? `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
            : value.toLocaleString()
          : value}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ff-text">Line Item Review</h2>
          <p className="text-sm text-ff-text-secondary mt-0.5">
            Click any cell to edit. Medium-confidence items have an amber border.
          </p>
        </div>
        <Badge variant="ai">AI Extracted</Badge>
      </div>

      <div className="bg-ff-card border border-ff-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-ff-border">
              <tr>
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    checked={checkedIds.size === items.length}
                    onChange={toggleAll}
                    className="rounded border-ff-border text-ff-teal focus:ring-ff-teal"
                  />
                </th>
                <th className="text-left px-3 py-3 font-medium text-ff-text-secondary">Type</th>
                <th className="text-left px-3 py-3 font-medium text-ff-text-secondary min-w-[200px]">Description</th>
                <th className="text-right px-3 py-3 font-medium text-ff-text-secondary w-20">Qty</th>
                <th className="text-left px-3 py-3 font-medium text-ff-text-secondary w-16">Unit</th>
                <th className="text-right px-3 py-3 font-medium text-ff-text-secondary w-24">Rate</th>
                <th className="text-right px-3 py-3 font-medium text-ff-text-secondary w-28">Total</th>
                <th className="text-center px-3 py-3 font-medium text-ff-text-secondary w-24">Confidence</th>
                <th className="text-left px-3 py-3 font-medium text-ff-text-secondary min-w-[160px]">Source</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ff-border-light">
              {items.map((li) => (
                <tr
                  key={li.id}
                  className={`transition-colors ${
                    li.confidence === 'medium' ? 'border-l-2 border-l-amber-400' : ''
                  } ${checkedIds.has(li.id) ? '' : 'opacity-50'}`}
                >
                  <td className="px-4 py-2.5 text-center">
                    <input
                      type="checkbox"
                      checked={checkedIds.has(li.id)}
                      onChange={() => toggleCheck(li.id)}
                      className="rounded border-ff-border text-ff-teal focus:ring-ff-teal"
                    />
                  </td>
                  <td className="px-3 py-2.5 text-ff-text-secondary text-xs">
                    {renderEditableCell(li, 'type', li.type)}
                  </td>
                  <td className="px-3 py-2.5 text-ff-text font-medium">
                    {renderEditableCell(li, 'description', li.description)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-ff-text">
                    {renderEditableCell(li, 'quantity', li.quantity, 'text-right', true)}
                  </td>
                  <td className="px-3 py-2.5 text-ff-text-secondary">
                    {renderEditableCell(li, 'unit', li.unit)}
                  </td>
                  <td className="px-3 py-2.5 text-right text-ff-text">
                    {renderEditableCell(li, 'rate', li.rate, 'text-right', true)}
                  </td>
                  <td className="px-3 py-2.5 text-right font-medium text-ff-text">
                    ${li.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>
                  <td className="px-3 py-2.5 text-center">
                    {confidenceBadge(li.confidence)}
                  </td>
                  <td className="px-3 py-2.5">
                    <span className="inline-flex items-center bg-ff-teal-light text-ff-teal-dark text-xs font-medium px-2 py-0.5 rounded-full">
                      {li.source}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="border-t border-ff-border px-4 py-3 flex items-center justify-between bg-gray-50">
          <span className="text-sm text-ff-text-secondary">
            {checkedIds.size} of {items.length} items selected
          </span>
          <div className="text-right">
            <span className="text-sm text-ff-text-secondary mr-3">Running Total</span>
            <span className="text-lg font-semibold text-ff-text">
              ${runningTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/crm/leads/${leadId}/proposals/estimate-import`)}
          className="text-sm text-ff-text-secondary hover:text-ff-text transition-colors"
        >
          &larr; Back to Import
        </button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/crm/leads/${leadId}/proposals/section-grouping`)}
        >
          Continue to Section Grouping &rarr;
        </Button>
      </div>
    </div>
  );
}
