import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext, useAppDispatch } from '../../../context/AppContext';
import { clients, users, leadTemplates } from '../../../mockData';
import Input from '../../ui/Input';
import Dropdown from '../../ui/Dropdown';
import Badge from '../../ui/Badge';
import { Sparkles, ChevronRight, Plus } from 'lucide-react';

const confidenceOptions = [
  { value: 'Low', label: 'Low' },
  { value: 'Medium', label: 'Medium' },
  { value: 'High', label: 'High' },
];

const occupancyOptions = [
  { value: 'Vacant', label: 'Vacant' },
  { value: 'Partially Occupied', label: 'Partially Occupied' },
  { value: 'Fully Occupied', label: 'Fully Occupied' },
];

const clientOptions = clients.map((c) => ({ value: c.id, label: c.name }));

const estimatorOptions = users
  .filter((u) => u.role === 'Estimator')
  .map((u) => ({ value: u.id, label: u.name }));

const templateOptions = leadTemplates.map((t) => ({ value: t.id, label: t.name }));

function formatCurrency(val: string): string {
  const num = parseFloat(val.replace(/[^0-9.]/g, ''));
  if (isNaN(num)) return '';
  return num.toLocaleString('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 });
}

export default function GeneralInfoSection() {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const { activeLead } = useAppContext();
  const dispatch = useAppDispatch();
  const [showMore, setShowMore] = useState(false);

  if (!activeLead) return null;

  const setField = (field: string, value: any) => {
    dispatch({ type: 'SET_FIELD', payload: { field, value } });
  };

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId);
    setField('clientId', clientId);
    setField('clientName', client?.name ?? '');
  };

  return (
    <div className="space-y-4">
      {/* AI Discovery Banner */}
      <div className="bg-ff-teal-light border border-ff-teal rounded-lg px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles size={18} className="text-ff-teal-dark" />
          <span className="text-sm text-ff-teal-dark font-medium">
            AI has analyzed your 3 documents and prepared a Discovery Packet.
          </span>
          <Badge variant="amber" size="sm">3 risk signals identified</Badge>
        </div>
        <button
          onClick={() => navigate(`/crm/leads/${leadId}/discovery`)}
          className="flex items-center gap-1 text-sm font-medium text-ff-teal-dark hover:underline"
        >
          View Discovery Packet
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Form */}
      <div className="bg-ff-card border border-ff-border rounded-lg p-5">
        <h2 className="text-base font-semibold text-ff-text mb-4">General Information</h2>

        <div className="grid grid-cols-2 gap-x-6 gap-y-4">
          {/* Lead Name */}
          <Input
            label="Lead Name"
            value={activeLead.leadName}
            onChange={(e) => setField('leadName', e.target.value)}
            placeholder="Enter lead name"
          />

          {/* Lead Number */}
          <Input
            label="Lead Number"
            value={activeLead.leadNumber}
            readOnly
            className="bg-gray-50 cursor-not-allowed"
          />

          {/* Client */}
          <div>
            <label className="block text-sm font-medium text-ff-text mb-1">Client</label>
            <Dropdown
              options={clientOptions}
              value={activeLead.clientId}
              onChange={handleClientChange}
              placeholder="Select client..."
            />
          </div>

          {/* Site Name */}
          <Input
            label="Site Name"
            value={activeLead.siteName}
            onChange={(e) => setField('siteName', e.target.value)}
            placeholder="Enter site name"
          />

          {/* Site Address */}
          <div className="col-span-2">
            <Input
              label="Site Address"
              value={activeLead.siteAddress}
              onChange={(e) => setField('siteAddress', e.target.value)}
              placeholder="Enter site address"
            />
          </div>

          {/* Bid Due Date */}
          <Input
            label="Bid Due Date"
            type="date"
            value={activeLead.bidDue}
            onChange={(e) => setField('bidDue', e.target.value)}
          />

          {/* Walkthrough Date */}
          <Input
            label="Walkthrough Date"
            type="date"
            value={activeLead.walkthroughDate}
            onChange={(e) => setField('walkthroughDate', e.target.value)}
          />

          {/* Estimator */}
          <div>
            <label className="block text-sm font-medium text-ff-text mb-1">Estimator</label>
            <Dropdown
              options={estimatorOptions}
              value={activeLead.estimatorId}
              onChange={(v) => setField('estimatorId', v)}
              placeholder="Select estimator..."
            />
          </div>

          {/* Confidence */}
          <div>
            <label className="block text-sm font-medium text-ff-text mb-1">Confidence</label>
            <Dropdown
              options={confidenceOptions}
              value={activeLead.confidence}
              onChange={(v) => setField('confidence', v)}
              placeholder="Select confidence..."
            />
          </div>

          {/* Contract Value */}
          <Input
            label="Contract Value"
            value={activeLead.contractValue}
            onChange={(e) => {
              const raw = e.target.value.replace(/[^0-9.]/g, '');
              setField('contractValue', raw);
            }}
            onBlur={() => {
              if (activeLead.contractValue) {
                setField('contractValue', formatCurrency(activeLead.contractValue));
              }
            }}
            placeholder="$0"
          />

          {/* Occupancy Type */}
          <div>
            <label className="block text-sm font-medium text-ff-text mb-1">Occupancy Type</label>
            <Dropdown
              options={occupancyOptions}
              value={activeLead.occupancyType}
              onChange={(v) => setField('occupancyType', v)}
              placeholder="Select occupancy type..."
            />
          </div>

          {/* Work Types */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-ff-text mb-1">Work Types</label>
            <div className="flex flex-wrap gap-1.5">
              {activeLead.workTypes.length > 0 ? (
                activeLead.workTypes.map((wt) => (
                  <Badge key={wt} variant="teal" size="sm">{wt}</Badge>
                ))
              ) : (
                <span className="text-sm text-ff-text-muted">No work types assigned</span>
              )}
            </div>
          </div>
        </div>

        {/* Expand more fields */}
        {!showMore && (
          <button
            onClick={() => setShowMore(true)}
            className="mt-4 flex items-center gap-1 text-sm text-ff-teal-dark hover:underline"
          >
            <Plus size={14} />
            Add more fields
          </button>
        )}

        {showMore && (
          <div className="mt-4 pt-4 border-t border-ff-border grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Hazmat Notes */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-ff-text mb-1">Hazmat Notes</label>
              <textarea
                value={activeLead.hazmatNotes}
                onChange={(e) => setField('hazmatNotes', e.target.value)}
                placeholder="Enter hazmat notes..."
                rows={3}
                className="w-full bg-white border border-ff-border rounded-md text-ff-text placeholder:text-ff-text-muted focus:border-ff-teal focus:ring-1 focus:ring-ff-teal outline-none px-3 py-2 text-sm resize-none"
              />
            </div>

            {/* Template */}
            <div>
              <label className="block text-sm font-medium text-ff-text mb-1">Template</label>
              <Dropdown
                options={templateOptions}
                value={activeLead.templateId}
                onChange={(v) => setField('templateId', v)}
                placeholder="Select template..."
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
