import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import { extractedLineItems, proposalSections } from '../../mockData';
import Badge from '../ui/Badge';

export default function BeforeAfterPreview() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const state = useAppContext();
  const lead = state.activeLead;

  const grandTotal = 187500;

  // Build dot-leader line items for old style
  const oldLineItems = extractedLineItems.map((li) => {
    const dots = '.'.repeat(Math.max(3, 50 - li.description.length - li.total.toLocaleString().length));
    return `${li.description}${dots}$${li.total.toLocaleString()}`;
  });

  return (
    <div className="py-8 px-6">
      {/* Back button */}
      <button
        onClick={() => navigate(`/crm/leads/${leadId}/proposals/canvas`)}
        className="flex items-center gap-2 text-sm text-ff-text-secondary hover:text-ff-text transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Proposal Canvas
      </button>

      <h1 className="text-2xl font-semibold text-ff-text mb-8">
        Before &amp; After — Proposal Output
      </h1>

      <div className="grid grid-cols-2 gap-6">
        {/* ─── LEFT COLUMN: CURRENT OUTPUT ─────────────────────────────── */}
        <div>
          <div className="mb-3">
            <Badge variant="red">CURRENT</Badge>
          </div>

          <div className="font-mono border border-ff-border p-6 bg-gray-50 rounded">
            <p className="text-sm font-mono uppercase tracking-wide">
              PINNACLE ENVIRONMENTAL SERVICES
            </p>
            <p className="text-xs font-mono text-gray-600 mt-1">
              4720 S. 36th Street, Suite 110
            </p>
            <p className="text-xs font-mono text-gray-600">
              Phoenix, AZ 85040
            </p>
            <p className="text-xs font-mono text-gray-600">
              Phone: (602) 555-0100 | Fax: (602) 555-0101
            </p>

            <hr className="my-4 border-gray-400" />

            <p className="text-lg font-mono font-bold uppercase text-center my-4">
              PROPOSAL
            </p>

            <hr className="my-4 border-gray-400" />

            <p className="text-xs font-mono mt-2">
              Prepared For: Westfield Construction
            </p>
            <p className="text-xs font-mono mt-1">
              Project: Chandler Medical Plaza — Demo + Abatement
            </p>
            <p className="text-xs font-mono mt-1">
              Date: March 15, 2026
            </p>

            <hr className="my-4 border-gray-400" />

            <div className="space-y-1 mt-4">
              {oldLineItems.map((line, i) => (
                <p key={i} className="text-xs font-mono whitespace-pre">
                  {line}
                </p>
              ))}
            </div>

            <hr className="my-4 border-gray-400" />

            <p className="text-sm font-mono font-bold mt-4">
              TOTAL: ${grandTotal.toLocaleString()}
            </p>

            <hr className="my-4 border-gray-400" />

            <p className="text-xs font-mono mt-4">
              Signature: _______________
            </p>
            <p className="text-xs font-mono mt-2">
              Date: _______________
            </p>
          </div>

          <p className="text-sm italic text-ff-text-secondary mt-4 leading-relaxed">
            Feedback: &quot;It looks like a dot matrix printer output&quot; — Sarah (Alliance).
            &quot;Make that thing beautiful... professional tone&quot; — Roni (CEO).
          </p>
        </div>

        {/* ─── RIGHT COLUMN: NEW OUTPUT ────────────────────────────────── */}
        <div>
          <div className="mb-3">
            <Badge variant="green">NEW</Badge>
          </div>

          <div className="shadow-lg rounded-xl overflow-hidden bg-white">
            {/* Company header */}
            <div className="px-6 pt-6 pb-4 flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-ff-teal-dark">PINNACLE</h2>
                <p className="text-sm text-ff-text-secondary">Environmental Services</p>
              </div>
              <div className="text-right text-xs text-ff-text-secondary leading-relaxed">
                <p>4720 S. 36th Street, Suite 110</p>
                <p>Phoenix, AZ 85040</p>
                <p>(602) 555-0100</p>
              </div>
            </div>

            {/* Proposal info card */}
            <div className="mx-6 mb-4 bg-ff-teal-light/30 p-4 rounded-lg">
              <p className="text-xs font-medium text-ff-teal-dark uppercase tracking-wider mb-1">
                Proposal
              </p>
              <p className="text-lg font-bold text-ff-text">
                {lead?.leadName || 'Chandler Medical Plaza — Demo + Abatement'}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-ff-text-secondary">
                <span>March 15, 2026</span>
                <span className="text-ff-teal-dark font-medium">Valid for 30 days</span>
              </div>
            </div>

            {/* Prepared For */}
            <div className="px-6 mb-4">
              <p className="text-xs text-ff-text-secondary uppercase tracking-wider mb-1">Prepared For</p>
              <p className="text-sm font-medium text-ff-text">Westfield Construction</p>
              <p className="text-xs text-ff-text-secondary">Jen Martinez, Project Coordinator</p>
            </div>

            {/* Scope */}
            <div className="px-6 mb-6">
              <p className="text-xs text-ff-text-secondary uppercase tracking-wider mb-2">Scope of Work</p>
              <p className="text-sm text-ff-text leading-relaxed">
                Selective interior demolition and asbestos abatement services for the 4th floor
                of Building C at Chandler Medical Plaza. Work includes ACM floor tile and mastic
                removal, pipe insulation abatement, ICRA Class III containment, partition demolition,
                ceiling and flooring removal, and all associated debris disposal. Phased access
                to maintain 3rd-floor tenant operations.
              </p>
            </div>

            {/* Sections with tables */}
            {proposalSections.map((section) => {
              const sectionItems = extractedLineItems.filter((li) =>
                section.lineItemIds.includes(li.id)
              );
              return (
                <div key={section.id} className="mx-6 mb-5">
                  {/* Section header */}
                  <div className="bg-ff-teal-dark text-white px-3 py-1.5 rounded-t text-sm font-medium">
                    {section.name}
                  </div>

                  {/* Table */}
                  <table className="w-full text-sm border border-t-0 border-gray-200">
                    <thead>
                      <tr className="bg-gray-50 text-xs text-ff-text-secondary">
                        <th className="text-left px-3 py-2 font-medium">Description</th>
                        <th className="text-right px-3 py-2 font-medium">Qty</th>
                        <th className="text-right px-3 py-2 font-medium">Unit</th>
                        <th className="text-right px-3 py-2 font-medium">Rate</th>
                        <th className="text-right px-3 py-2 font-medium">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionItems.map((item) => (
                        <tr key={item.id} className="border-t border-gray-100">
                          <td className="px-3 py-2 text-ff-text">{item.description}</td>
                          <td className="px-3 py-2 text-right text-ff-text-secondary">
                            {item.quantity.toLocaleString()}
                          </td>
                          <td className="px-3 py-2 text-right text-ff-text-secondary">
                            {item.unit}
                          </td>
                          <td className="px-3 py-2 text-right text-ff-text-secondary">
                            ${item.rate.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </td>
                          <td className="px-3 py-2 text-right font-medium text-ff-text">
                            ${item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50">
                        <td colSpan={4} className="px-3 py-2 text-right text-xs font-medium text-ff-text-secondary">
                          Subtotal ({section.markup}% markup applied)
                        </td>
                        <td className="px-3 py-2 text-right font-semibold text-ff-text">
                          ${section.markedUpTotal.toLocaleString()}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              );
            })}

            {/* Grand total */}
            <div className="mx-6 mb-6 border-2 border-ff-teal-dark rounded-lg p-4 text-right">
              <p className="text-xs text-ff-text-secondary uppercase tracking-wider mb-1">
                Grand Total
              </p>
              <p className="text-2xl font-bold text-ff-teal-dark">
                ${grandTotal.toLocaleString()}
              </p>
            </div>

            {/* E-Signature */}
            <div className="mx-6 mb-6 border-2 border-ff-teal border-dashed rounded-lg p-4 text-center">
              <p className="text-sm font-medium text-ff-teal-dark">
                Click to Sign Electronically
              </p>
              <p className="text-xs text-ff-text-secondary mt-1">
                Secure digital signature powered by FieldFlo
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
