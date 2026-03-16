import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../../../context/AppContext';
import Button from '../../ui/Button';
import Badge from '../../ui/Badge';
import { Plus, FileSpreadsheet } from 'lucide-react';

export default function ProposalsSection() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { activeLead } = useAppContext();

  const hasProposal = activeLead?.proposalStatus && activeLead.proposalStatus !== 'none';

  const statusBadgeVariant: Record<string, 'muted' | 'teal' | 'blue' | 'green' | 'amber'> = {
    draft: 'muted',
    sent: 'blue',
    signed: 'green',
    awarded: 'green',
  };

  return (
    <div className="space-y-4">
      <div className="bg-ff-card border border-ff-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ff-border">
          <h2 className="text-base font-semibold text-ff-text">Proposals</h2>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(`/crm/leads/${leadId}/proposals/new`)}
          >
            <Plus size={14} className="mr-1" />
            Add Proposal
          </Button>
        </div>

        {hasProposal ? (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ff-text-secondary text-xs border-b border-ff-border">
                <th className="px-5 py-2.5 font-medium">Proposal #</th>
                <th className="px-4 py-2.5 font-medium">Client</th>
                <th className="px-4 py-2.5 font-medium">Template</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium text-right">Value</th>
                <th className="px-4 py-2.5 font-medium">Last Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-ff-border-light hover:bg-ff-card-hover cursor-pointer transition-colors">
                <td className="px-5 py-3 font-mono text-xs text-ff-text-muted">
                  P-{activeLead?.leadNumber}-01
                </td>
                <td className="px-4 py-3 text-ff-text">{activeLead?.clientName}</td>
                <td className="px-4 py-3 text-ff-text-secondary">Commercial Abatement</td>
                <td className="px-4 py-3">
                  <Badge
                    variant={statusBadgeVariant[activeLead?.proposalStatus ?? 'draft'] ?? 'muted'}
                    size="sm"
                  >
                    {activeLead?.proposalStatus}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-ff-text font-medium">
                  {activeLead?.contractValue
                    ? `$${parseFloat(activeLead.contractValue.replace(/[^0-9.]/g, '')).toLocaleString()}`
                    : '\u2014'}
                </td>
                <td className="px-4 py-3 text-ff-text-secondary">Today</td>
              </tr>
            </tbody>
          </table>
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <FileSpreadsheet size={24} className="text-ff-text-muted" />
            </div>
            <p className="text-sm font-medium text-ff-text">No proposals yet</p>
            <p className="text-xs text-ff-text-muted mt-1 mb-4">
              Create a proposal to start building your bid.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/crm/leads/${leadId}/proposals/new`)}
            >
              <Plus size={14} className="mr-1" />
              Add Proposal
            </Button>
          </div>
        )}
      </div>

      {/* Multi-client note */}
      <p className="text-xs text-ff-text-muted italic px-1">
        Multi-client leads track outcomes independently per prospect.
      </p>
    </div>
  );
}
