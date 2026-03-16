import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  Loader2,
  ArrowLeft,
  Link2,
} from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import { discoveryToProjectTabs } from '../../mockData';

type TabStatus = 'pending' | 'confirmed';

interface TabRow {
  tab: string;
  source: string;
  data: string;
  status: TabStatus;
  fieldCount: number;
}

const fieldCounts = [8, 6, 7, 9, 6, 8, 12, 10, 7, 6, 11, 9, 8, 7];

export default function DiscoveryToProject() {
  const state = useAppContext();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { leadId } = useParams();

  const [tabs, setTabs] = useState<TabRow[]>(
    discoveryToProjectTabs.map((t, i) => ({
      ...t,
      fieldCount: fieldCounts[i % fieldCounts.length],
    }))
  );
  const [expandedTab, setExpandedTab] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [projectCreated, setProjectCreated] = useState(false);

  const totalFields = tabs.reduce((sum, t) => sum + t.fieldCount, 0);
  const allConfirmed = tabs.every((t) => t.status === 'confirmed');
  const confirmedCount = tabs.filter((t) => t.status === 'confirmed').length;

  const handleConfirm = (tabName: string) => {
    setTabs((prev) =>
      prev.map((t) => (t.tab === tabName ? { ...t, status: 'confirmed' as TabStatus } : t))
    );
  };

  const handleConfirmAll = () => {
    setTabs((prev) => prev.map((t) => ({ ...t, status: 'confirmed' as TabStatus })));
  };

  const handleCreateProject = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setProjectCreated(true);
      dispatch({ type: 'SET_FIELD', payload: { field: 'projectCreated', value: true } });
      dispatch({
        type: 'SET_FIELD',
        payload: { field: 'projectNumber', value: 'PRJ-2026-0089' },
      });
    }, 1500);
  };

  const handleGoToLead = () => {
    navigate(`/crm/leads/${leadId}`);
  };

  const toggleExpand = (tabName: string) => {
    setExpandedTab((prev) => (prev === tabName ? null : tabName));
  };

  // Processing overlay
  if (processing) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <Loader2 size={48} className="text-ff-teal animate-spin mb-4" />
        <p className="text-ff-text font-medium">Creating project...</p>
        <p className="text-ff-text-secondary text-sm mt-1">
          Mapping discovery data to project fields
        </p>
      </div>
    );
  }

  // Success screen
  if (projectCreated) {
    return (
      <div className="max-w-2xl mx-auto py-10 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="text-center"
        >
          <div className="bg-green-50 border border-green-200 rounded-xl p-8 mb-6">
            <CheckCircle2 size={48} className="text-green-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-green-800 mb-2">
              Project created — PRJ-2026-0089
            </h1>
            <p className="text-green-700 text-sm max-w-md mx-auto">
              {tabs.length} of 22 Project Detail tabs pre-populated with ~{totalFields} fields from
              lead discovery data.
            </p>
          </div>

          <Card className="p-6 mb-6 text-left">
            <div className="flex items-start gap-3">
              <Link2 size={20} className="text-ff-teal mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-semibold text-ff-text mb-1">
                  Bidirectional link created
                </h3>
                <p className="text-sm text-ff-text-secondary">
                  Lead #{state.activeLead?.leadNumber || '2024-0347'} {'<->'}  Project PRJ-2026-0089.
                  Click from either record to navigate to the other.
                </p>
              </div>
            </div>
          </Card>

          <Button
            variant="secondary"
            size="lg"
            onClick={handleGoToLead}
            className="gap-2"
          >
            <ArrowLeft size={18} />
            Go to Lead
          </Button>
        </motion.div>
      </div>
    );
  }

  // Main review screen
  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-ff-text mb-1">Discovery to Project Review</h1>
        <p className="text-sm text-ff-text-secondary">
          <span className="font-semibold text-ff-text">
            {tabs.length} of 22 Project Detail tabs
          </span>{' '}
          pre-populated with ~{totalFields} fields
        </p>
        <p className="text-xs text-ff-text-muted mt-1">
          8 tabs hidden (not relevant for this work type combination)
        </p>
      </div>

      {/* Confirm all + progress */}
      <div className="flex items-center justify-between mb-4">
        <div className="text-sm text-ff-text-secondary">
          {confirmedCount} / {tabs.length} confirmed
        </div>
        {!allConfirmed && (
          <Button size="sm" onClick={handleConfirmAll}>
            Confirm All
          </Button>
        )}
      </div>

      {/* Tab accordion rows */}
      <div className="space-y-2 mb-8">
        {tabs.map((tab) => {
          const isExpanded = expandedTab === tab.tab;
          const isConfirmed = tab.status === 'confirmed';

          return (
            <Card key={tab.tab} className="overflow-hidden">
              <button
                type="button"
                onClick={() => toggleExpand(tab.tab)}
                className="w-full flex items-center gap-3 px-4 py-3 text-left"
              >
                {/* Status icon */}
                {isConfirmed ? (
                  <CheckCircle2 size={18} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={18} className="text-gray-300 flex-shrink-0" />
                )}

                {/* Tab name */}
                <span className="text-sm font-medium text-ff-text flex-1 truncate">
                  {tab.tab}
                </span>

                {/* Source badge */}
                <Badge variant="teal" size="sm">
                  {tab.source}
                </Badge>

                {/* Field count */}
                <span className="text-xs text-ff-text-muted whitespace-nowrap">
                  ~{tab.fieldCount} fields
                </span>

                {/* Expand chevron */}
                {isExpanded ? (
                  <ChevronDown size={16} className="text-ff-text-secondary flex-shrink-0" />
                ) : (
                  <ChevronRight size={16} className="text-ff-text-secondary flex-shrink-0" />
                )}
              </button>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4 pt-1 border-t border-ff-border">
                      <p className="text-sm text-ff-text-secondary mb-3">{tab.data}</p>
                      {!isConfirmed && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleConfirm(tab.tab);
                          }}
                        >
                          Confirm
                        </Button>
                      )}
                      {isConfirmed && (
                        <span className="inline-flex items-center gap-1 text-sm text-green-600 font-medium">
                          <CheckCircle2 size={14} /> Confirmed
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          );
        })}
      </div>

      {/* Create Project button */}
      <Button
        size="lg"
        onClick={handleCreateProject}
        disabled={!allConfirmed}
        className={`w-full justify-center ${
          !allConfirmed ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Create Project
      </Button>
      {!allConfirmed && (
        <p className="text-xs text-ff-text-muted text-center mt-2">
          Confirm all tabs to enable project creation
        </p>
      )}
    </div>
  );
}
