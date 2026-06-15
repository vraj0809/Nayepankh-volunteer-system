import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, Menu, Terminal } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/formatters';

const AdminHeader = ({ title, subtitle, onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header
      className="border-b border-white/5 sticky top-0 z-30 px-4 sm:px-6 py-3"
      style={{ background: 'rgba(10, 15, 30, 0.95)', backdropFilter: 'blur(20px)' }}
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 -ml-1 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              <h2 className="text-sm sm:text-base font-semibold text-white truncate font-mono tracking-tight">
                {title || 'Admin Panel'}
              </h2>
            </div>
            {subtitle && (
              <p className="text-xs text-slate-500 truncate hidden sm:block font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Notification */}
          <button
            className="relative w-9 h-9 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-slate-400 hover:text-white hover:border-white/15 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-emerald-400 rounded-full" />
          </button>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
              {getInitials(user?.name || 'Admin')}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white leading-tight">{user?.name}</p>
              <p className="text-[10px] text-emerald-400 font-mono tracking-widest">ADMINISTRATOR</p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 rounded-xl border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
