import { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import useAuthStore, { isAdmin, isBureau } from '../../store/authStore';
import SidebarDesktop from './SidebarDesktop';
import BottomNav from './BottomNav';
import Topbar from './Topbar';

export default function Layout() {
  const { token, membre } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!token) return <Navigate to="/welcome" replace />;

  const role = membre?.role || 'membre';

  return (
    <div className="min-h-screen bg-[#0f1117]">

      {/* Desktop Layout */}
      <div className="hidden md:flex h-screen overflow-hidden">
        <SidebarDesktop role={role} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden flex flex-col min-h-screen">
        <Topbar
          role={role}
          onMenuOpen={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-y-auto p-4 pb-24">
          <Outlet />
        </main>
        <BottomNav role={role} />
      </div>

    </div>
  );
}