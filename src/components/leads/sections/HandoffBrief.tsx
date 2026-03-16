import { useState } from 'react';
import { Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import AIProcessingOverlay from '../../ui/AIProcessingOverlay';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';
import { discoveryPacketData, riskSignals, existingLeads } from '../../../mockData';

export default function HandoffBrief() {
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();
  const [processing, setProcessing] = useState(false);
  const [generated, setGenerated] = useState(activeLead?.handoffBriefGenerated || false);

  if (!activeLead) return null;

  const lead = existingLeads.find((l) => l.id === activeLead.clientId?.replace('c-', 'l-')) || existingLeads[0];

  const handleGenerate = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setGenerated(true);
      dispatch({ type: 'SET_FIELD', payload: { field: 'handoffBriefGenerated', value: true } });
    }, 1800);
  };

  const openUnknowns = activeLead.unknowns.filter((u) => u.status !== 'resolved');

  if (!generated && !processing) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-ff-text">Handoff Brief</h2>
        <Card className="p-8 text-center">
          <Sparkles size={32} className="mx-auto mb-4 text-ff-teal" />
          <p className="text-sm text-ff-text-secondary mb-6">
            Generate an AI-powered handoff brief for the estimating team.
            This summarizes all discovery findings, risks, and open items.
          </p>
          <Button variant="primary" size="lg" onClick={handleGenerate}>
            <Sparkles size={16} className="mr-2" />
            Generate Handoff Brief
          </Button>
        </Card>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-ff-text">Handoff Brief</h2>
        <AIProcessingOverlay label="Generating handoff brief..." sublabel="Compiling discovery findings, risk signals, and unknowns" inline />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ff-text">Handoff Brief</h2>
        <Badge variant="ai">AI</Badge>
      </div>

      {/* ── Brief Document ─────────────────────────────────────────────── */}
      <Card className="p-6 space-y-6">
        {/* Lead Summary */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ff-text uppercase tracking-wide">Lead Summary</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
            <div>
              <span className="text-ff-text-muted">Lead:</span>{' '}
              <span className="text-ff-text font-medium">{activeLead.leadName || lead.name}</span>
            </div>
            <div>
              <span className="text-ff-text-muted">Client:</span>{' '}
              <span className="text-ff-text font-medium">{activeLead.clientName || lead.clientName}</span>
            </div>
            <div>
              <span className="text-ff-text-muted">Work Types:</span>{' '}
              <span className="text-ff-text font-medium">
                {(activeLead.workTypes.length ? activeLead.workTypes : lead.workTypes).join(', ')}
              </span>
            </div>
            <div>
              <span className="text-ff-text-muted">Site:</span>{' '}
              <span className="text-ff-text font-medium">
                {discoveryPacketData.siteClassification.facilityType}
              </span>
            </div>
            <div>
              <span className="text-ff-text-muted">Bid Due:</span>{' '}
              <span className="text-ff-text font-medium">{activeLead.bidDue || lead.bidDue}</span>
            </div>
            <div>
              <span className="text-ff-text-muted">Confidence:</span>{' '}
              <span className="text-ff-text font-medium">{activeLead.confidence}</span>
            </div>
          </div>
        </section>

        <hr className="border-ff-border" />

        {/* Key Findings */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ff-text uppercase tracking-wide">Key Findings from Discovery</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          <ul className="space-y-2 text-sm text-ff-text-secondary">
            {discoveryPacketData.scopeSummary.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-ff-text-muted mt-0.5 shrink-0">&#8226;</span>
                <span>{item.text}</span>
              </li>
            ))}
            {discoveryPacketData.hazardIndicators
              .filter((h) => h.type !== 'clear')
              .map((h, i) => (
                <li key={`h-${i}`} className="flex items-start gap-2">
                  <span className="text-ff-text-muted mt-0.5 shrink-0">&#8226;</span>
                  <span>
                    <strong>{h.type === 'confirmed' ? 'Confirmed' : 'Presumed'}:</strong> {h.label} ({h.area})
                  </span>
                </li>
              ))}
          </ul>
        </section>

        <hr className="border-ff-border" />

        {/* Risk Signals */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ff-text uppercase tracking-wide">Risk Signals</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          <div className="space-y-2">
            {riskSignals.map((signal) => (
              <div key={signal.id} className="flex items-start gap-2 text-sm">
                <Badge variant={signal.severity === 'high' ? 'red' : 'amber'} size="sm">
                  {signal.severity}
                </Badge>
                <div>
                  <span className="font-medium text-ff-text">{signal.title}</span>
                  <span className="text-ff-text-secondary"> &mdash; {signal.description.slice(0, 120)}...</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-ff-border" />

        {/* Open Unknowns */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ff-text uppercase tracking-wide">Open Unknowns</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          {openUnknowns.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {openUnknowns.map((u) => (
                <li key={u.id} className="flex items-start gap-2">
                  <Badge variant={u.severity === 'high' ? 'red' : 'amber'} size="sm">
                    {u.severity}
                  </Badge>
                  <div>
                    <span className="font-medium text-ff-text">{u.title}</span>
                    <span className="text-ff-text-secondary"> &mdash; Owner: {u.ownerName}, Deadline: {u.deadline}</span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-green-600">All unknowns resolved.</p>
          )}
        </section>

        <hr className="border-ff-border" />

        {/* Recommended Next Steps */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold text-ff-text uppercase tracking-wide">Recommended Next Steps</h3>
            <Badge variant="ai">AI</Badge>
          </div>
          <ol className="space-y-2 text-sm text-ff-text-secondary list-decimal list-inside">
            <li>Confirm ICRA Class III containment requirements with building management before finalizing abatement scope.</li>
            <li>Schedule additional hazmat testing for mechanical room pipe insulation before bid submission.</li>
            <li>Obtain written confirmation of freight elevator priority access (6 AM &ndash; 2 PM).</li>
            <li>Factor phased access constraints into production rate assumptions &mdash; expect 15&ndash;20% reduction.</li>
            <li>Request utility shutoff documentation from GC before mobilization planning.</li>
          </ol>
        </section>
      </Card>
    </div>
  );
}
