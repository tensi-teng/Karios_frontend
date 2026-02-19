
import React from 'react';
import { Shield, Clock, Heart, ArrowRight, Zap, Users, Lock, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

const Landing: React.FC<{ onGetStarted: () => void }> = ({ onGetStarted }) => {
  return (
    <div className="relative">
      <section className="pt-48 pb-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/10 mb-8 text-indigo-400 text-sm font-bold"
          >
            <Zap className="w-4 h-4" />
            <span>The New Standard for Digital Inheritance</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-9xl font-bold font-display leading-none mb-8 tracking-tighter"
          >
            Privacy First,<br />
            <span className="gradient-text">Forever.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-400 max-w-2xl mx-auto mb-16 leading-relaxed"
          >
            Secure your digital legacy with AES-256 client-side encryption. 
            Programmable smart contracts on Sui ensure your loved ones get access exactly when you decide.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button 
              onClick={onGetStarted}
              className="w-full sm:w-auto px-10 py-5 bg-indigo-600 rounded-2xl font-bold text-xl hover:bg-indigo-500 transition-all flex items-center justify-center gap-3 glow shadow-indigo-500/20 shadow-2xl"
            >
              Start Your Vault
              <ArrowRight className="w-6 h-6" />
            </button>
            <button className="w-full sm:w-auto px-10 py-5 glass rounded-2xl font-bold text-xl hover:bg-white/10 transition-all text-white border border-white/10">
              Explore Protocol
            </button>
          </motion.div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
           <ChevronDown className="text-gray-600 w-8 h-8" />
        </div>
      </section>

      {/* Emotional Storytelling Block */}
      <section className="py-32 px-6 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-20 items-center">
             <motion.div
               initial={{ opacity: 0, x: -50 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
             >
                <h2 className="text-4xl md:text-6xl font-bold font-display mb-8 text-white">Because some things are too precious to lose.</h2>
                <p className="text-gray-400 text-lg leading-relaxed mb-8">
                  Your life is more than just data. It's final wishes, family recipes, private keys to your wealth, and the stories you want to tell. Kairos was built to ensure that even in the unexpected, your legacy remains intact and accessible to the people who matter most.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-indigo-400 font-bold">
                    <Heart className="w-5 h-5" />
                    Emotional Continuity
                  </div>
                  <div className="flex items-center gap-3 text-pink-400 font-bold">
                    <Shield className="w-5 h-5" />
                    Unyielding Privacy
                  </div>
                </div>
             </motion.div>
             <div className="relative aspect-square">
                <div className="absolute inset-0 bg-indigo-600/20 blur-[100px] rounded-full animate-pulse" />
                <div className="relative glass rounded-[3rem] h-full w-full border border-white/10 flex items-center justify-center">
                   <Lock className="w-32 h-32 text-indigo-500/50" />
                </div>
             </div>
          </div>
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-6xl font-bold font-display mb-4 text-white">How it Works</h2>
            <p className="text-gray-400">Three layers of security for complete peace of mind.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <StepCard number="01" title="Encrypt" desc="Data is encrypted locally in your browser using AES-256-GCM. We never see your password." />
            <StepCard number="02" title="Anchor" desc="The encrypted blob is stored on Walrus and anchored to the Sui blockchain with a Seal proof." />
            <StepCard number="03" title="Deliver" desc="Smart contracts release access to beneficiaries via zkLogin when your conditions are met." />
          </div>
        </div>
      </section>
    </div>
  );
};

const StepCard: React.FC<{ number: string; title: string; desc: string }> = ({ number, title, desc }) => (
  <div className="p-10 rounded-[2.5rem] glass border border-white/10 relative">
    <span className="text-6xl font-black text-white/5 absolute top-8 right-8">{number}</span>
    <h3 className="text-2xl font-bold mb-4 text-white">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
