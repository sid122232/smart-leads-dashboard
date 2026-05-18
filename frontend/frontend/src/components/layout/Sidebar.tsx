import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  LogOut,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn, getInitials } from '@/utils';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/leads', icon: Users, label: 'Leads' },
];

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-gray-100 bg-white transition-all duration-300 dark:border-white/10 dark:bg-zinc-900-2',
        collapsed ? 'w-16' : 'w-56'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 border-b border-gray-100 px-4 dark:border-white/10">
        <div className="flex size-7 flex-shrink-0 items-center justify-center rounded-lg bg-brand-600">
          <Zap className="size-4 text-white" />
        </div>
        {!collapsed && (
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
            SmartLeads
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex flex-1 flex-col gap-1 p-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
           className={({ isActive }: { isActive: boolean }) =>
              cn(
                'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10'
              )
            }
          >
            <Icon className="size-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 p-2 dark:border-white/10">
        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10',
            collapsed && 'justify-center'
          )}
        >
          {isDark ? <Sun className="size-4 flex-shrink-0" /> : <Moon className="size-4 flex-shrink-0" />}
          {!collapsed && <span>{isDark ? 'Light mode' : 'Dark mode'}</span>}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/20 dark:hover:text-red-400',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="size-4 flex-shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>

        {/* User info */}
        {user && (
          <div
            className={cn(
              'mt-2 flex items-center gap-2.5 rounded-lg p-2',
              collapsed && 'justify-center'
            )}
          >
            <div className="flex size-7 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700 dark:bg-brand-900/30 dark:text-brand-400">
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="truncate text-xs font-medium text-gray-900 dark:text-gray-100">
                  {user.name}
                </p>
                <div className="flex items-center gap-1">
                  <ShieldCheck className="size-3 text-gray-400" />
                  <p className="text-xs capitalize text-gray-400">{user.role}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((p) => !p)}
        className="absolute -right-3 top-16 flex size-6 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-400 shadow-sm hover:text-gray-600 dark:border-white/10 dark:bg-zinc-900-2"
      >
        {collapsed ? <ChevronRight className="size-3.5" /> : <ChevronLeft className="size-3.5" />}
      </button>
    </aside>
  );
};