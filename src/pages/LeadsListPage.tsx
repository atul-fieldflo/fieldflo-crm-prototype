import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { existingLeads } from '../mockData';
import { useAppContext, useAppDispatch } from '../context/AppContext';
import NewLeadModal from '../components/leads/NewLeadModal';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { Plus, Search } from 'lucide-react';

const statusOptions = ['All', 'Draft', 'In Progress', 'Proposal Sent', 'Won', 'Lost'] as const;

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

export default function LeadsListPage() {
  const navigate = useNavigate();
  const { modalOpen } = useAppContext();
  const dispatch = useAppDispatch();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLeads = existingLeads.filter((lead) => {
    const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
    const matchesSearch =
      searchQuery === '' ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.leadNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-ff-text">Leads</h1>
        <Button
          variant="primary"
          size="md"
          onClick={() => dispatch({ type: 'SET_MODAL', payload: 'new-lead' })}
        >
          <Plus size={16} className="mr-1.5" />
          New Lead
        </Button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center bg-ff-card border border-ff-border rounded-lg p-0.5">
          {statusOptions.map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                statusFilter === status
                  ? 'bg-ff-teal-light text-ff-teal-dark font-medium'
                  : 'text-ff-text-secondary hover:text-ff-text'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-xs">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ff-text-muted" />
          <input
            type="text"
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-ff-border rounded-md pl-9 pr-3 py-2 text-sm text-ff-text placeholder:text-ff-text-muted hover:border-ff-teal focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-ff-card border border-ff-border rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ff-text-secondary text-xs border-b border-ff-border">
              <th className="px-4 py-2.5 font-medium">Lead #</th>
              <th className="px-4 py-2.5 font-medium">Lead Name</th>
              <th className="px-4 py-2.5 font-medium">Client</th>
              <th className="px-4 py-2.5 font-medium">Work Types</th>
              <th className="px-4 py-2.5 font-medium">Salesperson</th>
              <th className="px-4 py-2.5 font-medium">Estimator</th>
              <th className="px-4 py-2.5 font-medium">Bid Due</th>
              <th className="px-4 py-2.5 font-medium">Status</th>
              <th className="px-4 py-2.5 font-medium">Confidence</th>
              <th className="px-4 py-2.5 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => navigate(`/crm/leads/${lead.id}/general-info`)}
                className={`border-b border-ff-border-light hover:bg-ff-card-hover cursor-pointer transition-colors ${
                  lead.status === 'Won'
                    ? 'border-l-[3px] border-l-green-400'
                    : lead.status === 'Lost'
                      ? 'border-l-[3px] border-l-red-300'
                      : ''
                }`}
              >
                <td className="px-4 py-3 text-ff-text-muted font-mono text-xs">
                  {lead.leadNumber}
                </td>
                <td className="px-4 py-3 font-medium text-ff-text">{lead.name}</td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.clientName}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {lead.workTypes.map((wt) => (
                      <Badge key={wt} variant="muted" size="sm">
                        {wt}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.salesperson}</td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.estimator}</td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.bidDue}</td>
                <td className="px-4 py-3">
                  <Badge variant={statusBadgeVariant[lead.status] ?? 'muted'} size="sm">
                    {lead.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={confidenceBadgeVariant[lead.confidence] ?? 'muted'} size="sm">
                    {lead.confidence}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-ff-text font-medium">
                  {lead.contractValue ? `$${lead.contractValue.toLocaleString()}` : '\u2014'}
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan={10} className="px-4 py-12 text-center text-ff-text-muted text-sm">
                  No leads match the current filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* New Lead Modal */}
      <NewLeadModal
        isOpen={modalOpen === 'new-lead'}
        onClose={() => dispatch({ type: 'SET_MODAL', payload: null })}
      />
    </div>
  );
}
