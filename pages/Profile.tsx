
import React from 'react';
import { Award, Shield, Activity, Clock, LogOut, CheckCircle, Star } from 'lucide-react';
import { UserProfile, Capsule } from '../types.ts';
import { motion } from 'framer-motion';

interface ProfileProps {
  user: UserProfile;
  capsules: Capsule[];
}

const Profile: React.FC<ProfileProps> = ({ user, capsules }) => {
  return (
    <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-10 rounded-[2.5rem] border border-white/10 text-center relative overflow-hidden">
             <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-indigo-600/20 to-transparent" />
             <div className="relative">
                <img src={user.avatar} className="w-32 h-32 rounded-full mx-auto border-4 border-[#030712] shadow-2xl mb-6" alt="Profile" />
                <h2 className="text-3xl font-bold font-display text-white">{user.name}</h2>
                <p className="text-gray-400 mb-6">{user.email}</p>
                
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600/20 border border-indigo-500/20 rounded-full text-indigo-400 font-bold text-sm">
                   <Shield className="w-4 h-4" />
                   Verified Guardian
                </div>
             </div>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-white/10">
             <h3 className="text-lg font-bold mb-6 text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-yellow-400" />
                Soulbound Reputation
             </h3>
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <span className="text-gray-400">Current Tier</span>
                   <span className="font-bold text-indigo-400">{user.badge?.tier}</span>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full">
                   <div className="h-full bg-indigo-600 rounded-full" style={{ width: '85%' }} />
                </div>
                <p className="text-xs text-center text-gray-500">250 points until Platinum Tier</p>
                <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl font-bold hover:bg-white/10 transition-all text-white">
                   View SBT Metadata
                </button>
             </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
           <div className="grid sm:grid-cols-2 gap-6">
              <StatsBox icon={<Activity className="text-green-400" />} label="Avg. Trust Score" value={`${user.trustScore}%`} />
              <StatsBox icon={<Clock className="text-blue-400" />} label="Protocol Tenure" value="142 Days" />
              <StatsBox icon={<CheckCircle className="text-purple-400" />} label="Total Capsules" value={capsules.length.toString()} />
              <StatsBox icon={<Star className="text-yellow-400" />} label="Reputation Rank" value="#420" />
           </div>

           <div className="glass p-10 rounded-[2.5rem] border border-white/10">
              <h3 className="text-2xl font-bold mb-8 font-display text-white">Trust Contributions</h3>
              <div className="space-y-6">
                 <LogItem title="On-Chain Checkpoint" desc="Life check performed successfully on Sui Mainnet." date="2 hours ago" />
                 <LogItem title="Reputation Update" desc="Trust score increased by 0.5% after successful seal verification." date="3 days ago" />
                 <LogItem title="New Capsule Sealed" desc="Anchored integrity proof for 'Last Will' to Walrus." date="1 week ago" />
              </div>
           </div>

           <button 
             onClick={() => { localStorage.clear(); window.location.href = '/'; }}
             className="flex items-center justify-center gap-2 w-full py-5 glass border border-red-500/20 text-red-400 rounded-2xl font-bold hover:bg-red-500/10 transition-all"
           >
              <LogOut className="w-5 h-5" />
              Disconnect Identity
           </button>
        </div>
      </div>
    </div>
  );
};

const StatsBox: React.FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="glass p-8 rounded-[2rem] border border-white/10">
    <div className="p-3 bg-white/5 w-fit rounded-xl mb-4">{icon}</div>
    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mb-1">{label}</p>
    <p className="text-3xl font-bold text-white font-display">{value}</p>
  </div>
);

const LogItem: React.FC<{ title: string; desc: string; date: string }> = ({ title, desc, date }) => (
  <div className="flex justify-between items-start gap-4 pb-6 border-b border-white/5 last:border-0 last:pb-0">
    <div>
       <h4 className="font-bold text-white">{title}</h4>
       <p className="text-sm text-gray-400">{desc}</p>
    </div>
    <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest whitespace-nowrap">{date}</span>
  </div>
);

export default Profile;
