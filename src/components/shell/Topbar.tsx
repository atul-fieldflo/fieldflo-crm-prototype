import { useAppContext } from '../../context/AppContext';
import { Bell, Search, Settings } from 'lucide-react';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function Topbar() {
  const { currentUser } = useAppContext();

  return (
    <header className="bg-ff-topbar h-11 flex items-center justify-between px-4 text-white shrink-0">
      {/* Left: Logo */}
      <div className="flex items-center gap-2">
        <span className="font-semibold text-base tracking-tight">FieldFlo</span>
      </div>

      {/* Center: intentionally empty */}
      <div />

      {/* Right: User info */}
      <div className="flex items-center gap-3">
        <button className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Search">
          <Search size={16} />
        </button>
        <button className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Notifications">
          <Bell size={16} />
        </button>
        <button className="p-1 rounded hover:bg-white/10 transition-colors" aria-label="Settings">
          <Settings size={16} />
        </button>
        <div className="flex items-center gap-2 ml-1">
          <div className="w-7 h-7 rounded-full bg-ff-teal flex items-center justify-center text-xs font-medium">
            {getInitials(currentUser.name)}
          </div>
          <span className="text-sm hidden sm:inline">{currentUser.name}</span>
        </div>
      </div>
    </header>
  );
}
