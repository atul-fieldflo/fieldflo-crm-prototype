import { useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { extractedLineItems, proposalSections } from '../../mockData';
import type { LineItem, ProposalSection } from '../../mockData';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import OPModeToggle from '../ui/OPModeToggle';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { GripVertical, Sparkles } from 'lucide-react';

interface SectionState extends ProposalSection {
  lineItems: (LineItem & { itemMarkup: number })[];
}

export default function SectionGrouping() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  const [markupMode, setMarkupMode] = useState<'total' | 'per_section' | 'per_line_item'>(
    activeLead?.markupMethod ?? 'per_section'
  );
  const [grandTotalMarkup, setGrandTotalMarkup] = useState(20);

  // Build section state from mock data
  const [sections, setSections] = useState<SectionState[]>(() =>
    proposalSections.map((sec) => ({
      ...sec,
      lineItems: sec.lineItemIds
        .map((id) => extractedLineItems.find((li) => li.id === id))
        .filter((li): li is LineItem => li != null)
        .map((li) => ({ ...li, itemMarkup: sec.markup })),
    }))
  );

  const updateSectionMarkup = (sectionId: string, markup: number) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId ? { ...s, markup, markedUpTotal: s.subtotal * (1 + markup / 100) } : s
      )
    );
  };

  const updateSectionName = (sectionId: string, name: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, name } : s))
    );
  };

  const updateItemMarkup = (sectionId: string, itemId: string, markup: number) => {
    setSections((prev) =>
      prev.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              lineItems: s.lineItems.map((li) =>
                li.id === itemId ? { ...li, itemMarkup: markup } : li
              ),
            }
          : s
      )
    );
  };

  const grandTotal = useMemo(() => {
    if (markupMode === 'total') {
      const rawTotal = sections.reduce((sum, s) => sum + s.subtotal, 0);
      return rawTotal * (1 + grandTotalMarkup / 100);
    }
    if (markupMode === 'per_section') {
      return sections.reduce(
        (sum, s) => sum + s.subtotal * (1 + s.markup / 100),
        0
      );
    }
    // per_line_item
    return sections.reduce(
      (sum, s) =>
        sum +
        s.lineItems.reduce(
          (liSum, li) => liSum + li.total * (1 + li.itemMarkup / 100),
          0
        ),
      0
    );
  }, [sections, markupMode, grandTotalMarkup]);

  const handleModeChange = (mode: 'total' | 'per_section' | 'per_line_item') => {
    setMarkupMode(mode);
    dispatch({ type: 'SET_MARKUP_METHOD', payload: mode });
  };

  const handleContinue = () => {
    dispatch({ type: 'SET_PROPOSAL_STATUS', payload: 'draft' });
    navigate(`/crm/leads/${leadId}/proposals/canvas`);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-ff-text">Section Grouping</h2>
          <div className="flex items-center gap-2 mt-1">
            <Sparkles size={14} className="text-ff-teal" />
            <span className="text-xs text-ff-teal-dark font-medium">AI suggested these groupings</span>
            <Badge variant="ai">AI</Badge>
          </div>
        </div>
        <OPModeToggle value={markupMode} onChange={handleModeChange} />
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section) => {
          const sectionMarkedUp = section.subtotal * (1 + section.markup / 100);

          return (
            <div
              key={section.id}
              className="bg-ff-card border border-ff-border rounded-lg overflow-hidden"
            >
              {/* Section Header */}
              <div className="bg-gray-50 border-b border-ff-border px-4 py-3 flex items-center gap-3">
                <GripVertical size={16} className="text-ff-text-muted cursor-grab" />
                <input
                  type="text"
                  value={section.name}
                  onChange={(e) => updateSectionName(section.id, e.target.value)}
                  className="flex-1 bg-transparent text-sm font-semibold text-ff-text border-none outline-none
                    focus:bg-white focus:border focus:border-ff-teal focus:rounded focus:px-2 transition-all"
                />
                <span className="text-sm text-ff-text-secondary">
                  Subtotal: ${section.subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
                {markupMode === 'per_section' && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-ff-text-muted">Markup</span>
                    <input
                      type="number"
                      value={section.markup}
                      onChange={(e) => updateSectionMarkup(section.id, Number(e.target.value) || 0)}
                      className="w-16 border border-ff-border rounded px-2 py-1 text-sm text-right
                        focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                    />
                    <span className="text-xs text-ff-text-muted">%</span>
                    <span className="text-sm font-medium text-ff-text ml-2">
                      = ${sectionMarkedUp.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                    </span>
                  </div>
                )}
              </div>

              {/* Line Items */}
              <div className="divide-y divide-ff-border-light">
                {section.lineItems.map((li) => (
                  <div
                    key={li.id}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50/50 transition-colors"
                  >
                    <GripVertical size={14} className="text-ff-text-muted/50 cursor-grab flex-shrink-0" />
                    <span className="text-sm text-ff-text flex-1">{li.description}</span>
                    <span className="text-xs text-ff-text-muted w-16 text-right">
                      {li.quantity} {li.unit}
                    </span>
                    <span className="text-sm text-ff-text w-20 text-right">
                      ${li.rate.toFixed(2)}
                    </span>
                    <span className="text-sm font-medium text-ff-text w-24 text-right">
                      ${li.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                    {markupMode === 'per_line_item' && (
                      <div className="flex items-center gap-1 w-28">
                        <input
                          type="number"
                          value={li.itemMarkup}
                          onChange={(e) =>
                            updateItemMarkup(section.id, li.id, Number(e.target.value) || 0)
                          }
                          className="w-14 border border-ff-border rounded px-1.5 py-0.5 text-sm text-right
                            focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
                        />
                        <span className="text-xs text-ff-text-muted">%</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Grand Total */}
      <div className="bg-ff-card border-2 border-ff-teal-dark rounded-lg px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-base font-semibold text-ff-text">Grand Total</span>
          {markupMode === 'total' && (
            <div className="flex items-center gap-1.5">
              <span className="text-xs text-ff-text-muted">Markup</span>
              <input
                type="number"
                value={grandTotalMarkup}
                onChange={(e) => setGrandTotalMarkup(Number(e.target.value) || 0)}
                className="w-16 border border-ff-border rounded px-2 py-1 text-sm text-right
                  focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none"
              />
              <span className="text-xs text-ff-text-muted">%</span>
            </div>
          )}
        </div>
        <span className="text-2xl font-bold text-ff-teal-dark">
          ${grandTotal.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate(`/crm/leads/${leadId}/proposals/line-items`)}
          className="text-sm text-ff-text-secondary hover:text-ff-text transition-colors"
        >
          &larr; Back to Line Items
        </button>
        <Button variant="primary" size="lg" onClick={handleContinue}>
          Continue to Proposal &rarr;
        </Button>
      </div>
    </div>
  );
}
