import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, CheckCircle, Clock, XCircle,
  FileText, Zap, ChevronLeft, ChevronRight, X,
} from 'lucide-react';
import { useState } from 'react';

const links = [
  { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard', color: 'emerald' },
  { to: '/admin/volunteers', icon: Users, label: 'All Volunteers', color: 'slate' },
  { to: '/admin/volunteers?status=approved', icon: CheckCircle, label: 'Approved', color: 'emerald' },
  { to: '/admin/volunteers?status=pending', icon: Clock, label: 'Pending', color: 'amber' },
  { to: '/admin/volunteers?status=rejected', icon: XCircle, label: 'Rejected', color: 'rose' },
  { to: '/admin/reports', icon: FileText, label: 'Reports', color: 'violet' },
];

const SidebarContent = ({ collapsed, onClose, isMobile }) => (
  <>
    {/* Logo */}
    <div className={`border-b border-white/5 ${isMobile ? 'p-5' : 'p-5'}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-emerald-500/20">
            <Zap className="w-4 h-4 text-white" />
          </div>
          {(!collapsed || isMobile) && (
            <div className="min-w-0">
              <span className="text-white font-bold text-sm block truncate">NayePankh</span>
              <span className="text-emerald-400 text-[10px] font-mono tracking-widest block">ADMIN PANEL</span>
            </div>
          )}
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>

    {/* Nav Links */}
    <nav className="flex-1 py-5 px-3 space-y-1 overflow-y-auto no-scrollbar">
      {!collapsed && (
        <p className="px-3 text-[10px] font-mono text-slate-600 tracking-widest uppercase mb-3">Navigation</p>
      )}
      {links.map((link) => {
        const colorMap = {
          emerald: 'text-emerald-400',
          slate: 'text-slate-400',
          amber: 'text-amber-400',
          rose: 'text-rose-400',
          violet: 'text-violet-400',
        };
        return (
          <NavLink
            key={link.label}
            to={link.to}
            end={link.to === '/admin/dashboard'}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-white/8 text-white border border-white/8 shadow-sm'
                  : 'text-slate-500 hover:bg-white/4 hover:text-slate-200'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <link.icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive ? colorMap[link.color] : ''}`} style={{ width: '1.125rem', height: '1.125rem' }} />
                {(!collapsed || isMobile) && <span>{link.label}</span>}
                {isActive && !collapsed && (
                  <div className={`ml-auto w-1.5 h-1.5 rounded-full ${colorMap[link.color].replace('text-', 'bg-')}`} />
                )}
              </>
            )}
          </NavLink>
        );
      })}
    </nav>

    {/* Bottom info */}
    {(!collapsed || isMobile) && (
      <div className="p-4 border-t border-white/5">
        <div className="p-3 rounded-xl bg-white/3 border border-white/5">
          <p className="text-[10px] font-mono text-slate-600 tracking-widest mb-1">SYSTEM</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs text-slate-400">All systems operational</span>
          </div>
        </div>
      </div>
    )}
  </>
);

const AdminSidebar = ({ mobileOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="overlay-backdrop lg:hidden" onClick={onClose} aria-hidden="true" />
      )}

      {/* Mobile Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 flex flex-col lg:hidden transform transition-transform duration-300 ease-out shadow-2xl border-r border-white/5`}
        style={{ background: '#070c18', transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)' }}
      >
        <SidebarContent collapsed={false} onClose={onClose} isMobile />
      </aside>

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:flex flex-col min-h-screen sticky top-0 transition-all duration-300 flex-shrink-0 border-r border-white/5 ${
          collapsed ? 'w-[68px]' : 'w-60'
        }`}
        style={{ background: '#070c18' }}
      >
        <SidebarContent collapsed={collapsed} onClose={() => {}} isMobile={false} />

        <div className="p-3 border-t border-white/5">
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-300 text-xs transition-colors w-full justify-center py-2 rounded-lg hover:bg-white/5"
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <>
                <ChevronLeft className="w-4 h-4" />
                <span className="font-mono tracking-wide">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
