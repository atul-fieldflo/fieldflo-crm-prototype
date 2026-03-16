import { NavLink } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext';
import {
  FileText,
  Search,
  FolderOpen,
  FileSpreadsheet,
  Footprints,
  Phone,
  HelpCircle,
  Target,
  ClipboardCheck,
  Users,
  Share2,
} from 'lucide-react';

interface SectionDef {
  id: string;
  label: string;
  slug: string;
  icon: React.ReactNode;
}

const allSections: SectionDef[] = [
  { id: 'general-info', label: 'General Info', slug: 'general-info', icon: <FileText size={16} /> },
  { id: 'discovery', label: 'Discovery Packet', slug: 'discovery', icon: <Search size={16} /> },
  { id: 'files', label: 'Files', slug: 'files', icon: <FolderOpen size={16} /> },
  { id: 'proposals', label: 'Proposals', slug: 'proposals', icon: <FileSpreadsheet size={16} /> },
  { id: 'job-walk', label: 'Job Walk', slug: 'job-walk', icon: <Footprints size={16} /> },
  { id: 'reach-out', label: 'Reach Out', slug: 'reach-out', icon: <Phone size={16} /> },
  { id: 'unknowns', label: 'Unknowns', slug: 'unknowns', icon: <HelpCircle size={16} /> },
  { id: 'pursuit-decision', label: 'Pursuit Decision', slug: 'pursuit-decision', icon: <Target size={16} /> },
  { id: 'handoff-brief', label: 'Handoff Brief', slug: 'handoff-brief', icon: <ClipboardCheck size={16} /> },
  { id: 'assigned-personnel', label: 'Assigned Personnel', slug: 'assigned-personnel', icon: <Users size={16} /> },
  { id: 'referral', label: 'Referral', slug: 'referral', icon: <Share2 size={16} /> },
];

interface LeadLeftNavProps {
  leadId: string;
}

export default function LeadLeftNav({ leadId }: LeadLeftNavProps) {
  const { activeSections } = useAppContext();

  const visibleSections = allSections.filter((s) => activeSections.includes(s.id));

  return (
    <nav className="bg-ff-card border border-ff-border rounded-lg py-2">
      {visibleSections.map((section) => (
        <NavLink
          key={section.id}
          to={`/crm/leads/${leadId}/${section.slug}`}
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 text-sm transition-colors ${
              isActive
                ? 'bg-ff-sidebar-active-bg text-ff-sidebar-active border-l-2 border-ff-teal-dark font-medium'
                : 'text-ff-text-secondary hover:text-ff-text hover:bg-gray-50 border-l-2 border-transparent'
            }`
          }
        >
          {section.icon}
          <span className="truncate">{section.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
