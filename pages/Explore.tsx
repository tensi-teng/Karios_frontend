
import React from 'react';
import { Award, Shield, Users, Search, TrendingUp, Filter } from 'lucide-react';

const Explore: React.FC = () => {
  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold font-display mb-6">Kairos Registry</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Discover the ecosystem of trust on Sui. Verified Soulbound Reputation.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-6">
           <div className="glass p-6 rounded-3xl border border-white/10">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h4>
              <div className="space-y-3">
                 <button className="w-full text-left px-4 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-sm font-bold border border-indigo-500/20">All Badges</button>
                 <button className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-all text-gray-400">Legacy Pioneers</button>
                 <button className="w-full text-left px-4 py-2 hover:bg-white/5 rounded-lg text-sm font-medium transition-all text-gray-400">Golden Guardians</button>
              </div>
           </div>

           <div className="glass p-6 rounded-3xl border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-5 h-5 text-green-400" />
                <span className="font-bold text-sm">Network Growth</span>
              </div>
              <p className="text-3xl font-bold font-display">+1,240%</p>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Past 30 Days</p>
           </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="relative mb-8">
            <input 
              type="text" 
              placeholder="Search by wallet address or SBT ID..." 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-12 py-4 outline-none focus:border-indigo-500 transition-all text-lg"
            />
            <Search className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          </div>

          <div className="glass rounded-[2rem] border border-white/10 overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="bg-white/5 text-[11px] uppercase tracking-widest text-gray-400 border-b border-white/10">
                      <th className="px-8 py-6">Guardian</th>
                      <th className="px-8 py-6">SBT Badge</th>
                      <th className="px-8 py-6 text-center">Trust Score</th>
                      <th className="px-8 py-6 text-right">Status</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                   <LeaderboardRow name="Alex Rivera" address="0x742d...f44e" tier="Gold" icon="🏆" score="98.2" status="Active" />
                   <LeaderboardRow name="Elena K." address="0x11a3...3292" tier="Silver" icon="🛡️" score="95.5" status="Sealing" />
                   <LeaderboardRow name="Marcus V." address="0x992b...902a" tier="Platinum" icon="💎" score="99.9" status="Elite" />
                   <LeaderboardRow name="Sarah J." address="0xee32...c011" tier="Bronze" icon="🔨" score="82.1" status="Active" />
                   <LeaderboardRow name="Dev Team" address="0x0000...0000" tier="Founder" icon="👑" score="100.0" status="Root" />
                </tbody>
             </table>
          </div>
        </div>
      </div>
    </div>
  );
};

const LeaderboardRow: React.FC<{ name: string; address: string; tier: string; icon: string; score: string; status: string }> = ({ name, address, tier, icon, score, status }) => (
  <tr className="group hover:bg-white/[0.02] transition-colors cursor-pointer">
     <td className="px-8 py-6">
        <div className="flex items-center gap-3">
           <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 border border-indigo-500/20">
              {name.charAt(0)}
           </div>
           <div>
              <p className="font-bold group-hover:text-indigo-400 transition-colors">{name}</p>
              <p className="text-[10px] text-gray-500 font-mono tracking-tighter">{address}</p>
           </div>
        </div>
     </td>
     <td className="px-8 py-6">
        <div className="flex items-center gap-2">
           <span className="text-xl">{icon}</span>
           <span className="text-sm font-bold">{tier} Guardian</span>
        </div>
     </td>
     <td className="px-8 py-6 text-center">
        <span className="text-lg font-bold font-display text-green-400">{score}</span>
     </td>
     <td className="px-8 py-6 text-right">
        <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1 bg-white/5 rounded-full text-gray-400">
           {status}
        </span>
     </td>
  </tr>
);

export default Explore;
