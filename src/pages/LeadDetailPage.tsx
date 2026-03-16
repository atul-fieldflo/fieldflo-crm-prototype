import { useEffect, lazy, Suspense } from 'react';
import { useParams, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAppContext, useAppDispatch } from '../context/AppContext';
import { existingLeads } from '../mockData';
import LeadLeftNav from '../components/leads/LeadLeftNav';
import ActionChips from '../components/leads/ActionChips';
import GeneralInfoSection from '../components/leads/sections/GeneralInfoSection';
import DiscoveryPacketSection from '../components/leads/sections/DiscoveryPacketSection';
import FilesPanel from '../components/leads/sections/FilesPanel';
import ProposalsSection from '../components/leads/sections/ProposalsSection';
import JobWalkSection from '../components/leads/sections/JobWalkSection';
import ReachOutSection from '../components/leads/sections/ReachOutSection';
import UnknownsRegister from '../components/leads/sections/UnknownsRegister';
import PursuitDecision from '../components/leads/sections/PursuitDecision';
import HandoffBrief from '../components/leads/sections/HandoffBrief';
import Badge from '../components/ui/Badge';

// Lazy load proposal sub-pages
const AddProposalModal = lazy(() => import('../components/proposals/AddProposalModal'));
const TaskLibraryPicker = lazy(() => import('../components/proposals/TaskLibraryPicker'));
const EstimateImport = lazy(() => import('../components/proposals/EstimateImport'));
const LineItemReview = lazy(() => import('../components/proposals/LineItemReview'));
const SectionGrouping = lazy(() => import('../components/proposals/SectionGrouping'));
const ProposalCanvas = lazy(() => import('../components/proposals/ProposalCanvas'));
const BeforeAfterPreview = lazy(() => import('../components/proposals/BeforeAfterPreview'));
const SendProposalModal = lazy(() => import('../components/proposals/SendProposalModal'));
const AwardAction = lazy(() => import('../components/award/AwardAction'));
const DiscoveryToProject = lazy(() => import('../components/award/DiscoveryToProject'));

const statusBadgeVariant: Record<string, 'teal' | 'amber' | 'red' | 'green' | 'blue' | 'muted'> = {
  Draft: 'muted',
  'In Progress': 'teal',
  'Proposal Sent': 'blue',
  Won: 'green',
  Lost: 'red',
};

const confidenceBadgeVariant: Record<string, 'green' | 'amber' | 'red'> = {
  High: 'green',
  Medium: 'amber',
  Low: 'red',
};

function PlaceholderSection({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-center h-64 bg-ff-card border border-ff-border rounded-lg">
      <div className="text-center">
        <h3 className="text-lg font-semibold text-ff-text">{title}</h3>
        <p className="text-ff-text-secondary text-sm mt-1">This section will be built in a future sprint.</p>
      </div>
    </div>
  );
}

function Loading() {
  return <div className="flex items-center justify-center h-32 text-ff-text-muted text-sm">Loading...</div>;
}

export default function LeadDetailPage() {
  const { leadId } = useParams();
  const location = useLocation();
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!activeLead) {
      const lead = existingLeads.find(l => l.id === leadId) || existingLeads[0];
      dispatch({
        type: 'CREATE_LEAD',
        payload: {
          leadName: lead.name,
          leadNumber: lead.leadNumber,
          clientId: lead.clientId,
          clientName: lead.clientName,
          workTypes: lead.workTypes,
          confidence: lead.confidence,
          bidDue: lead.bidDue,
          walkthroughDate: lead.walkthrough ?? '',
        },
      });
    }
  }, [activeLead, dispatch, leadId]);

  if (!activeLead) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-ff-text-muted text-sm">Loading lead...</div>
      </div>
    );
  }

  const displayStatus = activeLead.proposalStatus === 'sent' ? 'Proposal Sent' :
    activeLead.proposalStatus === 'awarded' ? 'Won' : 'In Progress';
  const displayName = activeLead.leadName || 'Untitled Lead';
  const displayNumber = activeLead.leadNumber;
  const displayClient = activeLead.clientName || 'No client';
  const displayConfidence = activeLead.confidence;

  // Full-screen proposal pages break out of the two-column layout
  const fullScreenPaths = ['/proposals/canvas', '/proposals/before-after', '/proposals/send'];
  const isFullScreen = fullScreenPaths.some((p) => location.pathname.endsWith(p));

  if (isFullScreen) {
    return (
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="proposals/canvas" element={<ProposalCanvas />} />
          <Route path="proposals/before-after" element={<BeforeAfterPreview />} />
          <Route path="proposals/send" element={<SendProposalModal />} />
          <Route path="*" element={null} />
        </Routes>
      </Suspense>
    );
  }

  return (
    <div>
      {/* Lead header bar */}
      <div className="bg-ff-card border border-ff-border rounded-lg px-5 py-3 mb-3">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-lg font-semibold text-ff-text truncate max-w-md">
            {displayName}
          </h1>
          <span className="text-xs font-mono text-ff-text-muted bg-gray-100 px-2 py-0.5 rounded">
            {displayNumber}
          </span>
          <Badge variant={statusBadgeVariant[displayStatus] ?? 'muted'} size="sm">
            {displayStatus}
          </Badge>
          <span className="text-sm text-ff-text-secondary">{displayClient}</span>
          <Badge variant={confidenceBadgeVariant[displayConfidence] ?? 'muted'} size="sm">
            {displayConfidence}
          </Badge>
          {activeLead.projectCreated && (
            <Badge variant="green" size="sm">
              → {activeLead.projectNumber}
            </Badge>
          )}
        </div>
      </div>

      {/* Action chips strip */}
      <ActionChips />

      {/* Two-column layout */}
      <div className="flex gap-4 mt-3">
        <div className="w-48 flex-shrink-0">
          <LeadLeftNav leadId={leadId ?? ''} />
        </div>

        <div className="flex-1 min-w-0">
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route index element={<Navigate to="general-info" replace />} />
              <Route path="general-info" element={<GeneralInfoSection />} />
              <Route path="discovery" element={<DiscoveryPacketSection />} />
              <Route path="files" element={<FilesPanel />} />
              <Route path="proposals" element={<ProposalsSection />} />
              <Route path="proposals/new" element={<AddProposalModal />} />
              <Route path="proposals/quick-quote" element={<TaskLibraryPicker />} />
              <Route path="proposals/estimate-import" element={<EstimateImport />} />
              <Route path="proposals/line-items" element={<LineItemReview />} />
              <Route path="proposals/section-grouping" element={<SectionGrouping />} />
              <Route path="job-walk" element={<JobWalkSection />} />
              <Route path="reach-out" element={<ReachOutSection />} />
              <Route path="unknowns" element={<UnknownsRegister />} />
              <Route path="pursuit-decision" element={<PursuitDecision />} />
              <Route path="handoff-brief" element={<HandoffBrief />} />
              <Route path="award" element={<AwardAction />} />
              <Route path="award/project-review" element={<DiscoveryToProject />} />
              <Route path="assigned-personnel" element={<PlaceholderSection title="Assigned Personnel" />} />
              <Route path="referral" element={<PlaceholderSection title="Referral" />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
