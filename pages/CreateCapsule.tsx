
import React, { useState, useEffect } from 'react';
import { Shield, ChevronRight, ChevronLeft, Upload, Lock, CheckCircle, Search, Users, Settings, Plus, Trash2, Clock, Activity, AlertTriangle, Box, Hexagon, Layers } from 'lucide-react';
import { CryptoService } from '../services/cryptoService.ts';
import { CapsuleState, UnlockRuleType, UnlockRule, Beneficiary } from '../types.ts';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateCapsuleProps {
  onComplete: (capsuleData: any) => void;
  onCancel: () => void;
}

const CapsuleAssemblyAnimation = ({ isClosing = false }: { isClosing?: boolean }) => {
  return (
    <div className="relative w-48 h-48 mx-auto mb-10 flex items-center justify-center">
      {/* Background Pulse */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isClosing ? [1, 0.5, 0] : [0.8, 1.2, 1], opacity: isClosing ? [0.1, 0.05, 0] : [0, 0.2, 0.1] }}
        transition={{ duration: 2, repeat: isClosing ? 0 : Infinity }}
        className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl"
      />

      {/* Fragments converging or diverging */}
      <motion.div
        animate={isClosing ? { scale: 0, opacity: 0, rotate: 90 } : { x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
        transition={{ duration: 1 }}
        className="relative flex items-center justify-center w-full h-full"
      >
        <motion.div
          initial={{ x: -60, y: -60, opacity: 0, rotate: -45, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          className="absolute text-indigo-400/40"
        >
          <Hexagon size={48} />
        </motion.div>
        <motion.div
          initial={{ x: 60, y: -40, opacity: 0, rotate: 45, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          className="absolute text-pink-400/40"
        >
          <Layers size={40} />
        </motion.div>
        <motion.div
          initial={{ x: -50, y: 50, opacity: 0, rotate: -90, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          className="absolute text-indigo-600/40"
        >
          <Shield size={44} />
        </motion.div>
        <motion.div
          initial={{ x: 70, y: 60, opacity: 0, rotate: 30, scale: 0.5 }}
          animate={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
          className="absolute text-purple-500/40"
        >
          <Box size={38} />
        </motion.div>
      </motion.div>

      {/* The Unified Core */}
      <motion.div
        initial={{ scale: 0, opacity: 0, rotate: 180 }}
        animate={{
          scale: isClosing ? [1, 1.2, 0] : 1,
          opacity: isClosing ? [1, 1, 0] : 1,
          rotate: isClosing ? -180 : 0
        }}
        transition={{ duration: isClosing ? 1.5 : 0.8, type: "spring", stiffness: 100 }}
        className="relative z-10 w-24 h-24 bg-indigo-600 rounded-[2.2rem] flex items-center justify-center shadow-[0_0_40px_rgba(79,70,229,0.5)] border border-indigo-400/50"
      >
        <motion.div
          animate={isClosing ? { scale: 0 } : { scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: isClosing ? 0 : Infinity, ease: "easeInOut" }}
        >
          <Lock className="w-10 h-10 text-white" />
        </motion.div>
      </motion.div>
    </div>
  );
};

const CreateCapsule: React.FC<CreateCapsuleProps> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showSummaryDetails, setShowSummaryDetails] = useState(false);
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [newBen, setNewBen] = useState<Beneficiary>({ name: '', email: '', role: 'HEIR' });
  const [rules, setRules] = useState<UnlockRule[]>([
    { type: UnlockRuleType.DEAD_MAN_SWITCH, params: { days: 90 }, description: "Unlock after 90 days of inactivity" }
  ]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'PERSONAL' as any,
    secretData: '',
    password: '',
    passphrase: '',
    pingFrequencyDays: 365
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setUploadedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const addBeneficiary = () => {
    if (newBen.name && newBen.email) {
      setBeneficiaries([...beneficiaries, { ...newBen, id: Math.random().toString() }]);
      setNewBen({ name: '', email: '', role: 'HEIR' });
    }
  };

  const addRule = (type: UnlockRuleType) => {
    const newRule: UnlockRule = {
      type,
      params: type === UnlockRuleType.THRESHOLD ? { count: 2 } : { days: 365 },
      description: `New ${type.replace('_', ' ')} logic`
    };
    setRules([...rules, newRule]);
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      await CryptoService.encrypt(formData.secretData, formData.password);
      // Wait for animation
      setTimeout(() => {
        onComplete({
          ...formData,
          id: Math.random().toString(36).substr(2, 9),
          blobId: 'walrus_' + Math.random().toString(36).substr(2, 9),
          sealProof: 'seal_proof_valid',
          state: CapsuleState.ACTIVE,
          createdAt: Date.now(),
          lastPing: Date.now(),
          beneficiaries: beneficiaries.length > 0 ? beneficiaries : [{ name: 'Default Recipient', email: 'recipient@kairos.io' }],
          unlockRules: rules,
          healthScore: 100,
          isActivated: false,
          files: uploadedFiles.map(f => ({ name: f.name, size: f.size, type: f.type })),
          auditLog: [
            { id: '1', timestamp: Date.now(), action: 'Capsule Created', actor: 'Owner', status: 'SUCCESS' }
          ]
        });
        setLoading(false);
      }, 2500);
    } catch (e) {
      console.error(e);
      alert("Encryption failed.");
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-20 px-6 max-w-2xl mx-auto">
      <div className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <button onClick={onCancel} className="text-gray-500 hover:text-white transition-colors text-[10px] font-black uppercase tracking-widest">Cancel</button>
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Step {step} of 4</span>
        </div>
        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
            initial={{ width: 0 }}
            animate={{ width: `${(step / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="glass p-10 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-bold text-white font-display">Anchor a Secret</h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium">add files, photos, videos or documents to your capsules</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Title</label>
                    <input
                      type="text" placeholder="e.g. BTC Seed Phrase"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white text-sm"
                      value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Category</label>
                    <select
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white text-sm appearance-none"
                      value={formData.category} onChange={(e: any) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="PERSONAL">Personal</option>
                      <option value="CRYPTO">Crypto</option>
                      <option value="LEGAL">Legal</option>
                      <option value="BUSINESS">Business</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Description</label>
                  <input
                    type="text" placeholder="Write a description for your capsule..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white text-sm"
                    value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Sensitive Data</label>
                  <p className="text-[8px] text-indigo-400 uppercase tracking-widest font-bold mb-1 ml-1">Paste sensitive data here, add what texts you wish to be be encrypted.</p>
                  <textarea
                    placeholder="Enter your sensitive information here..." rows={4}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-indigo-500 text-white resize-none text-sm font-medium"
                    value={formData.secretData} onChange={e => setFormData({ ...formData, secretData: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <input
                    type="file" multiple className="hidden"
                    ref={fileInputRef} onChange={handleFileChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white/5 border border-dashed border-white/20 rounded-xl text-gray-400 hover:bg-white/10 hover:text-white transition-all shadow-sm group"
                  >
                    <Upload size={18} className="group-hover:-translate-y-0.5 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#94a3b8] group-hover:text-white">Upload Files / Photos</span>
                  </button>

                  <AnimatePresence>
                    {uploadedFiles.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-2 max-h-[140px] overflow-y-auto pr-2 custom-scrollbar"
                      >
                        {uploadedFiles.map((file, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="flex items-center justify-between bg-white/5 px-4 py-3 rounded-xl border border-white/5 group"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-indigo-500/10 rounded-lg">
                                <Box className="w-3 h-3 text-indigo-400" />
                              </div>
                              <div>
                                <p className="text-[11px] font-bold text-gray-200 truncate max-w-[180px]">{file.name}</p>
                                <p className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{(file.size / 1024).toFixed(1)} KB</p>
                              </div>
                            </div>
                            <button onClick={() => removeFile(i)} className="text-gray-600 hover:text-red-400 p-1 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={14} />
                            </button>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-bold text-white font-display">Recipients & Consensus</h2>
              <p className="text-gray-400 text-sm mb-4 leading-relaxed font-medium">beneficiaries can be added using either email or wallet address.</p>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text" placeholder="Full Name / Wallet Address"
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm"
                    value={newBen.name} onChange={e => setNewBen({ ...newBen, name: e.target.value })}
                  />
                  <select
                    className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm"
                    value={newBen.role} onChange={(e: any) => setNewBen({ ...newBen, role: e.target.value })}
                  >
                    <option value="HEIR">Heir (Receives Data)</option>
                    <option value="PROXY_GUARDIAN">Proxy (Verifies Health)</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <input
                    type="email" placeholder="zkLogin Email"
                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white text-sm"
                    value={newBen.email} onChange={e => setNewBen({ ...newBen, email: e.target.value })}
                  />
                  <button onClick={addBeneficiary} className="bg-indigo-600 hover:bg-indigo-500 px-6 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all text-white">Add</button>
                </div>

                <div className="space-y-1.5 pt-4">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">Recipient Unlock Passphrase</label>
                  <input
                    type="password" placeholder="Set a PIN or Password for the beneficiary"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none focus:border-indigo-500 text-white text-sm"
                    value={formData.passphrase} onChange={e => setFormData({ ...formData, passphrase: e.target.value })}
                  />
                </div>

                <div className="space-y-2 max-h-[150px] overflow-y-auto pr-2 custom-scrollbar">
                  {beneficiaries.map((b, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center font-bold text-indigo-400 text-xs">{b.name.charAt(0)}</div>
                        <div>
                          <p className="text-xs font-bold text-white">{b.name}</p>
                          <p className="text-[9px] text-gray-500 uppercase tracking-widest font-black">{b.role}</p>
                        </div>
                      </div>
                      <button onClick={() => setBeneficiaries(beneficiaries.filter(x => x.id !== b.id))} className="text-gray-600 hover:text-red-400 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {beneficiaries.length === 0 && <div className="text-center py-6 text-[10px] text-gray-600 uppercase font-black tracking-widest border border-dashed border-white/5 rounded-xl">No beneficiaries added</div>}
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <h2 className="text-3xl font-bold text-white font-display">Programmable Logic</h2>
              <p className="text-gray-400 text-sm mb-6 leading-relaxed font-medium">Chain conditions to define your custom dead-man switch policy.</p>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {rules.map((rule, idx) => (
                  <div key={idx} className="p-4 bg-white/5 border border-white/10 rounded-2xl relative group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-indigo-500/10 rounded-lg">
                        {rule.type === UnlockRuleType.DEAD_MAN_SWITCH ? <Activity className="w-4 h-4 text-indigo-400" /> : <Clock className="w-4 h-4 text-pink-400" />}
                      </div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">{rule.type.replace('_', ' ')}</p>
                      <button onClick={() => setRules(rules.filter((_, i) => i !== idx))} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-gray-500 hover:text-red-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input
                        type="number" className="bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-xs text-white w-20 font-bold"
                        value={rule.params.days || rule.params.count || 0}
                        onChange={(e) => {
                          const newRules = [...rules];
                          const key = rule.type === UnlockRuleType.THRESHOLD ? 'count' : 'days';
                          newRules[idx].params[key] = parseInt(e.target.value);
                          setRules(newRules);
                        }}
                      />
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        {rule.type === UnlockRuleType.THRESHOLD ? 'Approvals Required' : 'Days of Inactivity'}
                      </span>
                    </div>
                  </div>
                ))}

                <div className="grid grid-cols-2 gap-3 mt-8">
                  <RuleAddButton icon={<Activity />} label="Inactivity Switch" onClick={() => addRule(UnlockRuleType.DEAD_MAN_SWITCH)} />
                  <RuleAddButton icon={<Users />} label="Heir Threshold" onClick={() => addRule(UnlockRuleType.THRESHOLD)} />
                  <RuleAddButton icon={<Clock />} label="Staged Time" onClick={() => addRule(UnlockRuleType.TIME_LOCK)} />
                  <RuleAddButton icon={<Settings />} label="Oracle Feed" onClick={() => alert("Oracles (Legal/Oracle triggers) coming in v2.2")} />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }} className="space-y-6 text-center">
              <CapsuleAssemblyAnimation isClosing={loading} />

              <h2 className="text-4xl font-bold text-white font-display mb-2">Seal Your Legacy</h2>
              <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 font-medium">Verify your configuration one last time. Once sealed, your rules are anchored to the Sui blockchain.</p>

              <div className="text-left bg-black/40 rounded-[2rem] p-8 space-y-5 border border-white/10 relative z-10 transition-all">
                <button
                  onClick={() => setShowSummaryDetails(!showSummaryDetails)}
                  className="w-full flex justify-between items-center border-b border-white/5 pb-4 hover:bg-white/5 transition-all p-2 rounded-xl"
                >
                  <span className="text-gray-500 font-black uppercase tracking-widest text-[9px]">Logic Layers</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">{rules.length} Active Modules</span>
                    <ChevronRight size={14} className={`text-indigo-400 transition-transform ${showSummaryDetails ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {showSummaryDetails && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 space-y-2 overflow-hidden">
                    {rules.map((r, i) => (
                      <p key={i} className="text-[10px] text-gray-400 font-medium">• {r.type.replace('_', ' ')}: {r.params.days || r.params.count} units</p>
                    ))}
                  </motion.div>
                )}

                <button
                  onClick={() => setShowSummaryDetails(!showSummaryDetails)}
                  className="w-full flex justify-between items-center border-b border-white/5 pb-4 hover:bg-white/5 transition-all p-2 rounded-xl"
                >
                  <span className="text-gray-500 font-black uppercase tracking-widest text-[9px]">Heirs</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-bold text-sm bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/20">{beneficiaries.length} Designated</span>
                    <ChevronRight size={14} className={`text-pink-400 transition-transform ${showSummaryDetails ? 'rotate-90' : ''}`} />
                  </div>
                </button>
                {showSummaryDetails && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-4 space-y-2 overflow-hidden">
                    {beneficiaries.map((b, i) => (
                      <p key={i} className="text-[10px] text-gray-400 font-medium">• {b.name} ({b.role})</p>
                    ))}
                  </motion.div>
                )}

                <div className="pt-2 space-y-4">
                  <div className="p-4 bg-yellow-500/5 border border-yellow-500/10 rounded-2xl flex gap-3">
                    <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                    <p className="text-[10px] text-yellow-500/70 font-bold uppercase tracking-widest leading-relaxed">Immutable anchoring will occur after the final transaction. Check all beneficiaries.</p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] text-gray-500 font-black uppercase tracking-[0.25em] ml-1">Secure Protocol Password</p>
                    <input
                      type="password" placeholder="••••••••••••"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-5 outline-none focus:border-indigo-500 text-white text-center text-2xl tracking-[0.5em] shadow-inner transition-all"
                      value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-4 mt-12 relative z-20">
          {step > 1 && (
            <button onClick={prevStep} className="flex-1 flex items-center justify-center gap-2 px-6 py-5 glass rounded-2xl font-black text-white border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest text-[10px]">
              <ChevronLeft className="w-4 h-4" />
              Modify
            </button>
          )}
          <button
            onClick={step === 4 ? handleFinish : nextStep}
            disabled={loading || (step === 1 && !formData.title)}
            className="flex-[2] flex items-center justify-center gap-3 px-6 py-5 bg-indigo-600 rounded-2xl font-black text-white hover:bg-indigo-500 transition-all glow shadow-2xl shadow-indigo-500/30 uppercase tracking-widest text-[10px]"
          >
            {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : (
              <>
                {step === 4 ? "Begin Sealing Protocol" : "Advance Configuration"}
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

const RuleAddButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
  <button onClick={onClick} className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-all text-left group">
    <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
      {React.cloneElement(icon as React.ReactElement, { size: 14 })}
    </div>
    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest group-hover:text-white transition-colors">{label}</span>
  </button>
);

export default CreateCapsule;
