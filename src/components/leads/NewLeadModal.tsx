import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  Mic,
  Mail,
  Copy,
  FileText,
  CheckCircle,
  Sparkles,
} from 'lucide-react';
import { existingLeads } from '../../mockData';
import { useAppDispatch } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Tabs from '../ui/Tabs';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import AIProcessingOverlay from '../ui/AIProcessingOverlay';

interface NewLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type IntakeTab = 'upload' | 'voice' | 'email' | 'copy';
type AIState = 'idle' | 'processing' | 'complete';

const tabs = [
  { id: 'upload', label: 'Upload Documents' },
  { id: 'voice', label: 'Voice / Describe' },
  { id: 'email', label: 'Forward Email' },
  { id: 'copy', label: 'Copy Existing Lead' },
];

const simulatedFiles = [
  { name: 'demo-plan-chandler-c.pdf', size: '4.2 MB' },
  { name: 'hazmat-survey-chandler.pdf', size: '2.8 MB' },
  { name: 'scope-narrative.docx', size: '0.4 MB' },
];

const voiceTranscript =
  "Just got off the phone with Jen Martinez from Westfield Construction. They need demo and abatement at the Chandler Medical Plaza, 4th floor Building C. About 8,400 square feet. They've got confirmed asbestos in floor tile. Bid is due next Monday, March 17th. She's sending over the hazmat survey and demo plan.";

const copyCarryOverLabels: Record<string, 'Carried over' | 'Cleared'> = {
  'Lead Name': 'Cleared',
  Client: 'Carried over',
  'Work Types': 'Carried over',
  Salesperson: 'Carried over',
  Estimator: 'Carried over',
  'Bid Due': 'Cleared',
  Status: 'Cleared',
  Confidence: 'Cleared',
  Value: 'Cleared',
};

export default function NewLeadModal({ isOpen, onClose }: NewLeadModalProps) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [activeTab, setActiveTab] = useState<IntakeTab>('upload');
  const [aiState, setAiState] = useState<AIState>('idle');

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadComplete, setUploadComplete] = useState(false);

  // Voice state
  const [recording, setRecording] = useState(false);
  const [transcriptVisible, setTranscriptVisible] = useState(false);

  // Copy state
  const [selectedCopyLead, setSelectedCopyLead] = useState<string | null>(null);

  // Reset all state when modal opens/closes or tab changes
  useEffect(() => {
    if (!isOpen) {
      setActiveTab('upload');
      setAiState('idle');
      setUploading(false);
      setUploadComplete(false);
      setRecording(false);
      setTranscriptVisible(false);
      setSelectedCopyLead(null);
    }
  }, [isOpen]);

  const triggerAI = useCallback(async () => {
    setAiState('processing');
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setAiState('complete');
  }, []);

  const handleUploadClick = useCallback(async () => {
    if (uploading || uploadComplete) return;
    setUploading(true);
    // Wait for upload animation to complete (1.2s + small buffer)
    await new Promise((resolve) => setTimeout(resolve, 1400));
    setUploadComplete(true);
    triggerAI();
  }, [uploading, uploadComplete, triggerAI]);

  const handleMicClick = useCallback(async () => {
    if (recording || transcriptVisible) return;
    setRecording(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setRecording(false);
    setTranscriptVisible(true);
    triggerAI();
  }, [recording, transcriptVisible, triggerAI]);

  const handleConfirmCreate = useCallback(() => {
    dispatch({
      type: 'CREATE_LEAD',
      payload: {
        leadName: 'Chandler Medical Plaza \u2014 Demo + Abatement',
        clientId: 'c-001',
        clientName: 'Westfield Construction',
        workTypes: ['Abatement (ACM/Lead)', 'Selective Interior Demolition'],
        bidDue: '2026-03-17',
        siteName: 'Chandler Medical Plaza, 4th floor Building C',
        hazmatNotes: 'Confirmed asbestos in floor tile',
      },
    });
    dispatch({ type: 'SET_MODAL', payload: null });
    navigate('/crm/leads/l-new/general-info');
  }, [dispatch, navigate]);

  const handleTabChange = useCallback((id: string) => {
    setActiveTab(id as IntakeTab);
    setAiState('idle');
    setUploading(false);
    setUploadComplete(false);
    setRecording(false);
    setTranscriptVisible(false);
    setSelectedCopyLead(null);
  }, []);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Lead" size="xl">
      <Tabs tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

      <div className="mt-4 min-h-[360px] relative">
        {/* AI Processing Overlay */}
        {aiState === 'processing' && (
          <AIProcessingOverlay
            label="Analyzing documents..."
            sublabel="Extracting lead details with AI"
          />
        )}

        {/* ── Upload Documents Tab ─────────────────────────────── */}
        {activeTab === 'upload' && (
          <div>
            {!uploading && !uploadComplete && (
              <button
                type="button"
                onClick={handleUploadClick}
                className="w-full border-2 border-dashed border-ff-border rounded-lg p-12 flex flex-col items-center gap-3 hover:border-ff-teal hover:bg-ff-teal-light/30 transition-colors cursor-pointer"
              >
                <Upload size={32} className="text-ff-text-muted" />
                <p className="text-sm font-medium text-ff-text">
                  Drop files here or click to upload
                </p>
                <p className="text-xs text-ff-text-muted">
                  PDF, Word, Excel, images — we'll extract the details
                </p>
              </button>
            )}

            {(uploading || uploadComplete) && aiState !== 'complete' && (
              <div className="space-y-3">
                {simulatedFiles.map((file, idx) => (
                  <div
                    key={file.name}
                    className="flex items-center gap-3 bg-gray-50 border border-ff-border rounded-lg px-4 py-3"
                  >
                    <FileText size={18} className="text-ff-text-muted shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium text-ff-text truncate">
                          {file.name}
                        </span>
                        <span className="text-xs text-ff-text-muted ml-2">{file.size}</span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-ff-teal rounded-full"
                          initial={{ width: '0%' }}
                          animate={{ width: '100%' }}
                          transition={{
                            duration: 1.2,
                            delay: idx * 0.15,
                            ease: 'easeOut',
                          }}
                        />
                      </div>
                    </div>
                    {uploadComplete && (
                      <CheckCircle size={18} className="text-ff-green shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            )}

            {aiState === 'complete' && <AIConfirmationSummary onConfirm={handleConfirmCreate} />}
          </div>
        )}

        {/* ── Voice / Describe Tab ─────────────────────────────── */}
        {activeTab === 'voice' && (
          <div>
            {!transcriptVisible && aiState !== 'complete' && (
              <div className="flex flex-col items-center gap-4 py-8">
                <div className="relative group">
                  <button
                    type="button"
                    onClick={handleMicClick}
                    className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
                      recording
                        ? 'bg-red-100 text-red-600'
                        : 'bg-ff-teal-light text-ff-teal-dark hover:bg-ff-teal hover:text-white'
                    }`}
                  >
                    <Mic size={32} />
                    {recording && (
                      <motion.span
                        className="absolute inset-0 rounded-full border-2 border-red-400"
                        animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                      />
                    )}
                  </button>
                  {/* Tooltip */}
                  <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    <div className="bg-ff-topbar text-white text-xs rounded-md px-3 py-1.5 whitespace-nowrap shadow-lg">
                      Voice Input (Wave 1a — desktop/tablet, online)
                    </div>
                  </div>
                </div>
                <p className="text-sm text-ff-text-secondary">
                  {recording ? 'Recording... speak now' : 'Click to start recording'}
                </p>
              </div>
            )}

            {transcriptVisible && aiState !== 'complete' && (
              <div className="bg-gray-50 border border-ff-border rounded-lg p-4">
                <p className="text-xs text-ff-text-muted uppercase font-medium mb-2">
                  Transcript
                </p>
                <p className="text-sm text-ff-text leading-relaxed">{voiceTranscript}</p>
              </div>
            )}

            {aiState === 'complete' && <AIConfirmationSummary onConfirm={handleConfirmCreate} />}
          </div>
        )}

        {/* ── Forward Email Tab ─────────────────────────────── */}
        {activeTab === 'email' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="w-16 h-16 bg-ff-teal-light rounded-full flex items-center justify-center">
              <Mail size={28} className="text-ff-teal-dark" />
            </div>
            <div className="text-center max-w-md">
              <p className="text-sm font-medium text-ff-text mb-1">Forward a bid invite or scope email to:</p>
              <p className="text-lg font-semibold text-ff-teal-dark bg-ff-teal-light px-4 py-2 rounded-lg font-mono">
                leads@fieldflo.app
              </p>
              <p className="text-sm text-ff-text-secondary mt-3">
                Forward a bid invite or scope email to this address. We'll extract the lead details automatically.
              </p>
              <p className="text-xs text-ff-text-muted mt-4 italic">
                Non-functional placeholder for prototype
              </p>
            </div>
          </div>
        )}

        {/* ── Copy Existing Lead Tab ─────────────────────────── */}
        {activeTab === 'copy' && (
          <div>
            {!selectedCopyLead ? (
              <div className="space-y-2">
                <p className="text-sm text-ff-text-secondary mb-3">
                  Select an existing lead to use as a template:
                </p>
                {existingLeads.map((lead) => (
                  <button
                    key={lead.id}
                    type="button"
                    onClick={() => setSelectedCopyLead(lead.id)}
                    className="w-full text-left bg-gray-50 border border-ff-border rounded-lg px-4 py-3 hover:border-ff-teal hover:bg-ff-teal-light/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm font-medium text-ff-text">
                          {lead.name}
                        </span>
                        <span className="text-xs text-ff-text-muted ml-2">
                          #{lead.leadNumber}
                        </span>
                      </div>
                      <Badge
                        variant={
                          lead.status === 'Won'
                            ? 'green'
                            : lead.status === 'Lost'
                              ? 'red'
                              : lead.status === 'Proposal Sent'
                                ? 'blue'
                                : 'teal'
                        }
                        size="sm"
                      >
                        {lead.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-ff-text-secondary mt-1">
                      {lead.clientName} &middot; {lead.workTypes.join(', ')}
                    </p>
                  </button>
                ))}
              </div>
            ) : (
              <CopyPreview
                leadId={selectedCopyLead}
                onBack={() => setSelectedCopyLead(null)}
                onConfirm={handleConfirmCreate}
              />
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}

/* ── AI Confirmation Summary Card ─────────────────────────────────────────── */

function AIConfirmationSummary({ onConfirm }: { onConfirm: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="border-l-4 border-ff-teal bg-ff-card border border-ff-border rounded-lg p-5"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-ff-teal-dark" />
        <Badge variant="ai">AI EXTRACTED</Badge>
      </div>
      <p className="text-sm text-ff-text leading-relaxed">
        We understood:{' '}
        <strong>Chandler Medical Plaza — Demo + Abatement</strong> &middot;{' '}
        <strong>Westfield Construction</strong>{' '}
        <span className="text-ff-text-secondary">(2 prior leads)</span> &middot;{' '}
        <strong>Abatement (ACM/Lead), Selective Interior Demo</strong> &middot; ~8,400 SF,
        4th floor Building C
      </p>
      <div className="flex items-center gap-3 mt-4">
        <Button variant="primary" size="md" onClick={onConfirm}>
          Confirm &amp; Create Lead
        </Button>
        <Button variant="secondary" size="md" onClick={() => {}}>
          Edit
        </Button>
      </div>
    </motion.div>
  );
}

/* ── Copy Preview ─────────────────────────────────────────────────────────── */

function CopyPreview({
  leadId,
  onBack,
  onConfirm,
}: {
  leadId: string;
  onBack: () => void;
  onConfirm: () => void;
}) {
  const lead = existingLeads.find((l) => l.id === leadId);
  if (!lead) return null;

  const fields: { label: string; value: string }[] = [
    { label: 'Lead Name', value: lead.name },
    { label: 'Client', value: lead.clientName },
    { label: 'Work Types', value: lead.workTypes.join(', ') },
    { label: 'Salesperson', value: lead.salesperson },
    { label: 'Estimator', value: lead.estimator },
    { label: 'Bid Due', value: lead.bidDue },
    { label: 'Status', value: lead.status },
    { label: 'Confidence', value: lead.confidence },
    { label: 'Value', value: lead.contractValue ? `$${lead.contractValue.toLocaleString()}` : '\u2014' },
  ];

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-ff-teal-dark hover:underline mb-4 inline-block"
      >
        &larr; Back to list
      </button>

      <h3 className="text-sm font-semibold text-ff-text mb-3">
        Copying from: {lead.name}
      </h3>

      <div className="grid grid-cols-2 gap-x-6 gap-y-2 bg-gray-50 border border-ff-border rounded-lg p-4">
        {/* Column headers */}
        <div className="text-xs font-medium text-ff-text-muted uppercase pb-1 border-b border-ff-border">
          Original Field
        </div>
        <div className="text-xs font-medium text-ff-text-muted uppercase pb-1 border-b border-ff-border">
          New Lead
        </div>

        {fields.map((f) => {
          const carryOver = copyCarryOverLabels[f.label] ?? 'Cleared';
          return (
            <div key={f.label} className="contents">
              <div className="py-2 border-b border-ff-border-light">
                <span className="text-xs text-ff-text-muted block">{f.label}</span>
                <span className="text-sm text-ff-text">{f.value}</span>
              </div>
              <div className="py-2 border-b border-ff-border-light flex items-center">
                <Badge variant={carryOver === 'Carried over' ? 'green' : 'muted'} size="sm">
                  {carryOver}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-4">
        <Button variant="primary" size="md" onClick={onConfirm}>
          Create Lead from Copy
        </Button>
        <Button variant="secondary" size="md" onClick={onBack}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
