import React, { useState } from 'react';
import { Award, Shield, Users, Search, TrendingUp, Filter, FileText, Database, Key, LayoutGrid, Eye, ExternalLink } from 'lucide-react';
import { Capsule } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface ExploreProps {
   capsules: Capsule[];
}

const Explore: React.FC<ExploreProps> = ({ capsules }) => {
   const [activeTab, setActiveTab] = useState('EXISTENCE');
   const [searchTerm, setSearchTerm] = useState('');

   const filteredCapsules = capsules.filter(c =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.blobId?.toLowerCase().includes(searchTerm.toLowerCase())
   );

   return (
      <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
         <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
            <div>
               <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-indigo-600/10 rounded-xl border border-indigo-500/20">
                     <Database className="w-6 h-6 text-indigo-400" />
                  </div>
                  <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Institutional Layer</span>
               </div>
               <h1 className="text-4xl md:text-5xl font-bold font-display text-white mb-2">Kairos Global Registry</h1>
               <p className="text-gray-400 max-w-xl text-sm leading-relaxed">The authoritative ledger of all cryptographic capsules and secure anchors on the Sui blockchain.</p>
            </div>

            <div className="flex items-center gap-2 p-1.5 glass rounded-full border border-white/10 overflow-x-auto scrollbar-hide">
               <RegistryTab active={activeTab === 'EXISTENCE'} label="Proof of Existence" onClick={() => setActiveTab('EXISTENCE')} icon={<Shield size={12} />} />
               <RegistryTab active={activeTab === 'CLAIMS'} label="Claims" onClick={() => setActiveTab('CLAIMS')} icon={<Key size={12} />} />
               <RegistryTab active={activeTab === 'FILES'} label="Files" onClick={() => setActiveTab('FILES')} icon={<FileText size={12} />} />
               <RegistryTab active={activeTab === 'SBTS'} label="SBTs" onClick={() => setActiveTab('SBTS')} icon={<Award size={12} />} />
            </div>
         </div>

         <div className="space-y-8">
            <div className="relative max-w-2xl">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
               <input
                  type="text"
                  placeholder="Search registry by Title, Object ID or Category..."
                  className="w-full bg-white/5 border border-white/10 rounded-[2rem] pl-14 pr-6 py-5 outline-none focus:border-indigo-500 transition-all text-white font-medium shadow-2xl"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>

            <div className="glass rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl bg-white/[0.01]">
               {activeTab === 'EXISTENCE' && (
                  <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead>
                           <tr className="bg-white/5 text-[10px] uppercase tracking-[0.2em] text-gray-500 font-black border-b border-white/10">
                              <th className="px-8 py-7">Object (Blob ID)</th>
                              <th className="px-8 py-7">Capsule Title</th>
                              <th className="px-8 py-7">Sector</th>
                              <th className="px-8 py-7">Anchor Date</th>
                              <th className="px-8 py-7 text-right">Verification</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                           <AnimatePresence mode="popLayout">
                              {filteredCapsules.map((capsule) => (
                                 <motion.tr
                                    key={capsule.id}
                                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                    className="group hover:bg-white/[0.03] transition-colors cursor-pointer"
                                 >
                                    <td className="px-8 py-6">
                                       <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                                             <Database className="w-4 h-4 text-indigo-400" />
                                          </div>
                                          <span className="text-xs font-mono text-gray-400 group-hover:text-indigo-300 transition-colors">walrus::0x...{capsule.blobId?.slice(-12) || 'ANCHORING'}</span>
                                       </div>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className="text-sm font-bold text-white">{capsule.title}</span>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400/80 px-3 py-1 bg-indigo-500/5 rounded-full border border-indigo-500/10">
                                          {capsule.category}
                                       </span>
                                    </td>
                                    <td className="px-8 py-6">
                                       <span className="text-xs font-medium text-gray-500">{new Date(capsule.createdAt).toLocaleDateString()}</span>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                       <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-white hover:bg-white/10 transition-all hover:border-indigo-500/50">
                                          <Eye size={14} />
                                          Observe State
                                       </button>
                                    </td>
                                 </motion.tr>
                              ))}
                           </AnimatePresence>
                        </tbody>
                     </table>
                     {filteredCapsules.length === 0 && (
                        <div className="py-32 text-center">
                           <LayoutGrid className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-30" />
                           <h4 className="text-xl font-bold text-white mb-2 font-display">Sector Empty</h4>
                           <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">No capsules matching your query were found in the registry.</p>
                        </div>
                     )}
                  </div>
               )}

               {(activeTab === 'CLAIMS' || activeTab === 'FILES' || activeTab === 'SBTS') && (
                  <div className="py-40 text-center">
                     <div className="w-20 h-20 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                        <Shield className="w-10 h-10 text-indigo-400 animate-pulse" />
                     </div>
                     <h4 className="text-2xl font-bold text-white mb-3 font-display">{activeTab} Protocol Initializing</h4>
                     <p className="text-gray-500 text-xs uppercase font-black tracking-widest max-w-xs mx-auto leading-relaxed">This sector of the registry is being synchronized with the Sui Mainnet. Full functionality arriving as part of the v2.0 update.</p>
                  </div>
               )}
            </div>
         </div>
      </div>
   );
};

const RegistryTab: React.FC<{ active: boolean, label: string, onClick: () => void, icon: React.ReactNode }> = ({ active, label, onClick, icon }) => (
   <button
      onClick={onClick}
      className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${active ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-500 hover:text-white hover:bg-white/5'
         }`}
   >
      {icon}
      {label}
   </button>
);

export default Explore;
