import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Dropdown from '../../ui/Dropdown';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';

const statusBadgeVariant: Record<string, 'red' | 'amber' | 'green'> = {
  open: 'red',
  pending_confirmation: 'amber',
  pending_response: 'amber',
  resolved: 'green',
};

const statusLabel: Record<string, string> = {
  open: 'Open',
  pending_confirmation: 'Pending Confirmation',
  pending_response: 'Pending Response',
  resolved: 'Resolved',
};

const severityVariant: Record<string, 'red' | 'amber' | 'muted'> = {
  high: 'red',
  medium: 'amber',
  low: 'muted',
};

const statusOptions = [
  { value: 'open', label: 'Open' },
  { value: 'pending_confirmation', label: 'Pending Confirmation' },
  { value: 'pending_response', label: 'Pending Response' },
  { value: 'resolved', label: 'Resolved' },
];

export default function UnknownsRegister() {
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [resolutions, setResolutions] = useState<Record<string, string>>({});

  if (!activeLead) return null;

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleStatusChange = (id: string, newStatus: string) => {
    dispatch({
      type: 'UPDATE_UNKNOWN',
      payload: { id, status: newStatus, resolution: resolutions[id] },
    });
  };

  const handleResolutionChange = (id: string, value: string) => {
    setResolutions((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-ff-text">Unknowns Register</h2>
        <span className="text-sm text-ff-text-secondary">
          {activeLead.unknowns.filter((u) => u.status !== 'resolved').length} open
        </span>
      </div>

      <div className="space-y-3">
        {activeLead.unknowns.map((unknown) => {
          const isOpen = expanded.has(unknown.id);

          return (
            <Card key={unknown.id} className="overflow-hidden">
              {/* ── Summary row ──────────────────────────────────────────── */}
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50/50 transition-colors"
                onClick={() => toggle(unknown.id)}
              >
                {isOpen ? (
                  <ChevronDown size={16} className="text-ff-text-secondary shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-ff-text-secondary shrink-0" />
                )}

                <span className="flex-1 text-sm font-medium text-ff-text truncate">
                  {unknown.title}
                </span>

                <Badge variant={severityVariant[unknown.severity]} size="sm">
                  {unknown.severity}
                </Badge>

                <span className="text-xs text-ff-text-secondary w-24 text-right shrink-0 hidden sm:block">
                  {unknown.ownerName}
                </span>

                <span className="text-xs text-ff-text-muted w-24 text-right shrink-0 hidden md:block">
                  {unknown.deadline}
                </span>

                <Badge variant={statusBadgeVariant[unknown.status]} size="sm">
                  {statusLabel[unknown.status]}
                </Badge>
              </button>

              {/* ── Expanded details ─────────────────────────────────────── */}
              {isOpen && (
                <div className="border-t border-ff-border px-4 py-4 space-y-4 bg-gray-50/30">
                  <p className="text-sm text-ff-text-secondary">{unknown.description}</p>

                  <div className="flex flex-wrap items-center gap-4 text-xs">
                    <span className="text-ff-text-muted">Source: {unknown.source}</span>
                    <span className="text-ff-text-muted">Owner: {unknown.ownerName}</span>
                    <span className="text-ff-text-muted">Deadline: {unknown.deadline}</span>
                  </div>

                  {/* Status update */}
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-ff-text shrink-0">Status:</label>
                    <Dropdown
                      options={statusOptions}
                      value={unknown.status}
                      onChange={(v) => handleStatusChange(unknown.id, v)}
                      className="w-56"
                    />
                  </div>

                  {/* Resolution field for resolved items */}
                  {unknown.status === 'resolved' && (
                    <div>
                      <label className="block text-sm font-medium text-ff-text mb-1">
                        Resolution
                      </label>
                      <textarea
                        className="w-full bg-white border border-ff-border rounded-md px-3 py-2 text-sm text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none resize-none"
                        rows={2}
                        placeholder="How was this resolved?"
                        value={resolutions[unknown.id] ?? unknown.resolution ?? ''}
                        onChange={(e) => handleResolutionChange(unknown.id, e.target.value)}
                        onBlur={() =>
                          dispatch({
                            type: 'UPDATE_UNKNOWN',
                            payload: {
                              id: unknown.id,
                              status: unknown.status,
                              resolution: resolutions[unknown.id],
                            },
                          })
                        }
                      />
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
