import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Paperclip, CheckCircle2, Clock, Shield, Zap, FileText, Mic, MapPin, ListChecks, Calculator, Send } from 'lucide-react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import Button from '../ui/Button';
import Badge from '../ui/Badge';
import Input from '../ui/Input';
import Card from '../ui/Card';

type ApprovalState = 'pending' | 'approved' | 'rejected';
type SendState = 'idle' | 'processing' | 'sent';

export default function SendProposalModal() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const state = useAppContext();
  const dispatch = useAppDispatch();
  const lead = state.activeLead;

  const [recipientEmail] = useState('jen.martinez@westfieldconstruction.com');
  const [subject, setSubject] = useState(
    `Proposal: ${lead?.leadName || 'Chandler Medical Plaza — Demo + Abatement'}`
  );
  const [message, setMessage] = useState(
    `Dear Jen,\n\nPlease find attached our proposal for the ${lead?.leadName || 'Chandler Medical Plaza — Demo + Abatement'} project. This proposal is valid for 30 days from the date of issue.\n\nWe appreciate the opportunity to bid on this project and look forward to working with Westfield Construction. Please don't hesitate to reach out with any questions.\n\nBest regards,\nMarcus Chen\nBusiness Development Manager\nPinnacle Environmental Services\n(602) 555-0100`
  );
  const [approvalState, setApprovalState] = useState<ApprovalState>('pending');
  const [sendState, setSendState] = useState<SendState>('idle');

  const handleApprove = () => {
    setApprovalState('approved');
  };

  const handleReject = () => {
    setApprovalState('rejected');
  };

  const handleSend = () => {
    setSendState('processing');
    setTimeout(() => {
      setSendState('sent');
      dispatch({ type: 'SET_PROPOSAL_STATUS', payload: 'sent' });
    }, 1500);
  };

  const speedIndexSteps = [
    { step: 'Phone call from adjuster', time: '~3 min' },
    { step: 'Voice intake + confirm', time: '2 min' },
    { step: 'Fill site address, value', time: '1 min' },
    { step: 'Task picker + quantities', time: '2 min' },
    { step: 'Review pricing, set markup', time: '2 min' },
    { step: 'Preview and send', time: '2 min' },
  ];

  const whatMadeItFast = [
    'Voice-to-CRM capture eliminated manual data entry',
    'AI extracted line items from uploaded documents',
    'Task library pre-loaded with production rates',
    'Client rate sheet auto-applied pricing overrides',
    'One-click section grouping and markup',
    'Digital signature built into proposal output',
    'Approval workflow integrated — no email chain',
  ];

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <button
        onClick={() => navigate(`/crm/leads/${leadId}/proposals/canvas`)}
        className="flex items-center gap-2 text-sm text-ff-text-secondary hover:text-ff-text transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to Proposal
      </button>

      <h1 className="text-2xl font-semibold text-ff-text mb-8">Send Proposal</h1>

      <AnimatePresence mode="wait">
        {sendState === 'sent' ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* Success message */}
            <Card className="p-8 text-center mb-8">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              >
                <CheckCircle2 size={48} className="text-green-500 mx-auto mb-4" />
              </motion.div>
              <h2 className="text-xl font-semibold text-ff-text mb-2">
                Proposal sent successfully!
              </h2>
              <p className="text-sm text-ff-text-secondary">
                Sent to {recipientEmail}
              </p>
            </Card>

            {/* Speed Index Card */}
            <Card className="p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <Zap size={20} className="text-ff-teal" />
                <h3 className="text-lg font-semibold text-ff-text">Speed Index</h3>
              </div>

              <p className="text-sm text-ff-text-secondary mb-4">
                Time Breakdown
              </p>

              <table className="w-full text-sm mb-6">
                <thead>
                  <tr className="border-b border-ff-border">
                    <th className="text-left py-2 font-medium text-ff-text-secondary">Step</th>
                    <th className="text-right py-2 font-medium text-ff-text-secondary">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {speedIndexSteps.map((row, i) => (
                    <tr key={i} className="border-b border-gray-100">
                      <td className="py-2 text-ff-text">{row.step}</td>
                      <td className="py-2 text-right text-ff-text-secondary">{row.time}</td>
                    </tr>
                  ))}
                  <tr className="border-t-2 border-ff-teal-dark">
                    <td className="py-2 font-bold text-ff-text">
                      Lead created → proposal sent
                    </td>
                    <td className="py-2 text-right font-bold text-ff-teal-dark">
                      ~12 min
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <p className="text-sm font-medium text-ff-text mb-3">What Made It Fast</p>
                <ul className="space-y-2">
                  {whatMadeItFast.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ff-text">
                      <CheckCircle2 size={16} className="text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Card>

            <div className="text-center">
              <Button
                variant="primary"
                onClick={() => navigate(`/crm/leads/${leadId}`)}
              >
                Return to Lead
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Email Form Card */}
            <Card className="p-6 mb-6">
              <div className="space-y-4">
                {/* Recipient */}
                <div>
                  <label className="block text-sm font-medium text-ff-text mb-1">
                    Recipient
                  </label>
                  <div className="bg-gray-50 border border-ff-border rounded-md px-3 py-2 text-sm text-ff-text">
                    {recipientEmail}
                  </div>
                </div>

                {/* Subject */}
                <Input
                  label="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-ff-text mb-1">
                    Message
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={8}
                    className="w-full bg-white border border-ff-border rounded-md text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none px-3 py-2 text-sm resize-y"
                  />
                </div>

                {/* Attachment */}
                <div>
                  <label className="block text-sm font-medium text-ff-text mb-1">
                    Attachment
                  </label>
                  <div className="flex items-center gap-3 bg-gray-50 border border-ff-border rounded-md px-3 py-2">
                    <Paperclip size={16} className="text-ff-text-secondary" />
                    <span className="text-sm text-ff-text">Proposal-2024-0347.pdf</span>
                    <span className="text-xs text-ff-text-muted ml-auto">2.4 MB</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* CRM Approver Review Card */}
            <Card className="p-6 mb-6">
              <h3 className="text-sm font-semibold text-ff-text mb-3 flex items-center gap-2">
                <Shield size={16} className="text-ff-teal" />
                CRM Approver Review
              </h3>

              {approvalState === 'pending' && (
                <div>
                  <div className="bg-amber-50 border border-amber-200 rounded-md px-4 py-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-amber-600" />
                      <p className="text-sm text-amber-800 font-medium">
                        Pending approval from Diana Torres (VP Operations)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={handleApprove}
                      className="px-4 py-2 text-sm font-medium bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors"
                    >
                      Approve
                    </button>
                    <button
                      onClick={handleReject}
                      className="px-4 py-2 text-sm font-medium bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              )}

              {approvalState === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Badge variant="green" size="md">Approved &#10003;</Badge>
                  <p className="text-xs text-ff-text-secondary mt-2">
                    Approved by Diana Torres (VP Operations)
                  </p>
                </motion.div>
              )}

              {approvalState === 'rejected' && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Badge variant="red" size="md">Rejected</Badge>
                  <p className="text-xs text-ff-text-secondary mt-2">
                    Rejected by Diana Torres (VP Operations). Please revise and resubmit.
                  </p>
                </motion.div>
              )}
            </Card>

            {/* Send Button */}
            <div className="flex justify-end">
              <Button
                variant="primary"
                size="lg"
                disabled={approvalState !== 'approved' || sendState === 'processing'}
                onClick={handleSend}
                className={
                  approvalState !== 'approved'
                    ? 'opacity-50 cursor-not-allowed'
                    : ''
                }
              >
                {sendState === 'processing' ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      className="inline-block"
                    >
                      <Send size={16} />
                    </motion.span>
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} />
                    Send Proposal
                  </span>
                )}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
