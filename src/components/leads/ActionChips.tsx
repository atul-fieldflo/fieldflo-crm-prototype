import { useAppContext, useAppDispatch } from '../../context/AppContext';

interface ChipDef {
  sectionId: string;
  label: string;
}

const availableChips: ChipDef[] = [
  { sectionId: 'job-walk', label: '+ Job Walk' },
  { sectionId: 'reach-out', label: '+ Reach Out' },
  { sectionId: 'unknowns', label: '+ Unknowns' },
  { sectionId: 'pursuit-decision', label: '+ Pursuit Decision' },
  { sectionId: 'handoff-brief', label: '+ Handoff Brief' },
  { sectionId: 'assigned-personnel', label: '+ Assigned Personnel' },
  { sectionId: 'referral', label: '+ Referral' },
];

export default function ActionChips() {
  const { activeSections } = useAppContext();
  const dispatch = useAppDispatch();

  const visibleChips = availableChips.filter(
    (chip) => !activeSections.includes(chip.sectionId)
  );

  if (visibleChips.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {visibleChips.map((chip) => (
        <button
          key={chip.sectionId}
          onClick={() => dispatch({ type: 'ADD_SECTION', payload: chip.sectionId })}
          className="border border-dashed border-ff-border text-ff-text-secondary rounded-full px-3 py-1 text-sm hover:border-ff-teal hover:text-ff-teal-dark cursor-pointer transition-colors"
        >
          {chip.label}
        </button>
      ))}
    </div>
  );
}
