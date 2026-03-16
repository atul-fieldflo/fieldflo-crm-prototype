interface OPModeToggleProps {
  value: 'total' | 'per_section' | 'per_line_item';
  onChange: (v: 'total' | 'per_section' | 'per_line_item') => void;
}

const options: { value: OPModeToggleProps['value']; label: string }[] = [
  { value: 'per_line_item', label: 'Per Line Item' },
  { value: 'per_section', label: 'Per Section' },
  { value: 'total', label: 'Grand Total' },
];

export default function OPModeToggle({ value, onChange }: OPModeToggleProps) {
  return (
    <div className="inline-flex">
      {options.map((opt, i) => {
        const isActive = value === opt.value;
        const rounded = i === 0 ? 'rounded-l-lg' : i === options.length - 1 ? 'rounded-r-lg' : '';
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-4 py-2 text-sm font-medium border transition-colors ${rounded} ${
              isActive
                ? 'bg-ff-teal-light text-ff-teal-dark border-ff-teal-dark z-10'
                : 'bg-white border-ff-border text-ff-text-secondary hover:border-ff-teal -ml-px'
            }`}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
