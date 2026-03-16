import { motion } from 'framer-motion';

interface AIProcessingOverlayProps {
  label: string;
  sublabel?: string;
  inline?: boolean;
}

function RotatingHexagon() {
  return (
    <motion.svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <path
        d="M24 4 L42 14 L42 34 L24 44 L6 34 L6 14 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinejoin="round"
        className="text-ff-teal"
      />
    </motion.svg>
  );
}

export default function AIProcessingOverlay({
  label,
  sublabel,
  inline = false,
}: AIProcessingOverlayProps) {
  const content = (
    <div className="flex flex-col items-center gap-3">
      <RotatingHexagon />
      <p className="text-sm font-medium text-ff-text">{label}</p>
      {sublabel && <p className="text-xs text-ff-text-secondary">{sublabel}</p>}
    </div>
  );

  if (inline) {
    return (
      <div className="bg-ff-card border border-ff-border rounded-lg p-8 flex items-center justify-center">
        {content}
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm absolute inset-0 z-10 flex items-center justify-center">
      {content}
    </div>
  );
}
