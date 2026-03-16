import { useState } from 'react';
import { useAppContext, useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Card from '../ui/Card';
import Input from '../ui/Input';
import { ChevronRight, Plus, ChevronDown, Check } from 'lucide-react';
import type { LeadTemplate, SectionConfig } from '../../mockData';

export default function LeadTemplates() {
  const { adminLeadTemplates } = useAppContext();
  const dispatch = useAppDispatch();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<LeadTemplate | null>(null);

  const handleExpand = (tpl: LeadTemplate) => {
    if (expandedId === tpl.id) {
      setExpandedId(null);
      setEditDraft(null);
    } else {
      setExpandedId(tpl.id);
      setEditDraft(JSON.parse(JSON.stringify(tpl)));
    }
  };

  const handleToggleSection = (sectionId: string) => {
    if (!editDraft) return;
    setEditDraft({
      ...editDraft,
      sections: editDraft.sections.map((s) =>
        s.id === sectionId ? { ...s, visible: !s.visible } : s
      ),
    });
  };

  const handleToggleFieldRequired = (sectionId: string, fieldName: string) => {
    if (!editDraft) return;
    setEditDraft({
      ...editDraft,
      sections: editDraft.sections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              fields: s.fields.map((f) =>
                f.name === fieldName ? { ...f, required: !f.required } : f
              ),
            }
          : s
      ),
    });
  };

  const handleSave = () => {
    if (!editDraft) return;
    dispatch({ type: 'UPDATE_ADMIN_TEMPLATE', payload: editDraft });
    setExpandedId(null);
    setEditDraft(null);
  };

  const visibleCount = (sections: SectionConfig[]) =>
    sections.filter((s) => s.visible).length;
  const hiddenCount = (sections: SectionConfig[]) =>
    sections.filter((s) => !s.visible).length;

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-ff-text-secondary">
        <span>Portal Admins</span>
        <ChevronRight size={14} />
        <span>CRM</span>
        <ChevronRight size={14} />
        <span className="text-ff-text font-medium">Lead Templates</span>
      </nav>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ff-text">Lead Templates</h1>
        <Button>
          <Plus size={16} className="mr-1" />
          Add New Template
        </Button>
      </div>

      {/* Purple info banner */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-sm text-purple-800">
        <p className="font-semibold mb-1">Entirely new capability.</p>
        <p>
          Project templates and proposal templates exist — but lead templates do not exist today.
          This controls which General Info sections and fields appear for each job type.
        </p>
      </div>

      {/* Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ff-border bg-gray-50">
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Template Name</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Work Types</th>
                <th className="text-center px-4 py-3 font-medium text-ff-text-secondary">Sections Shown</th>
                <th className="text-center px-4 py-3 font-medium text-ff-text-secondary">Sections Hidden</th>
                <th className="text-left px-4 py-3 font-medium text-ff-text-secondary">Source</th>
              </tr>
            </thead>
            <tbody>
              {adminLeadTemplates.map((tpl) => (
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
                          <Badge key={wt} variant={wt === 'all' ? 'muted' : 'blue'} size="sm">
                            {wt}
                          </Badge>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tpl.sections.length > 0 ? (
                        <Badge variant="green" size="sm">{visibleCount(tpl.sections)}</Badge>
                      ) : (
                        <span className="text-ff-text-muted">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {tpl.sections.length > 0 ? (
                        <Badge variant="muted" size="sm">{hiddenCount(tpl.sections)}</Badge>
                      ) : (
                        <span className="text-ff-text-muted">--</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge
                        variant={
                          tpl.source === 'Seeded'
                            ? 'blue'
                            : tpl.source === 'System Default'
                            ? 'muted'
                            : 'green'
                        }
                        size="sm"
                      >
                        {tpl.source}
                      </Badge>
                    </td>
                  </tr>

                  {/* Expanded edit panel */}
                  {expandedId === tpl.id && editDraft && (
                    <tr key={`${tpl.id}-edit`}>
                      <td colSpan={5} className="px-0 py-0">
                        <div className="bg-gray-50 border-t border-ff-border px-6 py-5 space-y-5">
                          {/* Template info */}
                          <div className="grid grid-cols-2 gap-4">
                            <Input
                              label="Template Name"
                              value={editDraft.name}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, name: e.target.value })
                              }
                            />
                            <div>
                              <label className="block text-sm font-medium text-ff-text mb-1">
                                Work Types
                              </label>
                              <div className="flex flex-wrap gap-1 bg-white border border-ff-border rounded-md px-3 py-2 min-h-[38px]">
                                {editDraft.workTypes.map((wt) => (
                                  <Badge key={wt} variant="blue" size="sm">{wt}</Badge>
                                ))}
                              </div>
                              <p className="text-xs text-ff-text-muted mt-1">Multi-select (prototype: display only)</p>
                            </div>
                          </div>

                          {/* Seeded badge */}
                          {tpl.source === 'Seeded' && (
                            <Badge variant="blue" size="sm">
                              Seeded from: {tpl.name.includes('Abatement') ? 'Abatement archetype' : tpl.name.includes('Insurance') ? 'Insurance archetype' : 'Template archetype'}
                            </Badge>
                          )}

                          {/* Section cards */}
                          {editDraft.sections.length > 0 ? (
                            <>
                              <p className="text-xs font-medium text-ff-text-secondary uppercase tracking-wide">
                                Sections
                              </p>
                              <div className="grid grid-cols-2 gap-3">
                                {editDraft.sections.map((section) => (
                                  <div
                                    key={section.id}
                                    className={`border rounded-lg p-3 transition-colors ${
                                      section.visible
                                        ? 'border-l-4 border-l-green-500 border-t border-r border-b border-ff-border bg-white'
                                        : 'border border-ff-border bg-gray-100 opacity-60'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={section.visible}
                                          onChange={() => handleToggleSection(section.id)}
                                          className="w-4 h-4 rounded border-gray-300 text-ff-teal focus:ring-ff-teal"
                                        />
                                        <span className={`text-sm font-medium ${section.visible ? 'text-ff-text' : 'text-ff-text-muted'}`}>
                                          {section.name}
                                        </span>
                                      </label>
                                    </div>

                                    {/* Fields with required toggles (shown only when visible) */}
                                    {section.visible && section.fields.length > 0 && (
                                      <div className="ml-6 space-y-1.5 mt-2">
                                        {section.fields.map((field) => (
                                          <div key={field.name} className="flex items-center justify-between text-xs">
                                            <span className="text-ff-text-secondary">{field.name}</span>
                                            <button
                                              onClick={() => handleToggleFieldRequired(section.id, field.name)}
                                              className={`px-2 py-0.5 rounded text-xs font-medium transition-colors ${
                                                field.required
                                                  ? 'bg-red-50 text-red-600'
                                                  : 'bg-gray-100 text-ff-text-muted'
                                              }`}
                                            >
                                              {field.required ? 'Required' : 'Optional'}
                                            </button>
                                          </div>
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                              <p className="text-xs text-ff-text-muted italic">
                                Unchecked sections are hidden from the lead form but can always be added by the user.
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-ff-text-muted">
                              This template has no section configuration. {tpl.source === 'System Default' ? 'All sections are shown by default.' : 'Click to configure sections.'}
                            </p>
                          )}

                          {/* Save / Cancel */}
                          <div className="flex items-center gap-3 pt-2">
                            <Button onClick={handleSave}>Save</Button>
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

      {/* Client personas note */}
      <div className="bg-gray-50 border border-ff-border rounded-lg p-4 text-sm text-ff-text-secondary">
        <p className="font-medium text-ff-text mb-1">Client Personas</p>
        <p>
          When a lead template is associated with specific work types, it auto-applies when those work types are selected during lead creation.
          This reduces clicks for estimators and ensures the right fields are visible from the start.
        </p>
      </div>
    </div>
  );
}
