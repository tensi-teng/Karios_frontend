import React from 'react';
import {
  Shield,
  LayoutDashboard,
  Compass,
  UserCircle,
  Key,
  History,
  Plus,
  Layers,
  Bell,
} from 'lucide-react';

interface NavigationProps {
  currentPath: string;
  setPath: (path: string) => void;
  user: any;
}

const Navigation: React.FC<NavigationProps> = ({ currentPath, setPath, user }) => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10 px-12 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo (shifted more to the left) */}
        <div
          className="flex items-center gap-3 cursor-pointer shrink-0 translate-x-[-20px]"
          onClick={() => setPath('/')}
        >
          <div className="p-2 bg-indigo-600 rounded-lg glow">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold font-display tracking-tight text-white">
            Kairos
          </span>
        </div>

        {/* Center Navigation */}
        {user && (
          <div className="hidden md:flex items-center gap-10">
            <NavLink
              active={currentPath === '/dashboard' || currentPath.startsWith('/capsule/')}
              onClick={() => setPath('/dashboard')}
              icon={<LayoutDashboard className="w-4 h-4" />}
              label="My Vault"
            />
            <NavLink
              active={currentPath === '/create'}
              onClick={() => setPath('/create')}
              icon={<Plus className="w-4 h-4" />}
              label="Create"
            />
            <NavLink
              active={currentPath === '/unlock-vault'}
              onClick={() => setPath('/unlock-vault')}
              icon={<Key className="w-4 h-4" />}
              label="Recipient Unlock"
            />
            <NavLink
              active={currentPath === '/explore'}
              onClick={() => setPath('/explore')}
              icon={<Compass className="w-4 h-4" />}
              label="Registry"
            />
            <NavLink
              active={currentPath === '/icons'}
              onClick={() => setPath('/icons')}
              icon={<Layers className="w-4 h-4" />}
              label="Icons"
            />
            <NavLink
              active={currentPath === '/notifications'}
              onClick={() => setPath('/notifications')}
              icon={<Bell className="w-4 h-4" />}
              label="Notification"
            />
            <NavLink
              active={currentPath === '/history'}
              onClick={() => setPath('/history')}
              icon={<History className="w-4 h-4" />}
              label="Activity log"
            />
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-10 shrink-0 ml-8">
          {user && (
            <button
              onClick={() => setPath('/create')}
              className="hidden lg:flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/30 text-indigo-300 px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-indigo-600/20 transition-all uppercase tracking-widest"
            >
              <Plus className="w-3 h-3" />
              New Capsule
            </button>
          )}

          {user ? (
            <div
              className="flex items-center gap-3 glass pl-4 pr-1.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 transition-all cursor-pointer"
              onClick={() => setPath('/profile')}
            >
              <span className="text-sm font-bold text-gray-200">
                {user.name}
              </span>
              <img
                src={user.avatar}
                className="w-8 h-8 rounded-full border border-white/20"
                alt="avatar"
              />
            </div>
          ) : (
            <button
              className="flex items-center gap-2 bg-white text-black px-5 py-2 rounded-full font-bold hover:bg-gray-200 transition-all shadow-lg"
              onClick={() => setPath('/login')}
            >
              <UserCircle className="w-4 h-4" />
              Sign In
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}> = ({ active, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 text-sm font-bold transition-all uppercase tracking-widest ${active ? 'text-indigo-400' : 'text-gray-500 hover:text-white'
      }`}
  >
    {icon}
    {label}
  </button>
);

export default Navigation;