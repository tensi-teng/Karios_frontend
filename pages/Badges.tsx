import React from 'react';
import { Award, Shield, Star, Zap, Lock, Crown, Rocket } from 'lucide-react';
import { UserProfile } from '../types.ts';
import { motion } from 'framer-motion';

interface BadgesProps {
    user: UserProfile | null;
}

const Badges: React.FC<BadgesProps> = ({ user }) => {
    const mockBadges = [
        { id: '1', name: 'Legacy Pioneer', tier: 'GOLD', icon: <Crown />, desc: 'Early adopter of the Kairos Protocol.', date: 'Jan 2026' },
        { id: '2', name: 'Zk-Guardian', tier: 'SILVER', icon: <Shield />, desc: 'Verified identity via zkLogin.', date: 'Feb 2026' },
        { id: '3', name: 'Stellar Anchor', tier: 'PLATINUM', icon: <Star />, desc: 'Successfully anchored 5+ deep-freeze capsules.', date: 'Mar 2026' },
        { id: '4', name: 'Protocol Velocity', tier: 'BRONZE', icon: <Zap />, desc: 'Maintained 100% pulse signal for 30 days.', date: 'Active' },
    ];

    return (
        <div className="pt-28 pb-20 px-6 max-w-7xl mx-auto">
            <div className="text-center mb-16">
                <div className="p-4 bg-indigo-600/10 rounded-2xl border border-indigo-500/20 w-fit mx-auto mb-6">
                    <Award className="w-10 h-10 text-indigo-400" />
                </div>
                <h1 className="text-4xl md:text-6xl font-bold font-display text-white mb-6 tracking-tight">Soulbound Icons</h1>
                <p className="text-xl text-gray-400 max-w-2xl mx-auto">Your cryptographic achievements, anchored to your identity forever. Non-transferable tokens of trust.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {mockBadges.map((badge, idx) => (
                    <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group glass p-10 rounded-[3.5rem] border border-white/10 hover:border-indigo-500/50 transition-all text-center relative overflow-hidden"
                    >
                        <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity`}>
                            {React.cloneElement(badge.icon as React.ReactElement, { size: 100 })}
                        </div>

                        <div className="relative z-10">
                            <div className="w-20 h-20 mx-auto bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/5 shadow-inner group-hover:scale-110 transition-transform">
                                <div className="text-indigo-400">
                                    {React.cloneElement(badge.icon as React.ReactElement, { size: 32 })}
                                </div>
                            </div>

                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 mb-2 block">{badge.tier} RANK</span>
                            <h3 className="text-2xl font-bold text-white mb-3 font-display">{badge.name}</h3>
                            <p className="text-sm text-gray-400 font-medium mb-6 leading-relaxed">{badge.desc}</p>

                            <div className="pt-6 border-t border-white/5">
                                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{badge.date}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
