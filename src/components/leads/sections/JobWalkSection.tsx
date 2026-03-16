import { Camera, Mic, Clock, Sparkles } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import { jobWalkEvidence } from '../../../mockData';

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

export default function JobWalkSection() {
  return (
    <div className="space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ff-text">Job Walk &mdash; Mar 13, 2026</h2>
          <p className="text-xs text-ff-text-muted mt-0.5">Wave 1b &mdash; mobile, offline-first</p>
        </div>
        <Badge variant="muted" size="md">{jobWalkEvidence.length} items</Badge>
      </div>

      {/* ── Evidence Grid ──────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {jobWalkEvidence.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            {/* Media placeholder */}
            {item.type === 'photo' && (
              <div className="bg-gray-100 h-36 flex items-center justify-center">
                <Camera size={28} className="text-gray-400" />
              </div>
            )}

            {item.type === 'voice_note' && (
              <div className="bg-gray-100 h-28 flex items-center justify-center gap-1 px-6">
                <Mic size={20} className="text-gray-400 mr-2 shrink-0" />
                {/* Waveform bars placeholder */}
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-gray-300 rounded-full w-1"
                    style={{ height: `${12 + Math.sin(i * 0.8) * 10 + Math.random() * 8}px` }}
                  />
                ))}
              </div>
            )}

            {/* Card body */}
            <div className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="teal" size="sm">{item.tag}</Badge>
                <span className="flex items-center gap-1 text-xs text-ff-text-muted">
                  <Clock size={12} />
                  {formatTime(item.timestamp)}
                </span>
              </div>

              {item.note && (
                <p className="text-xs text-ff-text-secondary leading-relaxed">{item.note}</p>
              )}

              {item.transcript && (
                <p className="text-xs text-ff-text-secondary leading-relaxed italic">
                  &ldquo;{item.transcript}&rdquo;
                </p>
              )}

              {/* Extracted items badges */}
              {item.extractedItems && item.extractedItems.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.extractedItems.map((ref) => (
                    <Badge
                      key={ref}
                      variant={ref.startsWith('uk') ? 'amber' : 'red'}
                      size="sm"
                    >
                      {ref.startsWith('uk') ? `Unknown ${ref.replace('uk-', '#')}` : `Risk ${ref.replace('rs-', '#')}`}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* ── AI Summary Card ────────────────────────────────────────────── */}
      <Card className="p-5 bg-ff-teal-light/30 border-ff-teal/20">
        <div className="flex items-start gap-3">
          <Sparkles size={18} className="text-ff-teal shrink-0 mt-0.5" />
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-ff-text">AI Summary</span>
              <Badge variant="ai">AI</Badge>
            </div>
            <p className="text-sm text-ff-text-secondary">
              AI extracted <strong>2 unknowns</strong> and <strong>1 risk signal</strong> from job walk evidence.
              Voice note linked to Unknown #1 (ICRA requirements) and Risk Signal #2 (Occupied medical facility).
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
