
import React, { useState } from 'react';
import { Key, Unlock, Download, ShieldCheck, ArrowRight, UserCircle, Users, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UnlockPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [decryptedData, setDecryptedData] = useState<string | null>(null);

  const handleUnlock = () => {
    setLoading(true);
    setTimeout(() => {
      setStep(2);
      setLoading(false);
    }, 2500);
  };

  const handleDecrypt = () => {
    setLoading(true);
    setTimeout(() => {
      setDecryptedData("CONFIDENTIAL: The master key for the legacy trust is 0x1942-SUI-LEGACY. All documents are stored in the Swiss safety deposit box #882.");
      setStep(4);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto flex items-center justify-center min-h-[80vh]">
      <div className="w-full">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="st1" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass p-12 rounded-[3rem] border border-white/10 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-[0.02] pointer-events-none">
                <Key className="w-64 h-64 text-indigo-400 rotate-12" />
              </div>
              
              <div className="w-24 h-24 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-500/20 shadow-inner">
                <Unlock className="w-10 h-10 text-indigo-400" />
              </div>
              
              <h1 className="text-4xl font-bold font-display mb-4 text-white">Legacy Unlock</h1>
              <p className="text-gray-400 mb-12 text-lg">Claim a digital legacy left for you on Kairos. Use your social identity to verify your inheritance.</p>
              
              <button 
                onClick={handleUnlock}
                disabled={loading}
                className="w-full flex items-center justify-center gap-3 bg-white text-black py-5 rounded-[1.5rem] font-bold text-xl hover:bg-gray-100 transition-all shadow-xl group uppercase tracking-widest text-sm"
              >
                {loading ? <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin" /> : (
                  <>
                    Sign in with Google
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
              
              <p className="mt-10 text-[10px] text-gray-600 uppercase font-black tracking-[0.3em]">No wallet required • Sui zkLogin</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="st2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass p-12 rounded-[3rem] border border-indigo-500/30 text-center shadow-2xl">
              <div className="w-24 h-24 bg-indigo-600/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-indigo-500/20">
                <Users className="w-10 h-10 text-indigo-400" />
              </div>
              <h2 className="text-3xl font-bold font-display mb-4 text-white">Threshold Found</h2>
              <p className="text-gray-400 mb-12">This legacy requires approval from 2 of 3 heirs. Your approval is needed to advance the stages.</p>
              
              <div className="space-y-4 mb-12">
                 <ApproverRow name="You (Verified)" approved />
                 <ApproverRow name="Elena K." approved />
                 <ApproverRow name="Marcus V." />
              </div>
              
              <button 
                onClick={() => setStep(3)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[1.5rem] font-bold text-white transition-all glow uppercase tracking-widest text-sm"
              >
                Approve & Continue
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="st3" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="glass p-12 rounded-[3rem] border border-indigo-500/30 text-center shadow-2xl">
              <div className="w-24 h-24 bg-green-500/10 rounded-[2rem] flex items-center justify-center mx-auto mb-8 border border-green-500/20">
                <ShieldCheck className="w-10 h-10 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold font-display mb-4 text-white">Identity Authorized</h2>
              <p className="text-gray-400 mb-8 leading-relaxed">Threshold reached. 2/3 heirs approved. Enter the master password to begin client-side decryption.</p>
              
              <input 
                type="password" placeholder="Master Password" 
                className="w-full bg-white/5 border border-white/10 rounded-[1.5rem] px-6 py-5 outline-none focus:border-indigo-500 mb-8 text-center text-2xl tracking-[0.5em] text-white"
              />
              
              <button 
                onClick={handleDecrypt}
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 py-5 rounded-[1.5rem] font-bold text-white transition-all glow uppercase tracking-widest text-sm"
              >
                {loading ? "Decrypting..." : "Decrypt Capsule"}
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="st4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass p-12 rounded-[3rem] border border-white/10 shadow-2xl">
               <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-indigo-600/10 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <Download className="w-7 h-7 text-indigo-400" />
                  </div>
                  <h2 className="text-3xl font-bold font-display text-white">Inherited Legacy</h2>
               </div>
               
               <div className="bg-black/40 border border-white/5 rounded-[2rem] p-10 mb-10">
                  <p className="text-xl leading-relaxed text-gray-200 italic">"{decryptedData}"</p>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-white/10 py-5 rounded-[1.5rem] font-bold transition-all text-white uppercase tracking-widest text-xs">
                    Export Files
                  </button>
                  <button 
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-2 bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-600/20 py-5 rounded-[1.5rem] font-bold transition-all uppercase tracking-widest text-xs"
                  >
                    Close Vault
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ApproverRow: React.FC<{ name: string, approved?: boolean }> = ({ name, approved }) => (
   <div className={`flex items-center justify-between p-5 rounded-2xl border ${approved ? 'bg-indigo-600/10 border-indigo-500/30' : 'bg-white/5 border-white/5'}`}>
      <span className={`font-bold ${approved ? 'text-white' : 'text-gray-500'}`}>{name}</span>
      {approved ? <CheckCircle className="text-indigo-400 w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-white/10" />}
   </div>
);

export default UnlockPage;
