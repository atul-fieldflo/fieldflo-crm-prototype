import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import { extractedLineItems, proposalSections, proposalGrandTotal } from '../../mockData';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import { Settings } from 'lucide-react';

/* ── Editable Text Block ──────────────────────────────────────────────────── */

function EditableBlock({
  value,
  onChange,
  rows = 4,
  className = '',
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  className?: string;
}) {
  const [editing, setEditing] = useState(false);

  if (editing) {
    return (
      <textarea
        className={`w-full border border-ff-teal rounded-md p-3 text-sm text-ff-text focus:outline-none focus:ring-2 focus:ring-ff-teal/30 resize-y ${className}`}
        rows={rows}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={() => setEditing(false)}
        autoFocus
      />
    );
  }

  return (
    <div
      className={`cursor-pointer rounded-md p-3 text-sm text-ff-text hover:bg-gray-50 hover:ring-1 hover:ring-ff-border transition ${className}`}
      onClick={() => setEditing(true)}
      title="Click to edit"
    >
      {value.split('\n').map((line, i) => (
        <p key={i} className={line.trim() === '' ? 'h-3' : ''}>
          {line}
        </p>
      ))}
    </div>
  );
}

/* ── Helpers ──────────────────────────────────────────────────────────────── */

function formatCurrency(n: number): string {
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
}

function todayString(): string {
  const d = new Date();
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function plus30(): string {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

/* ── Main Component ───────────────────────────────────────────────────────── */

export default function ProposalCanvas() {
  const state = useAppContext();
  const navigate = useNavigate();
  const { leadId } = useParams();

  const lead = state.activeLead;
  const clientName = lead?.clientName || 'Chandler Regional Medical Center';
  const leadName = lead?.leadName || 'Chandler Medical Plaza — Bldg C Renovation';

  /* ── Editable text states ─────────────────────────────────────────────── */

  const [scopeText, setScopeText] = useState(
    `Pinnacle Environmental Services ("Contractor") is pleased to submit this proposal for selective demolition and hazardous material abatement services at Chandler Medical Plaza, Building C, located at 1875 W. Frye Rd, Chandler, AZ 85224.\n\nWork shall include the removal and lawful disposal of identified asbestos-containing materials (ACM), selective interior demolition of designated areas per the architectural plans dated 01/15/2026, and installation of ICRA Class III containment barriers as required for occupied healthcare facility work.\n\nAll work will be performed in compliance with OSHA, EPA NESHAP, and Maricopa County Air Quality Department regulations. A licensed asbestos project monitor will be on-site for the duration of abatement activities.`
  );

  const [exclusionsText, setExclusionsText] = useState(
    `The following items are expressly excluded from this proposal unless otherwise noted:\n\n• Removal or remediation of lead-based paint (LBP) beyond identified scope\n• Structural demolition or modification of load-bearing elements\n• Mechanical, electrical, or plumbing (MEP) disconnects — by others\n• Hazardous waste not identified in the survey report dated 12/20/2025\n• Overtime, weekend, or holiday work unless pre-approved in writing\n• Permitting fees (to be obtained by General Contractor)\n• Soil or groundwater remediation\n• Re-insulation of pipes after abatement — by mechanical contractor`
  );

  const [termsText, setTermsText] = useState(
    `1. Payment Terms: Net 30 from date of approved invoice. Progress billing monthly.\n2. Change Orders: Any work outside the defined scope requires a written change order signed by both parties prior to commencement.\n3. Insurance: Contractor maintains $2M General Liability, $1M Professional Liability, and statutory Workers' Compensation coverage. Certificates available upon request.\n4. Warranty: Contractor warrants all work for a period of one (1) year from date of completion against defects in workmanship.\n5. Cancellation: Either party may cancel this agreement with 10 business days written notice. Client shall be responsible for work completed to date.`
  );

  /* ── Derived data ─────────────────────────────────────────────────────── */

  const lineItemMap = Object.fromEntries(extractedLineItems.map((li) => [li.id, li]));

  const [selectedBlock, setSelectedBlock] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {/* ── Toolbar ──────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-ff-border shadow-sm">
        <div className="max-w-4xl mx-auto flex items-center justify-between px-6 py-3">
          <button
            className="text-sm text-ff-teal hover:text-ff-teal-dark font-medium flex items-center gap-1 transition-colors"
            onClick={() => navigate(-1)}
          >
            <span className="text-lg leading-none">&larr;</span> Back to Sections
          </button>

          <div className="flex items-center gap-3">
            <Badge variant="teal" size="sm">
              Draft
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => navigate(`/crm/leads/${leadId}/proposals/before-after`)}
            >
              Preview
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/crm/leads/${leadId}/proposals/send`)}
            >
              Send Proposal
            </Button>
          </div>
        </div>
      </div>

      {/* ── Content: Document + Properties Panel ─────────────────────────── */}
      <div className="flex gap-4 max-w-6xl mx-auto mt-8 px-4">
      <div className="flex-1 min-w-0 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="px-12 py-10">
          {/* ── Header Block ───────────────────────────────────────────── */}
          <div className="border-b-2 border-ff-teal-dark pb-6 mb-8">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-ff-teal-dark tracking-tight">
                  PINNACLE
                </h1>
                <p className="text-sm text-ff-text-secondary mt-0.5">
                  Environmental Services
                </p>
              </div>
              <div className="text-right text-xs text-ff-text-secondary leading-relaxed">
                <p>4821 E. Baseline Rd</p>
                <p>Phoenix, AZ 85042</p>
                <p className="mt-1">Phone: (602) 555-0100</p>
                <p>License #ROC-298741</p>
              </div>
            </div>
          </div>

          {/* ── Title Block ────────────────────────────────────────────── */}
          <div className="text-center mb-8">
            <p className="text-xs uppercase tracking-widest text-ff-text-secondary mb-2">
              Proposal
            </p>
            <h2 className="text-xl font-bold text-ff-text">
              Proposal for Abatement and Demolition Services
            </h2>
          </div>

          {/* ── Metadata Table ─────────────────────────────────────────── */}
          <div className="mb-10 border border-ff-border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {[
                  ['Prepared For', clientName],
                  ['Project', leadName],
                  ['Date', todayString()],
                  ['Valid Until', plus30()],
                  ['Prepared By', 'Marcus Chen'],
                ].map(([label, value], i) => (
                  <tr
                    key={label}
                    className={i % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                  >
                    <td className="px-4 py-2.5 font-medium text-ff-text-secondary w-44">
                      {label}
                    </td>
                    <td className="px-4 py-2.5 text-ff-text">{value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Scope of Work ──────────────────────────────────────────── */}
          <section className="mb-10">
            <h3 className="text-base font-semibold text-ff-text mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-ff-teal-dark rounded-full inline-block" />
              Scope of Work
            </h3>
            <EditableBlock
              value={scopeText}
              onChange={setScopeText}
              rows={8}
            />
          </section>

          {/* ── Line Item Sections ─────────────────────────────────────── */}
          {proposalSections.map((section) => {
            const items = section.lineItemIds
              .map((id) => lineItemMap[id])
              .filter(Boolean);

            return (
              <section key={section.id} className="mb-10">
                <h3 className="text-base font-semibold text-ff-teal-dark mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-5 bg-ff-teal rounded-full inline-block" />
                  {section.name}
                </h3>

                <div className="border border-ff-border rounded-lg overflow-hidden mb-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 text-ff-text-secondary">
                        <th className="text-left px-4 py-2.5 font-medium">
                          Description
                        </th>
                        <th className="text-right px-4 py-2.5 font-medium w-20">
                          Qty
                        </th>
                        <th className="text-center px-4 py-2.5 font-medium w-20">
                          Unit
                        </th>
                        <th className="text-right px-4 py-2.5 font-medium w-28">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, idx) => (
                        <tr
                          key={item.id}
                          className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-4 py-2.5 text-ff-text">
                            {item.description}
                          </td>
                          <td className="px-4 py-2.5 text-right text-ff-text tabular-nums">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-4 py-2.5 text-center text-ff-text-secondary">
                            {item.unit}
                          </td>
                          <td className="px-4 py-2.5 text-right text-ff-text tabular-nums">
                            {formatCurrency(item.total)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Section totals */}
                <div className="flex justify-end">
                  <div className="w-72 text-sm space-y-1">
                    <div className="flex justify-between px-4 py-1 text-ff-text-secondary">
                      <span>Subtotal</span>
                      <span className="tabular-nums">
                        {formatCurrency(section.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-1 text-ff-text-secondary">
                      <span>Markup ({section.markup}%)</span>
                      <span className="tabular-nums">
                        {formatCurrency(section.markedUpTotal - section.subtotal)}
                      </span>
                    </div>
                    <div className="flex justify-between px-4 py-1.5 font-semibold text-ff-text border-t border-ff-border">
                      <span>Section Total</span>
                      <span className="tabular-nums">
                        {formatCurrency(section.markedUpTotal)}
                      </span>
                    </div>
                  </div>
                </div>
              </section>
            );
          })}

          {/* ── Grand Total Block ──────────────────────────────────────── */}
          <div className="border-2 border-ff-teal-dark rounded-lg p-4 mb-10">
            <div className="flex items-center justify-between">
              <span className="text-lg font-bold text-ff-teal-dark">
                Grand Total
              </span>
              <span className="text-2xl font-bold text-ff-teal-dark tabular-nums">
                {formatCurrency(proposalGrandTotal)}
              </span>
            </div>
          </div>

          {/* ── Exclusions Block ───────────────────────────────────────── */}
          <section className="mb-10">
            <h3 className="text-base font-semibold text-ff-text mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-ff-teal-dark rounded-full inline-block" />
              Exclusions
            </h3>
            <EditableBlock
              value={exclusionsText}
              onChange={setExclusionsText}
              rows={10}
            />
          </section>

          {/* ── Terms Block ────────────────────────────────────────────── */}
          <section className="mb-10">
            <h3 className="text-base font-semibold text-ff-text mb-3 flex items-center gap-2">
              <span className="w-1.5 h-5 bg-ff-teal-dark rounded-full inline-block" />
              Terms &amp; Conditions
            </h3>
            <EditableBlock
              value={termsText}
              onChange={setTermsText}
              rows={8}
            />
          </section>

          {/* ── Signature Block ────────────────────────────────────────── */}
          <section className="mt-16 pt-8 border-t border-ff-border">
            <div className="grid grid-cols-2 gap-12">
              {/* Contractor */}
              <div>
                <p className="text-xs uppercase tracking-widest text-ff-text-secondary mb-8">
                  Contractor
                </p>
                <div className="border-b border-ff-text mb-1 h-8" />
                <p className="text-sm text-ff-text font-medium">Marcus Chen</p>
                <p className="text-xs text-ff-text-secondary">
                  Pinnacle Environmental Services
                </p>
                <div className="mt-4">
                  <p className="text-xs text-ff-text-secondary">Date</p>
                  <div className="border-b border-ff-text mt-6 mb-1 h-0" />
                </div>
              </div>

              {/* Client */}
              <div>
                <p className="text-xs uppercase tracking-widest text-ff-text-secondary mb-8">
                  Client
                </p>
                <div className="border-b border-ff-text mb-1 h-8" />
                <p className="text-sm text-ff-text font-medium">{clientName}</p>
                <p className="text-xs text-ff-text-secondary">Authorized Representative</p>
                <div className="mt-4">
                  <p className="text-xs text-ff-text-secondary">Date</p>
                  <div className="border-b border-ff-text mt-6 mb-1 h-0" />
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* ── Properties Panel ──────────────────────────────────────────── */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white border border-ff-border rounded-lg p-4 sticky top-20">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={14} className="text-ff-text-muted" />
            <span className="text-sm font-semibold text-ff-text">Block Properties</span>
          </div>
          {selectedBlock ? (
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-ff-text-muted uppercase tracking-wider">Selected</span>
                <p className="text-ff-text font-medium mt-0.5">{selectedBlock}</p>
              </div>
              <div>
                <span className="text-xs text-ff-text-muted uppercase tracking-wider">Type</span>
                <p className="text-ff-text mt-0.5">Text Block</p>
              </div>
              <p className="text-xs text-ff-text-muted">Click any text in the document to edit it directly.</p>
            </div>
          ) : (
            <p className="text-sm text-ff-text-muted">
              Click a block in the document to see its properties.
            </p>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
