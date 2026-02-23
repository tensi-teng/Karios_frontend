
import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation.tsx';
import Landing from './pages/Landing.tsx';
import Dashboard from './pages/Dashboard.tsx';
import CreateCapsule from './pages/CreateCapsule.tsx';
import CapsuleDetail from './pages/CapsuleDetail.tsx';
import Explore from './pages/Explore.tsx';
import UnlockPage from './pages/Unlock.tsx';
import Profile from './pages/Profile.tsx';
import GlobalAudit from './pages/GlobalAudit.tsx';
import Notifications from './pages/Notifications.tsx';
import Badges from './pages/Badges.tsx';
import { Capsule, UserProfile } from './types.ts';

const App: React.FC = () => {
  const [currentPath, setCurrentPath] = useState('/');
  const [selectedCapsuleId, setSelectedCapsuleId] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [capsules, setCapsules] = useState<Capsule[]>([]);

  useEffect(() => {
    const savedUser = localStorage.getItem('kairos_user');
    if (savedUser) setUser(JSON.parse(savedUser));

    const savedCapsules = localStorage.getItem('kairos_capsules');
    if (savedCapsules) setCapsules(JSON.parse(savedCapsules));
  }, []);

  const handleLogin = () => {
    const mockUser: UserProfile = {
      address: '0x742d...f44e',
      name: 'Alex Rivera',
      email: 'alex.r@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
      trustScore: 98.2,
      capsulesCreated: capsules.length,
      badge: {
        id: '1',
        name: 'Legacy Pioneer',
        tier: 'GOLD',
        icon: '🏆',
        score: 1250
      }
    };
    setUser(mockUser);
    localStorage.setItem('kairos_user', JSON.stringify(mockUser));
    setCurrentPath('/dashboard');
  };

  const addCapsule = (newCap: Capsule) => {
    const updated = [newCap, ...capsules];
    setCapsules(updated);
    localStorage.setItem('kairos_capsules', JSON.stringify(updated));
    setCurrentPath('/dashboard');
  };

  const handlePing = (id: string) => {
    const updated = capsules.map(c => {
      if (c.id === id) {
        const newPing = {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: Date.now(),
          action: 'Pulse Signal Received',
          actor: 'Vault Guardian',
          status: 'SUCCESS' as const
        };
        return {
          ...c,
          lastPing: Date.now(),
          healthScore: 100,
          auditLog: [newPing, ...(c.auditLog || [])]
        };
      }
      return c;
    });
    setCapsules(updated);
    localStorage.setItem('kairos_capsules', JSON.stringify(updated));
  };

  const renderPage = () => {
    if (currentPath.startsWith('/capsule/') && selectedCapsuleId) {
      const capsule = capsules.find(c => c.id === selectedCapsuleId);
      if (!capsule) {
        return <Dashboard capsules={capsules} onCreateClick={() => setCurrentPath('/create')} onViewCapsule={(id) => { setSelectedCapsuleId(id); setCurrentPath(`/capsule/${id}`); }} />;
      }
      return <CapsuleDetail capsule={capsule} onBack={() => setCurrentPath('/dashboard')} onPing={() => handlePing(capsule.id)} />;
    }

    switch (currentPath) {
      case '/':
        return <Landing onGetStarted={() => user ? setCurrentPath('/dashboard') : setCurrentPath('/login')} />;
      case '/dashboard':
        return (
          <Dashboard
            capsules={capsules}
            onCreateClick={() => setCurrentPath('/create')}
            onViewCapsule={(id) => {
              setSelectedCapsuleId(id);
              setCurrentPath(`/capsule/${id}`);
            }}
          />
        );
      case '/create':
        return user ? (
          <CreateCapsule onComplete={addCapsule} onCancel={() => setCurrentPath('/dashboard')} />
        ) : (
          <div className="flex items-center justify-center min-h-[70vh] px-6">
            <div className="glass p-12 rounded-[2.5rem] text-center max-w-sm w-full border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
              <div className="w-16 h-16 bg-indigo-600/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                <Lock className="w-8 h-8 text-indigo-400" />
              </div>
              <h2 className="text-2xl font-bold mb-3 font-display text-white tracking-tight">Access Restricted</h2>
              <p className="text-gray-400 text-sm mb-8 leading-relaxed">The creation protocol requires a verified identity. Please sign in to establish your vault.</p>
              <button
                onClick={() => setCurrentPath('/login')}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-100 transition-all shadow-lg uppercase tracking-widest text-[10px]"
              >
                Sign In to Continue
              </button>
            </div>
          </div>
        );
      case '/explore':
        return <Explore capsules={capsules} />;
      case '/unlock-vault':
        return <UnlockPage />;
      case '/history':
        return <GlobalAudit capsules={capsules} />;
      case '/notifications':
        return <Notifications capsules={capsules} />;
      case '/icons':
        return <Badges user={user} />;
      case '/profile':
        return user ? <Profile user={user} capsules={capsules} /> : <Landing onGetStarted={handleLogin} />;
      case '/login':
        return (
          <div className="flex items-center justify-center min-h-screen px-6">
            <div className="glass p-12 rounded-[2.5rem] text-center max-w-md w-full border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold mb-4 font-display text-white">Welcome Back</h2>
              <p className="text-gray-400 mb-10">Sign in with your favorite provider via zkLogin. One-click vault access.</p>
              <div className="space-y-3">
                <LoginButton provider="Google" color="bg-white text-black" onClick={handleLogin} icon="https://www.google.com/favicon.ico" />
                <LoginButton provider="Apple" color="bg-black text-white" onClick={handleLogin} icon="https://www.apple.com/favicon.ico" />
                <LoginButton provider="Facebook" color="bg-blue-600 text-white" onClick={handleLogin} icon="https://www.facebook.com/favicon.ico" />
              </div>
            </div>
          </div>
        );
      default:
        return <Landing onGetStarted={() => setCurrentPath('/login')} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] relative selection:bg-indigo-500 selection:text-white overflow-x-hidden">
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-600/10 blur-[150px] rounded-full" />
      </div>
      <Navigation currentPath={currentPath} setPath={setCurrentPath} user={user} />
      <main className="relative z-10">{renderPage()}</main>
      <footer className="py-12 border-t border-white/5 relative z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 opacity-60">
            <span className="font-bold font-display text-white">Kairos Protocol</span>
          </div>
          <div className="flex items-center gap-8 text-sm text-gray-400">
            <button onClick={() => setCurrentPath('/unlock-vault')} className="hover:text-indigo-400 transition-colors font-medium">Recipient Unlock</button>
            <button onClick={() => setCurrentPath('/history')} className="hover:text-indigo-400 transition-colors font-medium">History</button>
            <a href="#" className="hover:text-indigo-400 transition-colors">Integrity Proofs (Seal)</a>
            <a href="#" className="hover:text-indigo-400 transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const LoginButton: React.FC<{ provider: string; color: string; onClick: () => void; icon: string }> = ({ provider, color, onClick, icon }) => (
  <button onClick={onClick} className={`w-full flex items-center justify-center gap-3 py-4 rounded-2xl font-bold transition-transform hover:scale-[1.02] active:scale-[0.98] ${color}`}>
    <img src={icon} className="w-5 h-5" alt={provider} />
    Sign in with {provider}
  </button>
);

export default App;
