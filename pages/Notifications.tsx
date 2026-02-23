import React, { useState } from 'react';
import { Bell, Trash2, Clock, CheckCircle2, Shield, Zap, AlertTriangle } from 'lucide-react';
import { Capsule } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationsProps {
    capsules: Capsule[];
}

const Notifications: React.FC<NotificationsProps> = ({ capsules }) => {
    const [notifications, setNotifications] = useState(() => {
        return capsules.flatMap(c =>
            (c.auditLog || []).map(log => ({
                id: log.id + Math.random(),
                date: new Date(log.timestamp).toLocaleDateString(),
                title: c.title,
                message: log.action,
                type: log.status === 'SUCCESS' ? 'INFO' : 'ALERT'
            }))
        ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    });

    const clearAll = () => setNotifications([]);

    return (
        <div className="pt-28 pb-20 px-6 max-w-3xl mx-auto">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h1 className="text-4xl font-bold font-display text-white mb-2">Notifications</h1>
                    <p className="text-gray-400 text-sm font-medium">Monitor all protocol interactions across your vault.</p>
                </div>
                <button
                    onClick={clearAll}
                    className="flex items-center gap-2 px-5 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-[10px] font-black uppercase tracking-widest text-red-400 hover:bg-red-500/20 transition-all"
                >
                    <Trash2 size={14} />
                    Clear All
                </button>
            </div>

            <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                    {notifications.map((notif) => (
                        <motion.div
                            key={notif.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass p-6 rounded-3xl border border-white/10 flex gap-5 items-start relative overflow-hidden group"
                        >
                            <div className={`p-3 rounded-2xl ${notif.type === 'ALERT' ? 'bg-red-500/10 text-red-500' : 'bg-indigo-500/10 text-indigo-400'}`}>
                                {notif.type === 'ALERT' ? <AlertTriangle size={20} /> : <Zap size={20} />}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{notif.title}</h4>
                                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{notif.date}</span>
                                </div>
                                <p className="text-sm text-gray-400 font-medium leading-relaxed">{notif.message}</p>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {notifications.length === 0 && (
                    <div className="py-32 text-center glass rounded-[3rem] border-dashed border-2 border-white/10">
                        <Bell className="w-16 h-16 text-gray-800 mx-auto mb-6 opacity-30" />
                        <h4 className="text-xl font-bold text-white mb-2 font-display">Tides are Calm</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-black tracking-widest">No recent alerts or protocol activities found.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Notifications;
