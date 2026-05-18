import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { Outlet } from 'react-router-dom';

export const AppLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-zinc-900">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile topbar */}
        <Topbar />

        {/* Page content */}
       <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-zinc-900">
          <Outlet />
        </main>
      </div>
    </div>
  );
};