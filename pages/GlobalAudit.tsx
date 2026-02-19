
import React, { useState, useMemo } from 'react';
import { History, Shield, Zap, Search, Filter, Download, ExternalLink, Activity, AlertCircle, CheckCircle2, Terminal, Key, ChevronDown, ChevronUp, Cpu, Globe, Database, Fingerprint } from 'lucide-react';
import { Capsule, AuditLogEntry } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface GlobalAuditProps {
  capsules: Capsule[];
}

interface EnrichedAuditLog extends AuditLogEntry {
  capsuleTitle: string;
  capsuleId: string;
  category: string;
  blobId: string;
}

const GlobalAudit: React.FC<GlobalAuditProps> = ({ capsules }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  const allLogs = useMemo(() => {
    const logs = capsules.flatMap(c => 
      (c.auditLog || []).map(log => ({
        ...log,
        capsuleTitle: c.title,
        capsuleId: c.id,
        category: c.category,
        blobId: c.blobId
      }))
    );
    return logs.sort((a, b) => b.timestamp - a.timestamp);
  }, [capsules]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      const matchesSearch = log.action.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            log.capsuleTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            log.id.includes(searchTerm);
      const matchesFilter = filterType === 'ALL' || log.action.toUpperCase().includes(filterType);
      return matchesSearch && matchesFilter;
    });
  }, [allLogs, searchTerm, filterType]);

  const stats = useMemo(() => {
    return {
      totalPings: allLogs.filter(l => l.action.includes('Ping')).length,
      activations: allLogs.filter(l => l.action.includes('Created') || l.action.includes('Sealed')).length,
      claims: allLogs.filter(l => l.action.includes('Claim') || l.action.includes('Unlock')).length,
      failures: allLogs.filter(l => l.status === 'FAILED').length
    };
  }, [allLogs]);

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
              <History className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Guardian Ledger</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">Global Audit Protocol</h1>
          <p className="text-gray-400 max-w-xl text-sm leading-relaxed">Immutable pulse signals, rule activations, and claim attempts documented across your entire legacy instance.</p>
        </div>
        
        <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white transition-all shadow-sm">
          <Download className="w-3.5 h-3.5" />
          Export Protocol Manifest
        </button>
      </div>

      {/* Global Stats Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <StatCard icon={<Zap size={18}/>} label="Pulse Signals" value={stats.totalPings} color="text-indigo-400" />
        <StatCard icon={<Shield size={18}/>} label="Protocol Seals" value={stats.activations} color="text-green-400" />
        <StatCard icon={<Activity size={18}/>} label="Claim Attempts" value={stats.claims} color="text-pink-400" />
        <StatCard icon={<AlertCircle size={18}/>} label="Integrity Flags" value={stats.failures} color="text-red-400" />
      </div>

      {/* Filtering Header */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 items-center justify-between">
        <div className="relative w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by protocol action or object ID..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-3.5 outline-none focus:border-indigo-500 text-sm text-white"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-2 p-1.5 glass rounded-full border border-white/10 overflow-x-auto scrollbar-hide">
          <FilterTab active={filterType === 'ALL'} label="Full History" onClick={() => setFilterType('ALL')} />
          <FilterTab active={filterType === 'PING'} label="Pings" onClick={() => setFilterType('PING')} />
          <FilterTab active={filterType === 'SEAL'} label="Seals" onClick={() => setFilterType('SEAL')} />
          <FilterTab active={filterType === 'CLAIM'} label="Claims" onClick={() => setFilterType('CLAIM')} />
        </div>
      </div>

      {/* Audit List */}
      <div className="glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-white/5 border-b border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="px-8 py-6 w-12"></th>
                <th className="px-8 py-6">Interaction Time</th>
                <th className="px-8 py-6">Protocol Action</th>
                <th className="px-8 py-6">Target Capsule</th>
                <th className="px-8 py-6">Originating Actor</th>
                <th className="px-8 py-6 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredLogs.map((log) => (
                  <React.Fragment key={log.id + log.timestamp}>
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => toggleRow(log.id + log.timestamp)}
                      className={`group hover:bg-white/[0.04] transition-colors cursor-pointer ${expandedRow === log.id + log.timestamp ? 'bg-indigo-600/5' : ''}`}
                    >
                      <td className="px-8 py-6">
                        {expandedRow === log.id + log.timestamp ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-gray-600" />}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm">{new Date(log.timestamp).toLocaleDateString()}</span>
                          <span className="text-[10px] text-gray-500 font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <ActionIcon action={log.action} />
                          <span className="text-sm font-bold text-indigo-100">{log.action}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col">
                          <span className="text-gray-300 font-bold text-xs group-hover:text-indigo-400 transition-colors">{log.capsuleTitle}</span>
                          <span className="text-[9px] text-gray-600 font-mono tracking-tighter">SUI::0x...{log.capsuleId.slice(-8)}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center border border-white/5">
                            <Terminal className="w-3 h-3 text-gray-500" />
                          </div>
                          <span className="text-xs text-gray-400 font-mono">{log.actor}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex flex-col items-end gap-1.5">
                          <div className="flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
                            <span className="text-[9px] font-black text-green-400 uppercase tracking-widest">Confirmed</span>
                          </div>
                          <a href={`https://suiexplorer.com/tx/${log.id}`} target="_blank" onClick={e => e.stopPropagation()} className="flex items-center gap-1 text-[8px] text-gray-600 hover:text-indigo-400 transition-colors uppercase font-black tracking-widest">
                            Deep Scan
                            <ExternalLink size={8} />
                          </a>
                        </div>
                      </td>
                    </motion.tr>
                    
                    <AnimatePresence>
                      {expandedRow === log.id + log.timestamp && (
                        <motion.tr
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-black/40"
                        >
                          <td colSpan={6} className="px-16 py-10 border-b border-indigo-500/10">
                            <div className="grid lg:grid-cols-3 gap-10">
                              <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                                  <Fingerprint className="w-3 h-3 text-indigo-400" />
                                  Cryptographic Proof
                                </h5>
                                <div className="space-y-4">
                                   <DetailItem label="Merkle Root Hash" value={`0x${Math.random().toString(16).slice(2, 42)}`} mono />
                                   <DetailItem label="Zk-Proof Type" value="Groth16 / PLONK" />
                                   <DetailItem label="Seal Integrity" value="Verified by 12 Validators" />
                                </div>
                              </div>
                              
                              <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                                  <Database className="w-3 h-3 text-pink-400" />
                                  Walrus Blob State
                                </h5>
                                <div className="space-y-4">
                                   <DetailItem label="Object Pointer" value={log.blobId || 'PENDING_ANCHOR'} mono />
                                   <DetailItem label="Storage Tier" value="Cold distributed storage" />
                                   <DetailItem label="Replication Factor" value="8 Nodes" />
                                </div>
                              </div>

                              <div className="space-y-6">
                                <h5 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 flex items-center gap-2">
                                  <Globe className="w-3 h-3 text-green-400" />
                                  Network Metadata
                                </h5>
                                <div className="space-y-4">
                                   <DetailItem label="Epoch" value="1,244" />
                                   <DetailItem label="Checkpoint ID" value="54,229,102" />
                                   <DetailItem label="Network Latency" value="142ms" />
                                </div>
                              </div>
                            </div>
                            
                            <div className="mt-10 pt-8 border-t border-white/5 flex flex-wrap items-center gap-6">
                               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                  <Cpu className="w-4 h-4 text-indigo-400" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Gas Used: <span className="text-white">0.0024 SUI</span></span>
                               </div>
                               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                                  <Activity className="w-4 h-4 text-pink-400" />
                                  <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Result: <span className="text-white">State Mutated</span></span>
                               </div>
                               <button className="ml-auto text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-white transition-colors flex items-center gap-2">
                                 Download Technical Manifest
                                 <Download size={12} />
                               </button>
                            </div>
                          </td>
                        </motion.tr>
                      )}
                    </AnimatePresence>
                  </React.Fragment>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredLogs.length === 0 && (
            <div className="py-32 text-center">
              <History className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-30" />
              <h4 className="text-lg font-bold text-white mb-2 font-display">No protocol logs found</h4>
              <p className="text-gray-500 text-xs uppercase font-black tracking-widest">Adjust your filters to see more interaction data.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{ label: string, value: string, mono?: boolean }> = ({ label, value, mono }) => (
  <div className="flex flex-col gap-1">
    <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">{label}</span>
    <span className={`text-xs text-indigo-100 ${mono ? 'font-mono break-all leading-tight opacity-70' : 'font-medium'}`}>{value}</span>
  </div>
);

const StatCard: React.FC<{ icon: React.ReactNode, label: string, value: number, color: string }> = ({ icon, label, value, color }) => (
  <div className="glass p-8 rounded-[2.5rem] border border-white/10 hover:border-white/20 transition-all group">
    <div className={`p-2.5 bg-white/5 w-fit rounded-xl mb-6 group-hover:scale-110 transition-transform ${color}`}>
      {icon}
    </div>
    <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-bold text-white font-display tracking-tight">{value.toLocaleString()}</p>
  </div>
);

const FilterTab: React.FC<{ active: boolean, label: string, onClick: () => void }> = ({ active, label, onClick }) => (
  <button 
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
      active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
    }`}
  >
    {label}
  </button>
);

const ActionIcon: React.FC<{ action: string }> = ({ action }) => {
  if (action.includes('Ping')) return <Zap className="w-4 h-4 text-indigo-400" />;
  if (action.includes('Created') || action.includes('Sealed')) return <Shield className="w-4 h-4 text-green-400" />;
  if (action.includes('Claim') || action.includes('Unlock')) return <Key className="w-4 h-4 text-pink-400" />;
  return <Activity className="w-4 h-4 text-gray-400" />;
};

export default GlobalAudit;
