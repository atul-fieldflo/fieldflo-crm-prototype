import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch } from '../../context/AppContext';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import AIProcessingOverlay from '../ui/AIProcessingOverlay';
import { Upload, FileText, FileSpreadsheet, File, CheckCircle2 } from 'lucide-react';

type Phase = 'upload' | 'processing_files' | 'ai_processing' | 'complete';

interface FileSlot {
  name: string;
  icon: React.ReactNode;
  progress: number;
}

const FILE_SLOTS: FileSlot[] = [
  { name: 'exactimate-export.pdf', icon: <FileText size={20} className="text-red-500" />, progress: 0 },
  { name: 'excel-template.xlsx', icon: <FileSpreadsheet size={20} className="text-green-600" />, progress: 0 },
  { name: 'icra-protocol-chandler.pdf', icon: <File size={20} className="text-blue-500" />, progress: 0 },
];

export default function EstimateImport() {
  const navigate = useNavigate();
  const { leadId } = useParams();
  const dispatch = useAppDispatch();

  const [phase, setPhase] = useState<Phase>('upload');
  const [files, setFiles] = useState<FileSlot[]>(FILE_SLOTS);

  const animateProgress = useCallback(() => {
    // Simulate progress bars to 100% over ~1.5s
    let frame = 0;
    const totalFrames = 30;
    const interval = setInterval(() => {
      frame++;
      const pct = Math.min(100, Math.round((frame / totalFrames) * 100));
      setFiles((prev) =>
        prev.map((f, i) => ({
          ...f,
          progress: Math.min(100, pct + (i === 0 ? 0 : i === 1 ? -8 : -15)),
        }))
      );
      if (frame >= totalFrames + 5) {
        clearInterval(interval);
        setFiles((prev) => prev.map((f) => ({ ...f, progress: 100 })));
        setPhase('ai_processing');
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (phase === 'processing_files') {
      const cleanup = animateProgress();
      return cleanup;
    }
  }, [phase, animateProgress]);

  useEffect(() => {
    if (phase === 'ai_processing') {
      const timer = setTimeout(() => {
        setPhase('complete');
        dispatch({ type: 'SET_LINE_ITEMS_EXTRACTED' });
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [phase, dispatch]);

  const handleDrop = () => {
    setPhase('processing_files');
  };

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ff-text">Import from Estimate</h1>
        <p className="text-sm text-ff-text-secondary mt-1">
          Upload estimate files and AI will extract line items automatically.
        </p>
      </div>

      {/* Upload Phase */}
      {phase === 'upload' && (
        <div
          onClick={handleDrop}
          className="border-2 border-dashed border-ff-border rounded-xl p-12 text-center
            hover:border-ff-teal hover:bg-ff-teal-light/30 transition-all cursor-pointer group"
        >
          <Upload
            size={48}
            className="mx-auto text-ff-text-muted group-hover:text-ff-teal transition-colors mb-4"
          />
          <p className="text-ff-text font-medium">Drop files here or click to upload</p>
          <p className="text-sm text-ff-text-muted mt-2">
            Supports Exactimate exports (.pdf), Excel templates (.xlsx), and ICRA protocols (.pdf)
          </p>
        </div>
      )}

      {/* File Processing Phase */}
      {(phase === 'processing_files' || phase === 'ai_processing' || phase === 'complete') && (
        <div className="space-y-4">
          <div className="bg-ff-card border border-ff-border rounded-lg divide-y divide-ff-border">
            {files.map((file) => (
              <div key={file.name} className="flex items-center gap-3 px-4 py-3">
                {file.icon}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-ff-text truncate">{file.name}</p>
                  <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-ff-teal rounded-full transition-all duration-100"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>
                <span className="text-xs text-ff-text-muted w-10 text-right">
                  {file.progress >= 100 ? (
                    <CheckCircle2 size={16} className="text-ff-green inline" />
                  ) : (
                    `${file.progress}%`
                  )}
                </span>
              </div>
            ))}
          </div>

          {/* AI Processing */}
          {phase === 'ai_processing' && (
            <div className="mt-6">
              <AIProcessingOverlay
                label="Extracting line items from estimates..."
                sublabel="Analyzing 3 documents with AI"
                inline
              />
            </div>
          )}

          {/* Complete */}
          {phase === 'complete' && (
            <div className="mt-6 space-y-4">
              <div className="bg-ff-teal-light border border-ff-teal rounded-lg p-5 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 size={20} className="text-ff-teal-dark" />
                  <span className="text-ff-teal-dark font-semibold">Extraction Complete</span>
                  <Badge variant="ai">AI</Badge>
                </div>
                <p className="text-sm text-ff-teal-dark">
                  12 line items extracted across 3 sections
                </p>
              </div>

              <Button
                variant="primary"
                size="lg"
                className="w-full"
                onClick={() => navigate(`/crm/leads/${leadId}/proposals/line-items`)}
              >
                Review Line Items &rarr;
              </Button>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => navigate(`/crm/leads/${leadId}/proposals/new`)}
          className="text-sm text-ff-text-secondary hover:text-ff-text transition-colors"
        >
          &larr; Back
        </button>
      </div>
    </div>
  );
}
