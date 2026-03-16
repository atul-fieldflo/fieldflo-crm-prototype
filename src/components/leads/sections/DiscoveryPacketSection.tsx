import { AlertTriangle, AlertCircle, FileWarning, ArrowRight, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import ProgressRing from '../../ui/ProgressRing';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';
import { discoveryPacketData, riskSignals, completenessStates } from '../../../mockData';

const completeness = completenessStates.afterDocUpload;

const hazardBorderColor: Record<string, string> = {
  confirmed: 'border-l-4 border-l-green-500',
  presumed: 'border-l-4 border-l-amber-400',
  clear: 'border-l-4 border-l-gray-300',
};

const hazardLabel: Record<string, string> = {
  confirmed: 'Confirmed',
  presumed: 'Presumed',
  clear: 'Clear',
};

const hazardBadgeVariant: Record<string, 'green' | 'amber' | 'muted'> = {
  confirmed: 'green',
  presumed: 'amber',
  clear: 'muted',
};

export default function DiscoveryPacketSection() {
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  if (!activeLead) return null;

  const handleNavigateToPursuit = () => {
    dispatch({ type: 'SET_ACTIVE_SECTION', payload: 'pursuit-decision' });
  };

  return (
    <div className="space-y-8">
      {/* ── Completeness ─────────────────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-start gap-6">
          <ProgressRing value={completeness.score} size={96} strokeWidth={8} />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-ff-text mb-3">Discovery Completeness</h3>
            <ul className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {completeness.items.map((item) => (
                <li key={item.item} className="flex items-center gap-2 text-sm">
                  {item.status === 'present' ? (
                    <CheckCircle2 size={14} className="text-green-500 shrink-0" />
                  ) : (
                    <XCircle size={14} className="text-gray-300 shrink-0" />
                  )}
                  <span className={item.status === 'present' ? 'text-ff-text' : 'text-ff-text-muted'}>
                    {item.item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {/* ── Site Classification ──────────────────────────────────────────── */}
      <Card className="p-6">
        <h3 className="text-sm font-semibold text-ff-text mb-4">Site Classification</h3>
        <p className="text-sm text-ff-text-secondary mb-3">{discoveryPacketData.siteClassification.facilityType}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {discoveryPacketData.siteClassification.workTypesDetected.map((wt) => (
            <Badge key={wt} variant="teal" size="sm">{wt}</Badge>
          ))}
          <Badge variant={discoveryPacketData.siteClassification.confidence === 'High' ? 'green' : 'amber'} size="sm">
            {discoveryPacketData.siteClassification.confidence} confidence
          </Badge>
        </div>
      </Card>

      {/* ── Scope Summary ────────────────────────────────────────────────── */}
      <Card className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <h3 className="text-sm font-semibold text-ff-text">Scope Summary</h3>
          <Badge variant="ai">AI</Badge>
        </div>
        <ul className="space-y-3">
          {discoveryPacketData.scopeSummary.map((item, i) => (
            <li key={i} className="flex items-start gap-3 text-sm">
              <span className="text-ff-text-muted mt-0.5 shrink-0">&#8226;</span>
              <div className="flex-1">
                <span className="text-ff-text">{item.text}</span>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="teal" size="sm">{item.source}</Badge>
                  <Badge
                    variant={item.confidence === 'high' ? 'green' : 'amber'}
                    size="sm"
                  >
                    {item.confidence}
                  </Badge>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* ── Hazard Indicators ────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-ff-text mb-3">Hazard Indicators</h3>
        <div className="space-y-3">
          {discoveryPacketData.hazardIndicators.map((hazard, i) => (
            <Card key={i} className={`p-4 ${hazardBorderColor[hazard.type]}`}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-ff-text">{hazard.label}</span>
                    <Badge variant={hazardBadgeVariant[hazard.type]} size="sm">
                      {hazardLabel[hazard.type]}
                    </Badge>
                  </div>
                  <p className="text-xs text-ff-text-secondary">Area: {hazard.area}</p>
                </div>
                <Badge variant="teal" size="sm">{hazard.source}</Badge>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* ── Risk Signals ─────────────────────────────────────────────────── */}
      <div>
        <h3 className="text-sm font-semibold text-ff-text mb-3">Risk Signals</h3>
        <div className="grid gap-3 md:grid-cols-3">
          {riskSignals.map((signal) => {
            const isHigh = signal.severity === 'high';
            const Icon = isHigh ? AlertTriangle : AlertCircle;
            const borderColor = isHigh ? 'border-red-300' : 'border-amber-300';
            const iconColor = isHigh ? 'text-red-500' : 'text-amber-500';
            const bgColor = isHigh ? 'bg-red-50/40' : 'bg-amber-50/40';

            return (
              <Card key={signal.id} className={`p-4 ${borderColor} ${bgColor}`}>
                <div className="flex items-start gap-2 mb-2">
                  <Icon size={16} className={`${iconColor} shrink-0 mt-0.5`} />
                  <span className="text-sm font-medium text-ff-text leading-snug">{signal.title}</span>
                </div>
                <p className="text-xs text-ff-text-secondary line-clamp-2 mb-3">{signal.description}</p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {signal.sources.map((src) => (
                    <Badge key={src} variant="teal" size="sm">{src}</Badge>
                  ))}
                  <Badge variant={signal.status === 'active' ? 'red' : 'green'} size="sm">
                    {signal.status}
                  </Badge>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* ── Missing Documents ────────────────────────────────────────────── */}
      <Card className="p-5">
        <h3 className="text-sm font-semibold text-ff-text mb-3">Missing Documents</h3>
        <ul className="space-y-2">
          {discoveryPacketData.missingDocuments.map((doc, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ff-text-secondary">
              <FileWarning size={14} className="text-amber-500 shrink-0 mt-0.5" />
              {doc}
            </li>
          ))}
        </ul>
      </Card>

      {/* ── Pursuit Callout ──────────────────────────────────────────────── */}
      {!activeLead.pursuitDecisionRecorded && (
        <div className="bg-ff-teal-light border border-ff-teal/20 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-ff-teal" />
            <span className="text-sm font-medium text-ff-teal-dark">
              Pursuit decision not yet recorded
            </span>
          </div>
          <Button size="sm" variant="primary" onClick={handleNavigateToPursuit}>
            Go to Pursuit Decision <ArrowRight size={14} className="ml-1" />
          </Button>
        </div>
      )}

      {/* ── Generate Brief ───────────────────────────────────────────────── */}
      <div className="pt-2">
        <Button
          variant="primary"
          size="lg"
          onClick={() => dispatch({ type: 'SET_DISCOVERY_READY' })}
        >
          <Sparkles size={16} className="mr-2" />
          Generate Discovery Brief
        </Button>
      </div>
    </div>
  );
}
