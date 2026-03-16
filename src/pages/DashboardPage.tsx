import { useNavigate } from 'react-router-dom';
import { existingLeads } from '../mockData';
import { TrendingUp, Users, FileText, DollarSign, ArrowRight } from 'lucide-react';

const stats = [
  { label: 'Active Leads', value: existingLeads.filter(l => l.status === 'In Progress').length.toString(), icon: Users, color: 'text-ff-teal-dark', bg: 'bg-ff-teal-light' },
  { label: 'Proposals Sent', value: existingLeads.filter(l => l.status === 'Proposal Sent').length.toString(), icon: FileText, color: 'text-ff-blue', bg: 'bg-blue-50' },
  { label: 'Won This Month', value: existingLeads.filter(l => l.status === 'Won').length.toString(), icon: TrendingUp, color: 'text-ff-green-dark', bg: 'bg-green-50' },
  { label: 'Pipeline Value', value: '$' + existingLeads.filter(l => l.contractValue).reduce((s, l) => s + (l.contractValue || 0), 0).toLocaleString(), icon: DollarSign, color: 'text-ff-amber', bg: 'bg-amber-50' },
];

export default function DashboardPage() {
  const navigate = useNavigate();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ff-text">CRM Dashboard</h1>
          <p className="text-sm text-ff-text-secondary mt-0.5">Welcome back, Marcus</p>
        </div>
        <button
          onClick={() => navigate('/crm/leads')}
          className="bg-ff-teal text-white rounded-full px-4 py-2 text-sm font-medium hover:bg-ff-teal-dark transition-colors flex items-center gap-2"
        >
          View All Leads <ArrowRight size={16} />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {stats.map(s => (
          <div key={s.label} className="bg-ff-card border border-ff-border rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${s.bg} rounded-lg flex items-center justify-center`}>
                <s.icon size={20} className={s.color} />
              </div>
              <div>
                <div className="text-2xl font-semibold text-ff-text">{s.value}</div>
                <div className="text-xs text-ff-text-secondary">{s.label}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-ff-card border border-ff-border rounded-lg">
        <div className="px-4 py-3 border-b border-ff-border flex items-center justify-between">
          <h2 className="font-medium text-ff-text text-sm">Recent Leads</h2>
          <button onClick={() => navigate('/crm/leads')} className="text-xs text-ff-teal-dark hover:underline">View all</button>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ff-text-secondary text-xs border-b border-ff-border">
              <th className="px-4 py-2 font-medium">Lead</th>
              <th className="px-4 py-2 font-medium">Client</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium">Bid Due</th>
              <th className="px-4 py-2 font-medium text-right">Value</th>
            </tr>
          </thead>
          <tbody>
            {existingLeads.map(lead => (
              <tr key={lead.id} onClick={() => navigate(`/crm/leads/${lead.id}/general-info`)} className="border-b border-ff-border-light hover:bg-ff-card-hover cursor-pointer">
                <td className="px-4 py-3">
                  <div className="font-medium text-ff-text">{lead.name}</div>
                  <div className="text-xs text-ff-text-muted">#{lead.leadNumber}</div>
                </td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.clientName}</td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    lead.status === 'Won' ? 'bg-green-50 text-green-700' :
                    lead.status === 'Lost' ? 'bg-red-50 text-red-700' :
                    lead.status === 'Proposal Sent' ? 'bg-blue-50 text-blue-700' :
                    'bg-ff-teal-light text-ff-teal-dark'
                  }`}>{lead.status}</span>
                </td>
                <td className="px-4 py-3 text-ff-text-secondary">{lead.bidDue}</td>
                <td className="px-4 py-3 text-right text-ff-text font-medium">{lead.contractValue ? `$${lead.contractValue.toLocaleString()}` : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
