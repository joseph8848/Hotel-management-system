import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  BedDouble, 
  CalendarCheck, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Overview', path: '/dashboard' },
    { icon: BedDouble, label: 'Rooms', path: '/dashboard/rooms' },
    { icon: CalendarCheck, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: Users, label: 'Users', path: '/dashboard/users', adminOnly: true },
    { icon: Settings, label: 'Settings', path: '/dashboard/settings' },
  ];

  const filteredMenu = menuItems.filter(item => !item.adminOnly || user?.role === 'admin');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-primary/40 backdrop-blur-xl border-r border-white/10 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center text-white font-display text-xl">CH</div>
            <span className="text-white font-display text-lg tracking-wider uppercase">Champion Portal</span>
          </div>

          <nav className="flex-1 space-y-2">
            {filteredMenu.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  location.pathname === item.path 
                  ? 'bg-secondary text-white shadow-lg shadow-secondary/20' 
                  : 'text-white/50 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon size={20} className={location.pathname === item.path ? 'text-white' : 'group-hover:text-secondary'} />
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 text-white/50 hover:text-error hover:bg-error/5 rounded-xl transition-all duration-200 mt-auto"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-primary/20 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-white/5 rounded-lg text-white"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" size={18} />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 w-64 focus:outline-none focus:border-secondary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button className="relative p-2 text-white/60 hover:text-white transition-colors">
              <Bell size={22} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-secondary rounded-full border-2 border-[#0f172a]" />
            </button>
            
            <div className="flex items-center gap-4 pl-6 border-l border-white/10">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold">{user?.username || 'Admin User'}</p>
                <p className="text-xs text-secondary capitalize">{user?.role || 'Administrator'}</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-secondary to-accent p-0.5">
                <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold">
                  {user?.username?.charAt(0).toUpperCase() || 'A'}
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
