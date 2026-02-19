
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Clock, Shield, Bell, Heart, User, ChevronRight, Lock, Unlock, CheckCircle, Database, Activity, AlertTriangle, Users, Settings, History, Info, Edit3, Save, Zap, ExternalLink } from 'lucide-react';
import { Capsule, CapsuleState, UnlockRuleType } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface CapsuleDetailProps {
  capsule: Capsule;
  onBack: () => void;
  onPing: () => void;
}

const CapsuleDetail: React.FC<CapsuleDetailProps> = ({ capsule, onBack, onPing }) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [activeTab, setActiveTab] = useState<'rules' | 'heirs' | 'audit' | 'integrity'>('rules');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const target = (capsule.lastPing || capsule.createdAt) + (capsule.pingFrequencyDays * 24 * 60 * 60 * 1000);
      const diff = target - Date.now();
      if (diff <= 0) {
        setTimeLeft("Grace Period Active");
      } else {
        const d = Math.floor(diff / (1000 * 60 * 60 * 24));
        const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        setTimeLeft(`${d}d ${h}h ${m}m`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [capsule]);

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      {/* Detail Header / Nav */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
        <motion.button 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          onClick={onBack} 
          className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors group font-bold uppercase tracking-widest text-[10px]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Nerve Center
        </motion.button>
        
        <div className="flex gap-3 w-full md:w-auto">
          {!capsule.isActivated ? (
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-white transition-all"
            >
              {isEditing ? <Save className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
              {isEditing ? 'Save Draft' : 'Modify Protocol'}
            </button>
          ) : (
            <div className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-400">
              <Lock className="w-3.5 h-3.5" />
              Logic Immutable: Sealed
            </div>
          )}
          <button className="flex-1 md:flex-none p-2.5 glass border border-white/10 rounded-full hover:bg-white/10 transition-all text-gray-400 hover:text-white">
            <Settings size={16} />
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-10">
        {/* Main Pillar */}
        <div className="lg:col-span-8 space-y-10">
          {/* Header Card */}
          <div className="glass p-12 rounded-[3.5rem] border border-white/10 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none group-hover:opacity-[0.06] transition-opacity">
              <Shield className="w-96 h-96 text-indigo-400 rotate-12" />
            </div>
            
            <div className="relative z-10">
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-sm ${
                   capsule.state === CapsuleState.ACTIVE ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                }`}>
                  {capsule.state}
                </span>
                <span className="text-gray-500 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-white/5 rounded-full border border-white/5 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                   OBJECT_ID::{capsule.id.toUpperCase()}
                </span>
              </div>
              
              <h1 className="text-5xl md:text-6xl font-bold font-display mb-6 text-white leading-tight tracking-tight">{capsule.title}</h1>
              <p className="text-gray-400 leading-relaxed mb-12 text-xl max-w-2xl font-medium">{capsule.description}</p>

              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={onPing}
                  className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 px-10 py-5 rounded-[1.8rem] font-bold transition-all glow text-white uppercase tracking-widest text-xs shadow-2xl"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  Proof of Life Ping
                </button>
                <button className="flex items-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 px-8 py-5 rounded-[1.8rem] font-bold transition-all text-white uppercase tracking-widest text-xs">
                  <ExternalLink className="w-5 h-5" />
                  Registry Explorer
                </button>
              </div>
            </div>
          </div>

          {/* Nerve Tabs */}
          <div className="glass rounded-[3.5rem] border border-white/10 overflow-hidden">
             <div className="flex border-b border-white/10 bg-white/5 overflow-x-auto scrollbar-hide">
                <TabButton active={activeTab === 'rules'} label="Rule Engine" onClick={() => setActiveTab('rules')} icon={<Settings size={14}/>} />
                <TabButton active={activeTab === 'heirs'} label="Recipients" onClick={() => setActiveTab('heirs')} icon={<Users size={14}/>} />
                <TabButton active={activeTab === 'audit'} label="Audit Ledger" onClick={() => setActiveTab('audit')} icon={<History size={14}/>} />
                <TabButton active={activeTab === 'integrity'} label="Walrus State" onClick={() => setActiveTab('integrity')} icon={<Database size={14}/>} />
             </div>

             <div className="p-10 min-h-[500px]">
                <AnimatePresence mode="wait">
                   {activeTab === 'rules' && (
                     <motion.div key="rules" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                        <div className="flex items-center justify-between">
                           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Active Triggers</h4>
                           {isEditing && <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-4 py-2 rounded-xl">+ Add Logic Block</button>}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                           {capsule.unlockRules?.map((rule, i) => (
                              <div key={i} className={`p-8 rounded-[2.8rem] border transition-all relative group ${isEditing ? 'border-indigo-500/50 cursor-pointer bg-indigo-500/5 shadow-inner' : 'bg-white/5 border-white/10'}`}>
                                 <div className="flex items-center gap-4 mb-6">
                                    <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/10 shadow-sm">
                                       {rule.type === UnlockRuleType.DEAD_MAN_SWITCH ? <Activity size={20}/> : <Clock size={20}/>}
                                    </div>
                                    <h5 className="font-black text-[10px] text-white uppercase tracking-[0.2em]">{rule.type.replace('_', ' ')}</h5>
                                    <div className="ml-auto w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                 </div>
                                 <p className="text-4xl font-bold text-white mb-2 font-display tracking-tight">{rule.params.days || rule.params.count} {rule.type === UnlockRuleType.THRESHOLD ? 'Approvals' : 'Days'}</p>
                                 <p className="text-xs text-gray-500 leading-relaxed font-medium">{rule.description}</p>
                              </div>
                           ))}
                        </div>
                        
                        {!capsule.isActivated && (
                          <div className="p-8 bg-yellow-500/5 border border-yellow-500/20 rounded-[3rem] flex gap-5">
                            <AlertTriangle className="text-yellow-500 w-6 h-6 flex-shrink-0" />
                            <div className="space-y-2">
                               <p className="text-sm font-bold text-yellow-500 uppercase tracking-widest">Protocol Draft Mode</p>
                               <p className="text-xs text-yellow-500/70 leading-relaxed font-medium">
                                 Current rules are in a mutable state. Once you perform the first "Seal" transaction on Sui, the logic becomes permanent and verifiable by all network participants.
                               </p>
                            </div>
                          </div>
                        )}
                     </motion.div>
                   )}

                   {activeTab === 'heirs' && (
                     <motion.div key="heirs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        <div className="flex items-center justify-between">
                           <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500">Designated Beneficiaries</h4>
                           {isEditing && <button className="text-[10px] font-black uppercase tracking-widest text-indigo-400">+ Add Heirs</button>}
                        </div>
                        {capsule.beneficiaries.map((b, i) => (
                           <div key={i} className="flex items-center justify-between p-8 bg-white/5 rounded-[3rem] border border-white/5 group hover:border-white/10 transition-all shadow-sm">
                              <div className="flex items-center gap-6">
                                 <div className="w-16 h-16 bg-indigo-500/10 rounded-[1.5rem] flex items-center justify-center font-bold text-2xl text-indigo-400 border border-indigo-500/10 shadow-inner">
                                    {b.name.charAt(0)}
                                 </div>
                                 <div>
                                    <p className="font-bold text-white text-lg">{b.name}</p>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black mt-1.5">{b.role} • {b.email}</p>
                                 </div>
                              </div>
                              <div className="flex items-center gap-3">
                                 <span className="text-[9px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-4 py-1.5 rounded-full border border-indigo-400/20">Authorized zkLogin</span>
                                 {isEditing && <button className="p-2.5 hover:bg-white/5 rounded-xl transition-all text-gray-500 hover:text-red-400"><Edit3 size={16}/></button>}
                              </div>
                           </div>
                        ))}
                     </motion.div>
                   )}

                   {activeTab === 'audit' && (
                     <motion.div key="audit" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                        <h4 className="text-xs font-black uppercase tracking-[0.3em] text-gray-500 mb-8">On-Chain Interaction History</h4>
                        <div className="space-y-12 relative pl-6">
                           <div className="absolute left-8 top-4 bottom-4 w-px bg-white/10" />
                           {capsule.auditLog?.length ? capsule.auditLog.map((log) => (
                              <div key={log.id} className="relative pl-12">
                                 <div className="absolute left-0 w-4 h-4 rounded-full border-2 border-indigo-500 bg-[#030712] z-10 shadow-[0_0_10px_rgba(99,102,241,0.6)]" />
                                 <div className="flex justify-between items-start glass p-7 rounded-[2rem] border border-white/5 shadow-sm">
                                    <div className="space-y-1.5">
                                       <p className="font-bold text-white text-base">{log.action}</p>
                                       <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Actor: {log.actor} • Sui ID: 0x...{log.id.slice(-8)}</p>
                                    </div>
                                    <div className="text-right">
                                       <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">{new Date(log.timestamp).toLocaleString()}</p>
                                       <div className="flex items-center gap-1.5 mt-2 justify-end">
                                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_rgba(34,197,94,0.5)]" />
                                          <span className="text-[8px] font-black text-green-400 uppercase tracking-widest">Anchored</span>
                                       </div>
                                    </div>
                                 </div>
                              </div>
                           )) : (
                             <div className="py-24 text-center">
                                <History className="w-20 h-20 text-gray-800 mx-auto mb-6 opacity-20" />
                                <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">No interactions documented in protocol history.</p>
                             </div>
                           )}
                        </div>
                     </motion.div>
                   )}

                   {activeTab === 'integrity' && (
                     <motion.div key="integrity" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                        <div className="bg-black/40 rounded-[3.5rem] p-12 border border-white/5 space-y-12 relative overflow-hidden shadow-2xl">
                           <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                              <Database size={240} className="text-indigo-400" />
                           </div>
                           <IntegrityRow label="Walrus Distributed ID" value={capsule.blobId} />
                           <IntegrityRow label="Legacy Root Hash" value="0x77ae8899cc66aa00bb11cc0099ff2288" />
                           <IntegrityRow label="Integrity Score" value="99.98% Healthy Nodes" />
                           <IntegrityRow label="Storage Nodes" value="2,452 Distributed Validators" />
                           <IntegrityRow label="Encryption Engine" value="AES-256-GCM (Client-Side)" />
                           <div className="pt-10 border-t border-white/5 flex items-center gap-5">
                              <CheckCircle className="text-green-400 w-7 h-7 shadow-[0_0_15px_rgba(34,197,94,0.3)]" />
                              <span className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Verified Cryptographic Proof Established</span>
                           </div>
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
             </div>
          </div>
        </div>

        {/* Sidebar Pillars */}
        <div className="lg:col-span-4 space-y-10">
           {/* Live Pulse Countdown */}
           <div className="glass p-10 rounded-[3.5rem] border border-indigo-500/30 bg-indigo-500/5 text-center relative overflow-hidden group shadow-2xl">
              <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center justify-center gap-2.5 text-indigo-400 mb-8">
                 <Activity className="w-4 h-4 animate-pulse" />
                 <p className="text-[10px] font-black uppercase tracking-[0.3em]">Guardian Pulse Monitoring</p>
              </div>
              <div className="text-6xl font-bold font-display text-white mb-10 tracking-tighter">{timeLeft}</div>
              <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-10 shadow-inner">
                 <motion.div 
                   initial={{ width: 0 }}
                   animate={{ width: '85%' }}
                   className="h-full bg-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.6)]" 
                 />
              </div>
              <button className="text-[10px] text-gray-400 uppercase font-black tracking-widest px-10 py-5 border border-white/5 rounded-[1.8rem] hover:bg-white/10 hover:text-white transition-all w-full flex items-center justify-center gap-3">
                 <Zap className="w-4 h-4" />
                 Synchronize Pulse
              </button>
           </div>

           {/* Lifecycle Explorer */}
           <div className="glass p-10 rounded-[3.5rem] border border-white/10 shadow-lg">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-12 flex items-center gap-3">
                 <Clock className="w-4 h-4 text-pink-500" />
                 Protocol Lifecycle
              </h4>
              <div className="space-y-12 relative pl-4">
                 <div className="absolute left-6 top-3 bottom-3 w-px bg-white/10" />
                 <TimelineStep completed title="Capsule Sealed" desc="Anchored to Walrus storage layer" date="OCT '24" />
                 <TimelineStep active title="Logic Monitoring" desc="Satisfying inactivity heartbeat" date="PRESENT" />
                 <TimelineStep title="Verification Phase" desc="Heir consensus & condition checks" date="FUTURE" />
                 <TimelineStep title="Asset Dispersal" desc="Shard release & master decryption" date="FINAL" />
              </div>
           </div>

           {/* Recipient Eligibility Widget */}
           <div className="glass p-10 rounded-[3.5rem] border border-white/10 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-10">
                <Users className="w-4 h-4 text-indigo-400" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-gray-400">Recipient Status</span>
              </div>
              <div className="space-y-5">
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Heir Consensus</span>
                    <span className="text-red-400 font-black">PENDING</span>
                 </div>
                 <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-bold uppercase tracking-widest">Time-Lock Status</span>
                    <span className="text-red-400 font-black">LOCKED</span>
                 </div>
                 <div className="pt-6 border-t border-white/5">
                    <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest text-center leading-relaxed font-medium">
                       Inheritance protocols are active. Access is strictly denied until triggers are verified on-chain.
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const TabButton: React.FC<{ active: boolean, label: string, onClick: () => void, icon: React.ReactNode }> = ({ active, label, onClick, icon }) => (
  <button onClick={onClick} className={`flex-1 flex items-center justify-center gap-3 py-7 font-black uppercase tracking-[0.3em] text-[9px] transition-all border-b-2 whitespace-nowrap px-10 ${active ? 'border-indigo-500 text-white bg-indigo-500/5' : 'border-transparent text-gray-500 hover:text-white hover:bg-white/5'}`}>
    {icon}
    {label}
  </button>
);

const TimelineStep: React.FC<{ completed?: boolean, active?: boolean, title: string, desc: string, date: string }> = ({ completed, active, title, desc, date }) => (
  <div className={`relative pl-14 ${!active && !completed ? 'opacity-25' : 'opacity-100'}`}>
     <div className={`absolute left-0 w-4 h-4 rounded-full border-2 z-10 ${completed ? 'bg-indigo-500 border-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.6)]' : active ? 'bg-indigo-500 border-indigo-500 animate-pulse shadow-[0_0_15px_rgba(99,102,241,0.9)]' : 'bg-[#030712] border-white/20'}`} />
     <div>
        <div className="flex justify-between items-center mb-1.5">
           <h5 className="font-bold text-white text-sm tracking-wide">{title}</h5>
           <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">{date}</span>
        </div>
        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1.5 font-medium leading-relaxed">{desc}</p>
     </div>
  </div>
);

const IntegrityRow: React.FC<{ label: string, value: string }> = ({ label, value }) => (
  <div className="flex justify-between items-center gap-8 text-[10px]">
    <span className="text-gray-500 font-black uppercase tracking-[0.25em] whitespace-nowrap">{label}</span>
    <span className="text-white font-mono break-all text-right opacity-80 leading-relaxed tracking-tighter">{value}</span>
  </div>
);

export default CapsuleDetail;
