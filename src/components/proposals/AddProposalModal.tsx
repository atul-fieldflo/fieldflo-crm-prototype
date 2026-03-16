import { useNavigate, useParams } from 'react-router-dom';
import { FileUp, ListChecks, ArrowRight } from 'lucide-react';

export default function AddProposalModal() {
  const navigate = useNavigate();
  const { leadId } = useParams();

  const cards = [
    {
      icon: <FileUp size={32} className="text-ff-teal" />,
      title: 'Import from Estimate',
      description:
        'For complex jobs. Upload an Exactimate export, Excel template, or PDF. AI will extract line items automatically.',
      onClick: () => navigate(`/crm/leads/${leadId}/proposals/estimate-import`),
    },
    {
      icon: <ListChecks size={32} className="text-ff-teal" />,
      title: 'Quick Quote — Build from Task Library',
      description:
        'For simple jobs. Select tasks from the seeded library, set quantities, and generate a proposal in minutes.',
      onClick: () => navigate(`/crm/leads/${leadId}/proposals/quick-quote`),
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-12">
      <div className="text-center mb-10">
        <h1 className="text-2xl font-semibold text-ff-text">Create a New Proposal</h1>
        <p className="text-ff-text-secondary text-sm mt-2">
          Choose how you want to build this proposal.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => (
          <button
            key={card.title}
            onClick={card.onClick}
            className="group bg-ff-card border-2 border-ff-border rounded-xl p-8 text-left
              hover:border-ff-teal transition-all hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ff-teal"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-ff-teal-light rounded-lg">{card.icon}</div>
              <ArrowRight
                size={20}
                className="text-ff-text-muted group-hover:text-ff-teal group-hover:translate-x-1 transition-all"
              />
            </div>
            <h2 className="text-lg font-semibold text-ff-text mb-2">{card.title}</h2>
            <p className="text-sm text-ff-text-secondary leading-relaxed">{card.description}</p>
          </button>
        ))}
      </div>

      <div className="text-center mt-8">
        <button
          onClick={() => navigate(`/crm/leads/${leadId}/proposals`)}
          className="text-sm text-ff-text-secondary hover:text-ff-text transition-colors"
        >
          &larr; Back to Proposals
        </button>
      </div>
    </div>
  );
}
