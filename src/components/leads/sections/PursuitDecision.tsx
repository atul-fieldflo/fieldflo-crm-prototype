import { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle2 } from 'lucide-react';
import Card from '../../ui/Card';
import Badge from '../../ui/Badge';
import Button from '../../ui/Button';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';

export default function PursuitDecision() {
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  const [selected, setSelected] = useState<'pursue' | 'no_bid' | ''>(
    activeLead?.pursuitDecision || ''
  );
  const [notes, setNotes] = useState(activeLead?.pursuitNotes || '');
  const [recorded, setRecorded] = useState(activeLead?.pursuitDecisionRecorded || false);

  if (!activeLead) return null;

  const handleRecord = () => {
    if (!selected) return;
    dispatch({ type: 'SET_FIELD', payload: { field: 'pursuitDecision', value: selected } });
    dispatch({ type: 'SET_FIELD', payload: { field: 'pursuitNotes', value: notes } });
    dispatch({ type: 'SET_FIELD', payload: { field: 'pursuitDecisionRecorded', value: true } });
    setRecorded(true);
  };

  if (recorded) {
    return (
      <div className="space-y-6">
        <h2 className="text-lg font-semibold text-ff-text">Pursuit Decision</h2>
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 size={20} className="text-green-500" />
            <span className="text-sm font-semibold text-ff-text">Decision Recorded</span>
          </div>

          <div className="flex items-center gap-3 mb-3">
            <Badge variant={selected === 'pursue' ? 'green' : 'red'} size="md">
              {selected === 'pursue' ? 'Pursue' : 'No Bid'}
            </Badge>
          </div>

          {notes && (
            <div>
              <p className="text-xs font-medium text-ff-text-secondary mb-1">Notes</p>
              <p className="text-sm text-ff-text">{notes}</p>
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-ff-text">Pursuit Decision</h2>

      {/* ── Decision Cards ──────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2">
        {/* Pursue */}
        <Card
          hover
          onClick={() => setSelected('pursue')}
          className={`p-6 text-center transition-all ${
            selected === 'pursue'
              ? 'border-green-500 border-2 bg-green-50/30 shadow-sm'
              : 'hover:border-green-300'
          }`}
        >
          <ThumbsUp
            size={32}
            className={`mx-auto mb-3 ${
              selected === 'pursue' ? 'text-green-600' : 'text-gray-400'
            }`}
          />
          <p className="text-lg font-semibold text-ff-text">Pursue</p>
          <p className="text-sm text-ff-text-secondary mt-1">
            Move forward with estimating and proposal
          </p>
        </Card>

        {/* No Bid */}
        <Card
          hover
          onClick={() => setSelected('no_bid')}
          className={`p-6 text-center transition-all ${
            selected === 'no_bid'
              ? 'border-red-500 border-2 bg-red-50/30 shadow-sm'
              : 'hover:border-red-300'
          }`}
        >
          <ThumbsDown
            size={32}
            className={`mx-auto mb-3 ${
              selected === 'no_bid' ? 'text-red-600' : 'text-gray-400'
            }`}
          />
          <p className="text-lg font-semibold text-ff-text">No Bid</p>
          <p className="text-sm text-ff-text-secondary mt-1">
            Decline to bid on this opportunity
          </p>
        </Card>
      </div>

      {/* ── Notes ──────────────────────────────────────────────────────── */}
      <div>
        <label className="block text-sm font-medium text-ff-text mb-1">Notes</label>
        <textarea
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full bg-white border border-ff-border rounded-md px-3 py-2 text-sm text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none resize-none"
          placeholder="Optional — rationale, conditions, follow-ups..."
        />
      </div>

      {/* ── Submit ─────────────────────────────────────────────────────── */}
      <Button
        variant="primary"
        size="md"
        disabled={!selected}
        onClick={handleRecord}
      >
        Record Decision
      </Button>
    </div>
  );
}
