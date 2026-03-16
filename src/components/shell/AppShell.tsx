import { Outlet, useLocation } from 'react-router-dom';
import Topbar from './Topbar';
import Sidebar from './Sidebar';

const fullScreenSuffixes = ['/proposals/canvas', '/proposals/before-after', '/proposals/send'];

export default function AppShell() {
  const { pathname } = useLocation();
  const isFullScreen = fullScreenSuffixes.some((s) => pathname.endsWith(s));

  return (
    <div className="flex flex-col h-screen">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        {!isFullScreen && <Sidebar />}
        <main className={`flex-1 bg-ff-bg overflow-y-auto ${isFullScreen ? 'p-0' : 'p-6'}`}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
