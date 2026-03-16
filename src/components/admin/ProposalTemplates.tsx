import { useState } from 'react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ProposalTemplate {
  id: string;
  name: string;
  workTypes: string[];
  prePlacedObjects: string[];
  source: 'Seeded' | 'System Default';
}

const templates: ProposalTemplate[] = [
  {
    id: 'pt-1',
    name: 'Standard Abatement Proposal',
    workTypes: ['Abatement', 'Insurance'],
    prePlacedObjects: ['Title', 'Scope', 'Bid Items', 'Exclusions', 'Terms & Conditions', 'Signature'],
    source: 'Seeded',
  },
  {
    id: 'pt-2',
    name: 'Commercial Demo Bid',
    workTypes: ['Selective Interior Demo'],
    prePlacedObjects: ['Title', 'Scope', 'Bid Items', 'Alternates', 'Exclusions', 'Schedule', 'Signature'],
    source: 'Seeded',
  },
  {
    id: 'pt-3',
    name: 'Insurance Residential Quick',
    workTypes: ['Insurance', 'Abatement'],
    prePlacedObjects: ['Title', 'Scope', 'Bid Items', 'Terms & Conditions', 'Signature'],
    source: 'Seeded',
  },
  {
    id: 'pt-4',
    name: 'Blank Canvas',
    workTypes: ['(any)'],
    prePlacedObjects: ['(none)'],
    source: 'System Default',
  },
];

export default function ProposalTemplates() {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ProposalTemplate | null>(null);

  const handleExpand = (tpl: ProposalTemplate) => {
    if (expandedId === tpl.id) {
      setExpandedId(null);
      setEditDraft(null);
    } else {
      setExpandedId(tpl.id);
      setEditDraft({ ...tpl });
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>Portal Admins</span>
        <ChevronRight size={14} />
        <span>CRM</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Proposal Templates</span>
      </nav>

      <h1 className="text-xl font-semibold text-ff-text">Proposal Templates</h1>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ff-border bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Template Name</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Work Types</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Pre-placed Objects</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Source</th>
              </tr>
            </thead>
            <tbody>
              {templates.map((tpl) => (
                <>
                  <tr
                    key={tpl.id}
                    onClick={() => handleExpand(tpl)}
                    className={`border-b border-ff-border cursor-pointer transition-colors hover:bg-gray-50 ${
                      expandedId === tpl.id ? 'bg-ff-teal-light/10' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-medium text-ff-text">
                      <span className="flex items-center gap-1">
                        <ChevronDown
                          size={14}
                          className={`text-ff-text-muted transition-transform ${
                            expandedId === tpl.id ? 'rotate-0' : '-rotate-90'
                          }`}
                        />
                        {tpl.name}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {tpl.workTypes.map((wt) => (
                          <Badge key={wt} variant={wt === '(any)' ? 'muted' : 'blue'} size="sm">
                            {wt}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-ff-text-secondary">
                      {tpl.prePlacedObjects.join(', ')}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={tpl.source === 'Seeded' ? 'blue' : 'muted'} size="sm">
                        {tpl.source}
                      </Badge>
                    </td>
                  </tr>

                  {/* Expanded edit panel */}
                  {expandedId === tpl.id && editDraft && (
                    <tr key={`${tpl.id}-edit`}>
                      <td colSpan={4} className="px-0 py-0">
                        <div className="bg-gray-50 border-t border-ff-border px-6 py-5 space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Template Name"
                              value={editDraft.name}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, name: e.target.value })
                              }
                            />
                            <Input
                              label="Work Types (comma-separated)"
                              value={editDraft.workTypes.join(', ')}
                              onChange={(e) =>
                                setEditDraft({
                                  ...editDraft,
                                  workTypes: e.target.value.split(',').map((s) => s.trim()),
                                })
                              }
                            />
                          </div>
                          <Input
                            label="Pre-placed Objects (comma-separated)"
                            value={editDraft.prePlacedObjects.join(', ')}
                            onChange={(e) =>
                              setEditDraft({
                                ...editDraft,
                                prePlacedObjects: e.target.value.split(',').map((s) => s.trim()),
                              })
                            }
                          />
                          <div className="flex items-center gap-2">
                            <Badge variant={editDraft.source === 'Seeded' ? 'blue' : 'muted'} size="sm">
                              Source: {editDraft.source}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 pt-2">
                            <Button
                              onClick={() => {
                                // Prototype — no persist
                                setExpandedId(null);
                                setEditDraft(null);
                              }}
                            >
                              Save
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                setExpandedId(null);
                                setEditDraft(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
