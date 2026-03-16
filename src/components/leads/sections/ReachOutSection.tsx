import { useState } from 'react';
import { Phone, Plus, Sparkles, ArrowUpRight } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import Dropdown from '../../ui/Dropdown';
import AIProcessingOverlay from '../../ui/AIProcessingOverlay';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';
import { reachOutExtractedSignals, clients } from '../../../mockData';

const methodOptions = [
  { value: 'phone', label: 'Phone' },
  { value: 'email', label: 'Email' },
  { value: 'in_person', label: 'In Person' },
];

interface ReachOutEntry {
  id: string;
  contact: string;
  method: string;
  date: string;
  notes: string;
}

const sampleEntry: ReachOutEntry = {
  id: 'ro-01',
  contact: 'Jen Martinez',
  method: 'Phone',
  date: '2026-03-14',
  notes:
    'Called Jen to confirm elevator access schedule and ask about ICRA. She said GC will have written confirmation by Friday. Elevator priority access is 6 AM to 2 PM as discussed on walk. She is checking with building management on whether ICRA applies given the pediatric clinic below. Also mentioned a potential Q2 project — different campus off Chandler Blvd. Should flag for Diana.',
};

export default function ReachOutSection() {
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  const [showForm, setShowForm] = useState(false);
  const [entries, setEntries] = useState<ReachOutEntry[]>([sampleEntry]);
  const [contact, setContact] = useState('');
  const [method, setMethod] = useState('phone');
  const [notes, setNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [showExtracted, setShowExtracted] = useState(false);
  const [extractedApplied, setExtractedApplied] = useState(false);

  if (!activeLead) return null;

  const client = clients.find((c) => c.id === activeLead.clientId);
  const contactOptions = client
    ? client.contacts.map((c) => ({ value: c.name, label: `${c.name} — ${c.title}` }))
    : [{ value: 'Jen Martinez', label: 'Jen Martinez — Project Coordinator' }];

  const today = '2026-03-15';

  const handleSave = () => {
    if (!notes.trim()) return;

    const newEntry: ReachOutEntry = {
      id: `ro-${Date.now()}`,
      contact: contact || contactOptions[0]?.value || 'Unknown',
      method: methodOptions.find((m) => m.value === method)?.label || method,
      date: today,
      notes,
    };

    setEntries((prev) => [newEntry, ...prev]);
    setShowForm(false);

    // Trigger AI processing
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setShowExtracted(true);
    }, 1200);
  };

  const handleApplySignals = () => {
    // Update unknowns in context
    reachOutExtractedSignals
      .filter((s) => s.type === 'unknown_update')
      .forEach((s) => {
        if ('unknownId' in s && 'newStatus' in s) {
          dispatch({
            type: 'UPDATE_UNKNOWN',
            payload: { id: s.unknownId!, status: s.newStatus! },
          });
        }
      });

    dispatch({ type: 'SET_FIELD', payload: { field: 'reachOutLogged', value: true } });
    setExtractedApplied(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ff-text">Reach-Out Log</h2>
        {!showForm && (
          <Button size="sm" variant="primary" onClick={() => setShowForm(true)}>
            <Plus size={14} className="mr-1" />
            Log Reach-Out
          </Button>
        )}
      </div>

      {/* ── Inline Form ──────────────────────────────────────────────────── */}
      {showForm && (
        <Card className="p-5 space-y-4">
          <h3 className="text-sm font-semibold text-ff-text">New Reach-Out</h3>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Contact</label>
              <Dropdown
                options={contactOptions}
                value={contact}
                onChange={setContact}
                placeholder="Select contact"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Method</label>
              <Dropdown options={methodOptions} value={method} onChange={setMethod} />
            </div>
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Date</label>
              <input
                type="date"
                value={today}
                readOnly
                className="w-full bg-white border border-ff-border rounded-md px-3 py-2 text-sm text-ff-text"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-ff-text mb-1">Notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-white border border-ff-border rounded-md px-3 py-2 text-sm text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none resize-none"
              placeholder="Summarize the conversation..."
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="sm" variant="primary" onClick={handleSave} disabled={!notes.trim()}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* ── AI Processing ────────────────────────────────────────────────── */}
      {processing && (
        <AIProcessingOverlay label="Extracting signals from your notes..." inline />
      )}

      {/* ── Extracted Signals ────────────────────────────────────────────── */}
      {showExtracted && !processing && (
        <Card className="p-5 bg-ff-teal-light/30 border-ff-teal/20">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles size={16} className="text-ff-teal" />
            <span className="text-sm font-semibold text-ff-text">Extracted Signals</span>
            <Badge variant="ai">AI</Badge>
          </div>

          <div className="space-y-3">
            {reachOutExtractedSignals.map((signal, i) => (
              <div
                key={i}
                className="flex items-start gap-3 bg-white/60 rounded-lg p-3 border border-ff-border/50"
              >
                {signal.type === 'unknown_update' ? (
                  <ArrowUpRight size={14} className="text-amber-500 mt-0.5 shrink-0" />
                ) : (
                  <Sparkles size={14} className="text-ff-teal mt-0.5 shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-ff-text">{signal.label}</p>
                  <p className="text-xs text-ff-text-secondary mt-0.5">
                    {'update' in signal ? signal.update : signal.note}
                  </p>
                  {signal.type === 'unknown_update' && 'newStatus' in signal && (
                    <Badge variant="amber" size="sm">
                      {(signal.newStatus as string).replace(/_/g, ' ')}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>

          {!extractedApplied && (
            <div className="mt-4">
              <Button size="sm" variant="primary" onClick={handleApplySignals}>
                Apply Updates
              </Button>
            </div>
          )}
          {extractedApplied && (
            <p className="text-xs text-green-600 font-medium mt-3">Updates applied to unknowns register.</p>
          )}
        </Card>
      )}

      {/* ── Existing Entries ──────────────────────────────────────────────── */}
      <div className="space-y-3">
        {entries.map((entry) => (
          <Card key={entry.id} className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <Phone size={14} className="text-ff-text-secondary" />
              <span className="text-sm font-medium text-ff-text">{entry.contact}</span>
              <Badge variant="muted" size="sm">{entry.method}</Badge>
              <span className="text-xs text-ff-text-muted ml-auto">{entry.date}</span>
            </div>
            <p className="text-sm text-ff-text-secondary leading-relaxed">{entry.notes}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
