
import React, { useState } from 'react';
import { Plus, Activity, ShieldCheck, Clock, Eye, Award, Bell, AlertTriangle, Layers, Filter, CheckCircle2, Zap } from 'lucide-react';
import { Capsule, CapsuleState } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface DashboardProps {
  capsules: Capsule[];
  onCreateClick: () => void;
  onViewCapsule: (id: string) => void;
  onPingAll?: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ capsules, onCreateClick, onViewCapsule, onPingAll }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [isPingingAll, setIsPingingAll] = useState(false);
  
  const filteredCapsules = filter === 'ALL' 
    ? capsules 
    : capsules.filter(c => c.category === filter);

  const needsPingCount = capsules.filter(c => {
    const nextPing = c.lastPing + (c.pingFrequencyDays * 24 * 60 * 60 * 1000);
    return Date.now() > nextPing - (7 * 24 * 60 * 60 * 1000);
  }).length;

  const handlePingAll = () => {
    setIsPingingAll(true);
    setTimeout(() => {
      onPingAll?.();
      setIsPingingAll(false);
    }, 1500);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Vault Analytics & Core Stats */}
      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 glass p-10 rounded-[3.5rem] border border-white/10 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
            <ShieldCheck className="w-64 h-64 text-indigo-400" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
               <span className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest">Protocol Core</span>
               {needsPingCount > 0 && (
                 <span className="px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 text-yellow-500 rounded-full text-[10px] font-black uppercase tracking-widest animate-pulse">Ping Required</span>
               )}
            </div>
            <h2 className="text-4xl font-bold font-display text-white mb-2 leading-tight">Nerve Center</h2>
            <p className="text-gray-400 max-w-md text-sm leading-relaxed">Your digital legacy is synchronized across {capsules.length} nodes on the Sui blockchain.</p>
          </div>
          <div className="flex flex-col gap-3 relative z-10 w-full md:w-auto">
            <button 
              onClick={handlePingAll}
              disabled={isPingingAll || capsules.length === 0}
              className="bg-white text-black px-8 py-4 rounded-2xl font-bold hover:bg-gray-200 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl"
            >
              {isPingingAll ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : <Zap className="w-4 h-4" />}
              Batch Ping Protocol
            </button>
            <button 
              onClick={onCreateClick} 
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-500 transition-all text-xs uppercase tracking-widest flex items-center justify-center gap-2 glow"
            >
              <Plus className="w-4 h-4" />
              Create Capsule
            </button>
          </div>
        </div>
        
        <div className="glass p-10 rounded-[3.5rem] border border-indigo-500/20 bg-indigo-500/5 relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="text-indigo-400 w-5 h-5" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Trust Index</span>
          </div>
          <div className="text-5xl font-bold font-display text-white mb-2">98.2<span className="text-xl text-green-400 ml-1">+0.4</span></div>
          <p className="text-xs text-gray-500 uppercase font-black tracking-widest leading-relaxed">Top 2% Reputation Score among Sui Guardians.</p>
          <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center">
             <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-500" />
                <span className="text-white font-bold text-sm">Gold Pioneer</span>
             </div>
             <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">Soulbound Rank</span>
          </div>
        </div>
      </div>

      {/* Grouping & Filtering */}
      <div className="flex flex-wrap items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-2 p-1.5 glass rounded-full border border-white/10 overflow-x-auto scrollbar-hide max-w-full">
          <FilterButton active={filter === 'ALL'} label="All Capsules" onClick={() => setFilter('ALL')} />
          <FilterButton active={filter === 'CRYPTO'} label="Crypto Assets" onClick={() => setFilter('CRYPTO')} />
          <FilterButton active={filter === 'LEGAL'} label="Legal Docs" onClick={() => setFilter('LEGAL')} />
          <FilterButton active={filter === 'PERSONAL'} label="Family Legacy" onClick={() => setFilter('PERSONAL')} />
          <FilterButton active={filter === 'BUSINESS'} label="Enterprise" onClick={() => setFilter('BUSINESS')} />
        </div>
        <div className="flex items-center gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" /> 
            <span>Sealed: {capsules.filter(c => c.isActivated).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
            <span>Draft: {capsules.filter(c => !c.isActivated).length}</span>
          </div>
        </div>
      </div>

      {/* Capsule Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCapsules.map(capsule => (
            <CapsuleCard key={capsule.id} capsule={capsule} onClick={() => onViewCapsule(capsule.id)} />
          ))}
        </AnimatePresence>
        
        {filteredCapsules.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="col-span-full py-32 text-center glass rounded-[3.5rem] border-dashed border-2 border-white/10"
          >
            <Layers className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-40" />
            <h4 className="text-2xl font-bold text-white mb-3 font-display">No capsules in {filter}</h4>
            <p className="text-gray-500 text-sm max-w-xs mx-auto mb-8 leading-relaxed">Your vault sector is waiting for its first secure anchor.</p>
            <button 
              onClick={onCreateClick}
              className="px-8 py-3 bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 rounded-xl font-bold hover:bg-indigo-600/20 transition-all text-xs uppercase tracking-widest"
            >
              Secure Asset Now
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const FilterButton: React.FC<{ active: boolean; label: string; onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
      active 
        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
        : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const CapsuleCard: React.FC<{ capsule: Capsule; onClick: () => void }> = ({ capsule, onClick }) => {
  const nextPing = capsule.lastPing + (capsule.pingFrequencyDays * 24 * 60 * 60 * 1000);
  const isUrgent = Date.now() > nextPing - (3 * 24 * 60 * 60 * 1000);

  return (
    <motion.div 
      layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -10, transition: { duration: 0.2 } }}
      className="group p-8 rounded-[3.5rem] glass border border-white/10 hover:border-indigo-500/50 transition-all cursor-pointer relative overflow-hidden flex flex-col min-h-[340px]"
      onClick={onClick}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 blur-[80px] pointer-events-none" />
      
      <div className="flex justify-between items-start mb-8 relative z-10">
        <div className="flex flex-col gap-2">
           <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 group-hover:bg-indigo-600 group-hover:text-white transition-all w-fit shadow-inner">
              <ShieldCheck className="w-6 h-6 text-indigo-400 group-hover:text-white" />
           </div>
           <span className="text-[8px] font-black uppercase tracking-[0.2em] text-gray-500 px-2.5 py-1 bg-white/5 rounded border border-white/5 w-fit">
              {capsule.category}
           </span>
        </div>
        <div className="flex flex-col items-end">
          <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest mb-2 border ${
            capsule.isActivated 
              ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' 
              : 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
          }`}>
            {capsule.isActivated ? 'Sealed Protocol' : 'Mutable Draft'}
          </span>
          <span className={`text-[8px] font-black uppercase tracking-widest ${isUrgent ? 'text-yellow-500 animate-pulse' : 'text-gray-600'}`}>
            {isUrgent ? 'Grace Period' : 'Healthy Connection'}
          </span>
        </div>
      </div>
      
      <h4 className="text-2xl font-bold mb-3 group-hover:text-indigo-400 transition-colors font-display text-white leading-tight">{capsule.title}</h4>
      <p className="text-sm text-gray-500 line-clamp-2 mb-8 leading-relaxed flex-grow font-medium">{capsule.description}</p>
      
      <div className="space-y-4 pt-6 border-t border-white/5 relative z-10">
        <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
           <span className="text-gray-600">Heirs: {capsule.beneficiaries.length}</span>
           <span className={isUrgent ? 'text-yellow-500 font-bold' : 'text-indigo-400'}>
             {isUrgent ? 'Manual Ping Required' : `${Math.ceil((nextPing - Date.now()) / (1000 * 60 * 60 * 24))} Days Remaining`}
           </span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${capsule.healthScore}%` }}
            className={`h-full transition-all duration-1000 ${isUrgent ? 'bg-yellow-500 shadow-[0_0_12px_rgba(234,179,8,0.4)]' : 'bg-indigo-600 shadow-[0_0_12px_rgba(99,102,241,0.4)]'}`}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
