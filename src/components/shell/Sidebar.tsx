import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Users,
  ListChecks,
  ClipboardList,
  Layers,
  FileSignature,
  BookTemplate,
  DollarSign,
  FolderKanban,
  CalendarDays,
  Banknote,
  ShieldCheck,
  Warehouse,
} from 'lucide-react';

const crmLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/leads', label: 'Leads', icon: FileText, badge: true },
  { to: '/clients', label: 'Clients', icon: Users },
];

const adminLinks = [
  { to: '/admin/bid-types', label: 'Bid Types', icon: ListChecks },
  { to: '/admin/tasks', label: 'Tasks', icon: ClipboardList },
  { to: '/admin/task-groups', label: 'Task Groups', icon: Layers },
  { to: '/admin/proposal-templates', label: 'Proposal Templates', icon: FileSignature },
  { to: '/admin/lead-templates', label: 'Lead Templates', icon: BookTemplate },
  { to: '/admin/rate-sheets', label: 'Rate Sheets', icon: DollarSign },
];

const comingSoonLinks = [
  { label: 'Projects', icon: FolderKanban },
  { label: 'Scheduling', icon: CalendarDays },
  { label: 'Payroll', icon: Banknote },
  { label: 'Safety', icon: ShieldCheck },
  { label: 'Warehouse', icon: Warehouse },
];

const baseLinkClass =
  'flex items-center gap-2.5 px-3 py-1.5 rounded-md text-sm transition-colors';

function navLinkClassName({ isActive }: { isActive: boolean }) {
  return isActive
    ? `${baseLinkClass} bg-ff-sidebar-active-bg text-ff-sidebar-active font-medium border-l-3 border-ff-sidebar-active`
    : `${baseLinkClass} text-ff-sidebar-text hover:bg-ff-sidebar-active-bg/50`;
}

export default function Sidebar() {
  return (
    <aside className="bg-ff-sidebar w-56 flex flex-col shrink-0 overflow-y-auto border-r border-ff-border">
      {/* CRM section */}
      <nav className="mt-4 px-2">
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-ff-text-muted">
          CRM
        </p>
        <ul className="space-y-0.5">
          {crmLinks.map(({ to, label, icon: Icon, badge }) => (
            <li key={to}>
              <NavLink to={to} className={navLinkClassName}>
                <Icon size={16} />
                <span className="flex-1">{label}</span>
                {badge && (
                  <span className="bg-ff-teal text-white text-[10px] font-medium rounded-full px-1.5 py-0.5 leading-none">
                    3
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Admin section */}
      <nav className="mt-5 px-2">
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-ff-text-muted">
          Admin
        </p>
        <ul className="space-y-0.5">
          {adminLinks.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink to={to} className={navLinkClassName}>
                <Icon size={16} />
                <span>{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Coming soon */}
      <nav className="mt-auto pt-4 pb-4 px-2 border-t border-ff-border">
        <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-wider text-ff-text-muted">
          Coming Soon
        </p>
        <ul className="space-y-0.5">
          {comingSoonLinks.map(({ label, icon: Icon }) => (
            <li key={label}>
              <div
                className={`${baseLinkClass} text-ff-text-muted cursor-not-allowed opacity-50`}
              >
                <Icon size={16} />
                <span>{label}</span>
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
