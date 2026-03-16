import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { workTypes, leadTemplates } from '../../mockData';
import { useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import AIProcessingOverlay from '../ui/AIProcessingOverlay';
import { Sparkles } from 'lucide-react';

// Work types that AI pre-selects
const aiPreSelected = ['wt-01', 'wt-02']; // Selective Interior Demolition, Abatement (ACM/Lead)

export default function WorkTypeConfig() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [selectedWorkTypes, setSelectedWorkTypes] = useState<string[]>(aiPreSelected);
  const [selectedTemplate, setSelectedTemplate] = useState<string>('infer');
  const [aiState, setAiState] = useState<'idle' | 'processing' | 'complete'>('idle');

  const toggleWorkType = useCallback((id: string) => {
    setSelectedWorkTypes((prev) =>
      prev.includes(id) ? prev.filter((wt) => wt !== id) : [...prev, id]
    );
  }, []);

  const handleCreateLead = useCallback(async () => {
    setAiState('processing');
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setAiState('complete');

    // Update the active lead's work types and template
    const selectedLabels = workTypes
      .filter((wt) => selectedWorkTypes.includes(wt.id))
      .map((wt) => wt.label);

    dispatch({
      type: 'SET_FIELD',
      payload: { field: 'workTypes', value: selectedLabels },
    });

    if (selectedTemplate !== 'infer') {
      dispatch({
        type: 'SET_TEMPLATE',
        payload: selectedTemplate,
      });
    }

    // Brief pause to show completion, then navigate
    await new Promise((resolve) => setTimeout(resolve, 400));
    navigate('/crm/leads/l-new/general-info');
  }, [selectedWorkTypes, selectedTemplate, dispatch, navigate]);

  return (
    <div className="max-w-2xl mx-auto relative">
      {aiState === 'processing' && (
        <div className="absolute inset-0 z-10">
          <AIProcessingOverlay
            label="Configuring lead..."
            sublabel="Applying work type settings and template"
          />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h2 className="text-lg font-semibold text-ff-text mb-1">Configure Work Types</h2>
        <p className="text-sm text-ff-text-secondary mb-6">
          Select the work types for this lead. AI has pre-selected based on the intake data.
        </p>

        {/* Work Types Grid */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {workTypes.map((wt) => {
            const isSelected = selectedWorkTypes.includes(wt.id);
            const isAIPick = aiPreSelected.includes(wt.id);

            return (
              <button
                key={wt.id}
                type="button"
                onClick={() => toggleWorkType(wt.id)}
                className={`text-left border rounded-lg p-3 transition-colors ${
                  isSelected
                    ? 'border-ff-teal bg-ff-teal-light/40'
                    : 'border-ff-border bg-white hover:border-ff-teal/50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {/* Checkbox */}
                  <div
                    className={`mt-0.5 w-4.5 h-4.5 rounded border flex items-center justify-center shrink-0 ${
                      isSelected
                        ? 'bg-ff-teal border-ff-teal'
                        : 'border-ff-border bg-white'
                    }`}
                  >
                    {isSelected && (
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path
                          d="M2.5 6L5 8.5L9.5 3.5"
                          stroke="white"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-ff-text">
                        {wt.label}
                      </span>
                      {isAIPick && (
                        <span className="inline-flex items-center gap-1">
                          <Badge variant="ai">
                            <Sparkles size={10} className="mr-0.5" />
                            AI
                          </Badge>
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-ff-text-secondary mt-0.5 leading-relaxed">
                      {wt.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Lead Template Selection */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold text-ff-text mb-3">Lead Template</h3>
          <p className="text-xs text-ff-text-secondary mb-3">
            Choose a template to pre-configure sections and required fields, or let the system infer from the selected work types.
          </p>

          <div className="space-y-2">
            {/* System infer option */}
            <label
              className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedTemplate === 'infer'
                  ? 'border-ff-teal bg-ff-teal-light/40'
                  : 'border-ff-border bg-white hover:border-ff-teal/50'
              }`}
            >
              <input
                type="radio"
                name="template"
                value="infer"
                checked={selectedTemplate === 'infer'}
                onChange={() => setSelectedTemplate('infer')}
                className="mt-0.5 accent-ff-teal"
              />
              <div>
                <span className="text-sm font-medium text-ff-text">
                  Let the system infer
                </span>
                <p className="text-xs text-ff-text-secondary mt-0.5">
                  Automatically select sections based on chosen work types
                </p>
              </div>
            </label>

            {leadTemplates.map((tmpl) => (
              <label
                key={tmpl.id}
                className={`flex items-start gap-3 border rounded-lg p-3 cursor-pointer transition-colors ${
                  selectedTemplate === tmpl.id
                    ? 'border-ff-teal bg-ff-teal-light/40'
                    : 'border-ff-border bg-white hover:border-ff-teal/50'
                }`}
              >
                <input
                  type="radio"
                  name="template"
                  value={tmpl.id}
                  checked={selectedTemplate === tmpl.id}
                  onChange={() => setSelectedTemplate(tmpl.id)}
                  className="mt-0.5 accent-ff-teal"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-ff-text">
                      {tmpl.name}
                    </span>
                    <Badge
                      variant={
                        tmpl.source === 'Seeded'
                          ? 'teal'
                          : tmpl.source === 'User Created'
                            ? 'purple'
                            : 'muted'
                      }
                      size="sm"
                    >
                      {tmpl.source}
                    </Badge>
                  </div>
                  <p className="text-xs text-ff-text-secondary mt-0.5">
                    {tmpl.description}
                  </p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleCreateLead}
            disabled={selectedWorkTypes.length === 0 || aiState === 'processing'}
          >
            Create Lead
          </Button>
          <Button variant="secondary" size="md" onClick={() => navigate(-1)}>
            Back
          </Button>
          {selectedWorkTypes.length === 0 && (
            <span className="text-xs text-ff-text-muted">
              Select at least one work type
            </span>
          )}
        </div>
      </motion.div>
    </div>
  );
}
