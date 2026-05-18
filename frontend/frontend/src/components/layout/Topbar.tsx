import { useState } from 'react';
import { Menu, X, Zap, Moon, Sun, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useThemeStore } from '@/store/themeStore';
import { cn } from '@/utils';

export const Topbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { isDark, toggle } = useThemeStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-gray-100 bg-white px-4 dark:border-white/10 dark:bg-zinc-900-2 lg:hidden">
        <div className="flex items-center gap-2">
          <div className="flex size-7 items-center justify-center rounded-lg bg-brand-600">
            <Zap className="size-4 text-white" />
          </div>
          <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">SmartLeads</span>
        </div>

        <button
          onClick={() => setMenuOpen((p) => !p)}
          className="rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </header>

      {/* Mobile drawer */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-64 flex-col bg-white dark:bg-zinc-900-2">
            <div className="flex h-14 items-center gap-2 border-b border-gray-100 px-4 dark:border-white/10">
              <div className="flex size-7 items-center justify-center rounded-lg bg-brand-600">
                <Zap className="size-4 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">SmartLeads</span>
            </div>

            <nav className="flex flex-1 flex-col gap-1 p-3">
              {[
                { to: '/dashboard', label: 'Dashboard' },
                { to: '/leads', label: 'Leads' },
              ].map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                 className={({ isActive }: { isActive: boolean }) =>
                    cn(
                      'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400'
                        : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10'
                    )
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="border-t border-gray-100 p-3 dark:border-white/10">
              {user && (
                <p className="mb-2 px-3 text-xs text-gray-500">
                  {user.name} · <span className="capitalize">{user.role}</span>
                </p>
              )}
              <button
                onClick={toggle}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/10"
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
                {isDark ? 'Light mode' : 'Dark mode'}
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="size-4" />
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};