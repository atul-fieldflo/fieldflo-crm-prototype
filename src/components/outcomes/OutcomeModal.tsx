import { useState } from 'react';
import { motion } from 'framer-motion';
import { Trophy, XCircle, MinusCircle } from 'lucide-react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Dropdown from '../ui/Dropdown';
import { useAppContext, useAppDispatch } from '../../context/AppContext';

interface OutcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OutcomeResult = 'won' | 'lost' | 'no_bid' | '';

const lossReasonOptions = [
  { value: 'price', label: 'Price' },
  { value: 'timeline', label: 'Timeline' },
  { value: 'scope', label: 'Scope' },
  { value: 'relationship', label: 'Relationship' },
  { value: 'competitor_quality', label: 'Competitor Quality' },
  { value: 'other', label: 'Other' },
];

export default function OutcomeModal({ isOpen, onClose }: OutcomeModalProps) {
  const state = useAppContext();
  const dispatch = useAppDispatch();

  const [selectedResult, setSelectedResult] = useState<OutcomeResult>('');
  const [finalContractValue, setFinalContractValue] = useState('');
  const [winNotes, setWinNotes] = useState('');
  const [lossReason, setLossReason] = useState('');
  const [competitor, setCompetitor] = useState('');
  const [competitorPrice, setCompetitorPrice] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const resetForm = () => {
    setSelectedResult('');
    setFinalContractValue('');
    setWinNotes('');
    setLossReason('');
    setCompetitor('');
    setCompetitorPrice('');
    setLessonsLearned('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleRecordWin = () => {
    dispatch({ type: 'SET_FIELD', payload: { field: 'outcomeResult', value: 'won' } });
    dispatch({ type: 'SET_PROPOSAL_STATUS', payload: 'awarded' });
    if (finalContractValue) {
      dispatch({ type: 'SET_FIELD', payload: { field: 'contractValue', value: finalContractValue } });
    }
    resetForm();
    onClose();
  };

  const handleRecordLossOrNoBid = () => {
    dispatch({ type: 'SET_FIELD', payload: { field: 'outcomeResult', value: selectedResult } });
    dispatch({
      type: 'SET_PROPOSAL_STATUS',
      payload: selectedResult === 'lost' ? 'sent' : 'none',
    });
    resetForm();
    onClose();
  };

  const resultCards: {
    value: OutcomeResult;
    label: string;
    icon: typeof Trophy;
    color: string;
    selectedBorder: string;
    selectedBg: string;
  }[] = [
    {
      value: 'won',
      label: 'Won',
      icon: Trophy,
      color: 'text-green-600',
      selectedBorder: 'border-green-500',
      selectedBg: 'bg-green-50',
    },
    {
      value: 'lost',
      label: 'Lost',
      icon: XCircle,
      color: 'text-red-600',
      selectedBorder: 'border-red-500',
      selectedBg: 'bg-red-50',
    },
    {
      value: 'no_bid',
      label: 'No Bid',
      icon: MinusCircle,
      color: 'text-gray-500',
      selectedBorder: 'border-gray-400',
      selectedBg: 'bg-gray-50',
    },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Record Outcome" size="lg">
      <div className="space-y-6">
        {/* Result selection cards */}
        <div>
          <label className="block text-sm font-medium text-ff-text mb-3">Result</label>
          <div className="grid grid-cols-3 gap-3">
            {resultCards.map((card) => {
              const Icon = card.icon;
              const isSelected = selectedResult === card.value;
              return (
                <motion.button
                  key={card.value}
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  animate={isSelected ? { scale: 1.03 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                  onClick={() => setSelectedResult(card.value)}
                  className={`relative flex flex-col items-center gap-2 p-5 rounded-xl border-2 transition-colors ${
                    isSelected
                      ? `${card.selectedBorder} ${card.selectedBg}`
                      : 'border-ff-border bg-white hover:border-gray-300'
                  }`}
                >
                  <Icon size={28} className={isSelected ? card.color : 'text-gray-400'} />
                  <span
                    className={`text-sm font-semibold ${
                      isSelected ? card.color : 'text-ff-text-secondary'
                    }`}
                  >
                    {card.label}
                  </span>
                  {isSelected && (
                    <motion.div
                      layoutId="outcome-indicator"
                      className={`absolute -top-1 -right-1 w-5 h-5 rounded-full ${
                        card.value === 'won'
                          ? 'bg-green-500'
                          : card.value === 'lost'
                          ? 'bg-red-500'
                          : 'bg-gray-400'
                      } flex items-center justify-center`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    >
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </motion.div>
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Won fields */}
        {selectedResult === 'won' && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <Input
              label="Final Contract Value"
              type="number"
              placeholder="e.g. 187500"
              value={finalContractValue}
              onChange={(e) => setFinalContractValue(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Notes</label>
              <textarea
                className="w-full bg-white border border-ff-border rounded-md text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="Any notes about the win..."
                value={winNotes}
                onChange={(e) => setWinNotes(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button size="lg" onClick={handleRecordWin} className="w-full bg-green-600 hover:bg-green-700">
                Record Win
              </Button>
            </div>
          </motion.div>
        )}

        {/* Lost / No Bid fields */}
        {(selectedResult === 'lost' || selectedResult === 'no_bid') && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Loss Reason</label>
              <Dropdown
                options={lossReasonOptions}
                value={lossReason}
                onChange={setLossReason}
                placeholder="Select reason..."
              />
            </div>
            <Input
              label="Competitor"
              placeholder="Competitor name"
              value={competitor}
              onChange={(e) => setCompetitor(e.target.value)}
            />
            <Input
              label="Competitor Price (optional)"
              type="number"
              placeholder="e.g. 165000"
              value={competitorPrice}
              onChange={(e) => setCompetitorPrice(e.target.value)}
            />
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Lessons Learned</label>
              <textarea
                className="w-full bg-white border border-ff-border rounded-md text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none px-3 py-2 text-sm resize-none"
                rows={3}
                placeholder="What can we learn from this outcome?"
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
              />
            </div>
            <div className="pt-2">
              <Button
                size="lg"
                onClick={handleRecordLossOrNoBid}
                className={`w-full ${
                  selectedResult === 'lost'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-gray-500 hover:bg-gray-600'
                }`}
              >
                {selectedResult === 'lost' ? 'Record Loss' : 'Record No Bid'}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  );
}
