import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from '../ui/Button';
import Card from '../ui/Card';
import { useAppContext } from '../../context/AppContext';

export default function AwardAction() {
  const state = useAppContext();
  const navigate = useNavigate();
  const { leadId } = useParams();
  const lead = state.activeLead;

  const handleCreateProject = () => {
    navigate(`/crm/leads/${leadId}/award/project-review`);
  };

  const handleReturnToLead = () => {
    navigate(`/crm/leads/${leadId}`);
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      {/* Success banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-green-50 border border-green-200 rounded-xl p-6 mb-8 text-center"
      >
        <div className="flex items-center justify-center gap-3 mb-2">
          <CheckCircle size={32} className="text-green-600" />
          <h1 className="text-2xl font-bold text-green-800">
            Proposal Awarded! {'\u{1F389}'}
          </h1>
        </div>
        <p className="text-green-700 text-sm">
          Congratulations — the client has accepted the proposal.
        </p>
      </motion.div>

      {/* Summary card */}
      <Card className="p-6 mb-8">
        <h2 className="text-sm font-semibold text-ff-text-secondary uppercase tracking-wider mb-4">
          Award Summary
        </h2>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ff-text-secondary">Lead</span>
            <span className="text-sm font-medium text-ff-text">
              {lead?.leadName || 'Chandler Medical Plaza — Demo + Abatement'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ff-text-secondary">Client</span>
            <span className="text-sm font-medium text-ff-text">
              {lead?.clientName || 'Westfield Construction'}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-ff-text-secondary">Contract Value</span>
            <span className="text-lg font-bold text-green-700">
              ${lead?.contractValue
                ? Number(lead.contractValue).toLocaleString()
                : '187,500'}
            </span>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="space-y-3">
        <Button
          size="lg"
          onClick={handleCreateProject}
          className="w-full justify-center gap-2"
        >
          Create Project from Lead
          <ArrowRight size={18} />
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={handleReturnToLead}
          className="w-full justify-center gap-2"
        >
          <ArrowLeft size={18} />
          Return to Lead
        </Button>
      </div>
    </div>
  );
}
