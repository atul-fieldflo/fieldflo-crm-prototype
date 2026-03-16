import { leadDocuments } from '../../../mockData';
import Badge from '../../ui/Badge';
import { CheckCircle, Upload } from 'lucide-react';

const confidenceBadgeVariant: Record<string, 'green' | 'amber' | 'red'> = {
  high: 'green',
  medium: 'amber',
  low: 'red',
};

export default function FilesPanel() {
  return (
    <div className="space-y-4">
      <div className="bg-ff-card border border-ff-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-ff-border">
          <h2 className="text-base font-semibold text-ff-text">Files</h2>
          <span className="text-xs text-ff-text-muted">
            {leadDocuments.length} document{leadDocuments.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ff-text-secondary text-xs border-b border-ff-border">
              <th className="px-5 py-2.5 font-medium">File Name</th>
              <th className="px-4 py-2.5 font-medium">Type</th>
              <th className="px-4 py-2.5 font-medium text-right">Pages</th>
              <th className="px-4 py-2.5 font-medium text-right">Size</th>
              <th className="px-4 py-2.5 font-medium">Uploaded By</th>
              <th className="px-4 py-2.5 font-medium">AI Status</th>
            </tr>
          </thead>
          <tbody>
            {leadDocuments.map((doc) => (
              <tr
                key={doc.id}
                className={`border-b border-ff-border-light transition-colors hover:bg-ff-card-hover ${
                  doc.isNew ? 'bg-ff-teal-light/30' : ''
                }`}
              >
                <td className="px-5 py-3 font-medium text-ff-text">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-xs">{doc.name}</span>
                    {doc.isNew && (
                      <Badge variant="teal" size="sm">NEW</Badge>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-ff-text-secondary">{doc.type}</td>
                <td className="px-4 py-3 text-ff-text-secondary text-right">{doc.pages}</td>
                <td className="px-4 py-3 text-ff-text-secondary text-right">{doc.size}</td>
                <td className="px-4 py-3 text-ff-text-secondary">{doc.uploadedBy}</td>
                <td className="px-4 py-3">
                  {doc.processedByAI ? (
                    <div className="flex items-center gap-1.5">
                      <CheckCircle size={16} className="text-ff-green" />
                      <Badge variant={confidenceBadgeVariant[doc.confidence] ?? 'muted'} size="sm">
                        {doc.confidence}
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-ff-text-muted text-xs">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Upload drop zone */}
      <div className="border-2 border-dashed border-ff-border rounded-lg p-8 text-center hover:border-ff-teal transition-colors cursor-pointer">
        <Upload size={24} className="mx-auto text-ff-text-muted mb-2" />
        <p className="text-sm text-ff-text-secondary font-medium">
          Drop files here or click to upload
        </p>
        <p className="text-xs text-ff-text-muted mt-1">
          PDF, DOCX, XLSX, or image files up to 50 MB
        </p>
      </div>
    </div>
  );
}
