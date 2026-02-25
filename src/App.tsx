import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Pause, RotateCcw, ChevronLeft, ChevronRight, 
  CheckCircle2, AlertTriangle, XCircle, Info, 
  Headset, Brain, CheckCircle, ClipboardList, 
  Pencil, Save, Copy, Zap, ArrowRight, TrendingDown, Clock, Repeat, Package,
  ShieldCheck, Bug, Building2, TrendingUp, Briefcase
} from 'lucide-react';

// --- CONSTANTS & DATA ---

const TRANSCRIPT = [
  { time: "00:09", speaker: "Customer", text: "Hi, I'm trying to understand why my account was deactivated. I got an email saying it violated platform policies but no one has actually explained what that means." },
  { time: "00:18", speaker: "Agent", text: "I'm sorry to hear that — let me pull up your account right now. Can I get your name and email to verify?" },
  { time: "00:25", speaker: "Customer", text: "Sure — Johnny Thecat, johnnytc2025 at gmail dot com." },
  { time: "00:36", speaker: "Agent", text: "Thanks Johnny. I can see your account here. It looks like it was deactivated due to an association with another account that was permanently banned for policy violations." },
  { time: "00:46", speaker: "Customer", text: "I don't even know what account you're talking about. I've already spoken to two agents about this over the past three weeks and nobody has given me a straight answer." },
  { time: "00:57", speaker: "Agent", text: "Because this involves a banned account link, I'll need to pass this to our Trust and Safety team — they're the ones who handle these reviews." },
  { time: "01:06", speaker: "Customer", text: "That's exactly what the last two agents said. It's been three weeks. Is there anything you can actually look into before transferring me again?" },
  { time: "01:16", speaker: "Agent", text: "You're right — let me look more carefully at the case before I do anything. I can see here that T&S already reviewed this account on the 8th. The association was confirmed and the outcome is documented — the deactivation is final under platform policy." },
  { time: "01:27", speaker: "Customer", text: "So it's already been reviewed? Nobody told me that. What does that actually mean — is there any way to appeal?" },
  { time: "01:36", speaker: "Agent", text: "I understand why you'd want to appeal — and I want to give you a straight answer. The policy is non-negotiable when a banned account link is confirmed. But what I can do right now is explain exactly why this happened and send you the formal policy explanation in writing so you have it." },
  { time: "01:44", speaker: "Customer", text: "I just want to understand what I did wrong. Three weeks and nobody has actually explained it to me." },
  { time: "01:53", speaker: "Agent", text: "That's completely fair, Johnny — you deserve a clear answer. The association means the platform cannot support continued access, regardless of whether you were aware of the connection. I'm documenting the final outcome on your case right now and preparing the policy explanation to send to your email." },
  { time: "02:01", speaker: "Customer", text: "Okay. I still don't love the outcome, but at least now I understand what happened. I've been waiting three weeks just for someone to tell me this." },
  { time: "02:11", speaker: "Agent", text: "I've closed the case with a full outcome note and sent the policy explanation to johnnytc2025 at gmail. You won't need to call back — this is the final resolution. I'm sorry it took this long to get you a clear answer, Johnny." },
];

const SCORE_TABLE = {
  0: { 
    skill: null, 
    evidence: null, 
    team: [], 
    transfer: null, 
    risk: null, 
    insight: null, 
    context: { skill: "", evidence: "", team: "", transfer: "" } 
  },
  1: { 
    skill: 62, evidence: 49, 
    team: [{ name: 'T&S', score: 57 }], 
    transfer: 43,
    risk: null,
    insight: "📊 Baseline established. Banned account association detected — monitoring for prior review status and evidence gaps.",
    context: {
      skill: "L2 agent identified · Account deactivation case loaded · Skill confidence building",
      evidence: "Identity verified · Case located · Deactivation reason not yet surfaced",
      team: "Banned account flag detected · T&S flagged as candidate · Review status unknown",
      transfer: "Insufficient case context yet — monitoring"
    }
  },
  2: { 
    skill: 59, evidence: 34, 
    team: [{ name: 'T&S', score: 64 }, { name: 'Adv. Support', score: 43 }], 
    transfer: 28,
    risk: { type: 'high', text: '⚠️ Transfer Risk: HIGH — Repeat contact + no resolution on record' },
    insight: "💡 Prior T&S Review Likely — 61.5% of deactivated-account cases reviewed by T&S result in no action taken. Check for existing review record before transferring.",
    context: {
      skill: "Repeat contact pattern detected · 2 prior transfers on record · Policy outcome authority being assessed",
      evidence: "T&S review status unconfirmed · Prior contact history not surfaced · Outcome never communicated to customer",
      team: "Banned account link → T&S primary candidate · Review status still unknown · No-action rate for this case type: 61.5%",
      transfer: "2 prior transfers with no resolution · Re-transfer likely to result in no new action"
    }
  },
  3: { 
    skill: 47, evidence: 34, 
    team: [{ name: 'T&S', score: 68 }, { name: 'Adv. Support', score: 49 }], 
    transfer: 19,
    risk: { type: 'critical', text: '🔴 Transfer Risk: CRITICAL — Re-transfer will duplicate completed T&S review' },
    insight: "⚠️ T&S reviewed this case on the 8th — outcome already recorded. Re-transfer will result in no new action.",
    context: {
      skill: "Transfer reflex detected · Prior T&S review not checked · Agent has full authority to deliver confirmed policy outcome",
      evidence: "T&S review record not accessed · Existing outcome documentation not surfaced · Customer still without explanation",
      team: "T&S flagged as primary — but existing review on file makes re-transfer redundant",
      transfer: "⚠️ T&S reviewed this case on the 8th — outcome already recorded. Re-transfer will result in no new action."
    }
  },
  4: { 
    skill: 82, evidence: 81, 
    team: [{ name: 'In-Service', score: 84 }], 
    transfer: 41,
    risk: { type: 'reduced', text: '🟡 Transfer Risk: REDUCED — Existing T&S review found. In-service resolution available.' },
    insight: "✅ Agent has everything needed to close this case in-service. Delivering the final outcome now eliminates re-contact and avoids a redundant T&S review.",
    context: {
      skill: "Agent accessed prior review record · Policy outcome identified · L2 authority confirmed for final outcome communication",
      evidence: "T&S outcome confirmed on file (reviewed 8th) · Policy basis documented · Customer context fully gathered",
      team: "T&S review already complete — no further specialist action required · Agent can and should deliver final outcome directly",
      transfer: "Transfer no longer recommended · In-service resolution path confirmed · Re-transfer would create duplicate review"
    }
  },
  5: { 
    skill: 93, evidence: 96, 
    team: [{ name: 'Resolved', score: null }], 
    transfer: null,
    risk: { type: 'success', text: '✅ FCR Achieved — Existing T&S review surfaced. Final outcome delivered in-service.' },
    insight: null,
    context: {
      skill: "Final outcome delivered · Case closed with full documentation · Re-contact risk eliminated",
      evidence: "Policy outcome communicated · Written explanation sent · Case notes complete · No further action required",
      team: "T&S review was already complete · No specialist action was needed · Agent delivered final outcome directly",
      transfer: "FCR achieved · Duplicate T&S review avoided · Customer has final written answer"
    }
  }
};

const TIMINGS = {
  normal: [0, 3000, 6000, 9000, 12000, 15500, 19000, 22000, 25000, 28000, 31000, 34000, 37000, 40000],
  fast: [0, 1500, 3000, 4500, 6000, 7750, 9500, 11000, 12500, 14000, 15500, 17000, 18500, 20000]
};

const getPanelState = (msgIndex: number) => {
  if (msgIndex < 2) return 0;
  if (msgIndex < 5) return 1;
  if (msgIndex < 6) return 2;
  if (msgIndex < 12) return 3;
  if (msgIndex < 14) return 4;
  return 5;
};

// --- COMPONENTS ---

const ProgressBar = ({ value, color }: { value: number | null, color: string }) => {
  return (
    <div className="h-2 w-full bg-navy-800 rounded-full overflow-hidden">
      <motion.div 
        className="h-full"
        initial={{ width: 0 }}
        animate={{ 
          width: value !== null ? `${value}%` : '0%',
          backgroundColor: color
        }}
        transition={{ duration: 0.9, ease: "easeInOut" }}
      />
    </div>
  );
};

const AnimatedNumber = ({ value }: { value: number | null }) => {
  const [displayValue, setDisplayValue] = useState(0);
  
  useEffect(() => {
    if (value === null) {
      setDisplayValue(0);
      return;
    }
    
    let start = displayValue;
    const end = value;
    const duration = 900;
    const startTime = performance.now();
    
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(start + (end - start) * progress);
      
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}%</span>;
};

const Toast = ({ message, visible, onHide }: { message: string, visible: boolean, onHide: () => void }) => {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onHide, 2000);
      return () => clearTimeout(timer);
    }
  }, [visible, onHide]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-navy-900 text-white px-6 py-3 rounded-lg shadow-2xl z-50 border border-white/10"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default function App() {
  const [msgIndex, setMsgIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [toast, setToast] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const transcriptRef = useRef<HTMLDivElement>(null);
  const playbackTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const panelState = useMemo(() => getPanelState(msgIndex), [msgIndex]);
  const scoreData = SCORE_TABLE[panelState as keyof typeof SCORE_TABLE];

  // Auto-scroll transcript
  useEffect(() => {
    if (transcriptRef.current) {
      transcriptRef.current.scrollTop = transcriptRef.current.scrollHeight;
    }
  }, [msgIndex]);

  // Handle Playback
  useEffect(() => {
    if (isPlaying && msgIndex < TRANSCRIPT.length) {
      const nextIndex = msgIndex + 1;
      const currentTimings = TIMINGS[speed];
      
      const targetTime = currentTimings[msgIndex];
      const nextTargetTime = currentTimings[nextIndex] || targetTime + 3000;
      const delay = nextTargetTime - targetTime;

      playbackTimeoutRef.current = setTimeout(() => {
        setMsgIndex(nextIndex);
      }, delay);
    } else if (msgIndex >= TRANSCRIPT.length) {
      setIsPlaying(false);
    }

    return () => {
      if (playbackTimeoutRef.current) clearTimeout(playbackTimeoutRef.current);
    };
  }, [isPlaying, msgIndex, speed]);

  // Handle Analyzing Pulse
  useEffect(() => {
    const triggerMessages = [2, 5, 6, 12, 14];
    if (triggerMessages.includes(msgIndex)) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [msgIndex]);

  const handleTogglePlay = () => {
    if (msgIndex >= TRANSCRIPT.length) {
      setMsgIndex(0);
      setIsPlaying(true);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const handleForward = () => {
    if (msgIndex < TRANSCRIPT.length) {
      setMsgIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (msgIndex > 0) {
      setMsgIndex(prev => prev - 1);
    }
  };

  const showToast = (msg: string) => setToast(msg);

  const getScoreColor = (val: number | null) => {
    if (val === null) return '#6B7280';
    if (val >= 70) return '#22C55E';
    if (val >= 40) return '#EAB308';
    return '#EF4444';
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* SECTION 1 — HERO */}
      <section className="bg-navy-900 text-white py-16 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-2xl font-bold flex items-center gap-2">
              <Zap className="text-orange-500 fill-orange-500" size={24} />
              TRACE
            </div>
            <div className="text-white/50 text-sm mt-1">
              Transfer Resolution & Agent Coaching Engine · CommOps AI Hackathon 2026
            </div>
          </div>

          <div className="text-center max-w-[900px] mx-auto mb-8">
            <h1 className="text-[clamp(2.2rem,4vw,3.2rem)] font-extrabold leading-[1.1] tracking-tight whitespace-normal">
              50% of transfers don't belong there.<br />
              Agents are making judgment calls with no data.
            </h1>
          </div>

          <p className="text-center text-white/70 max-w-[700px] mx-auto mb-16 text-lg font-light leading-relaxed">
            A real-time AI coaching layer that tells agents when to transfer, where to transfer, and when they already have the power to resolve it themselves — reducing invalid transfers, bounce-backs, and repeat contacts across every team.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {[
              { stat: "61.5%", label: "No-action transfer rate", sub: "T&S reviews deactivation cases only to confirm what the agent already knew — no new action taken" },
              { stat: "~35%", label: "Re-contact rate", sub: "Repeat inbound contacts from unresolved transfers, directly inflating total ticket volume" },
              { stat: "4+ teams", label: "Misroute surface area", sub: "Invalid transfers span T&S, Bugs, Back-Office, Escalations, and Success" }
            ].map((card, i) => (
              <div key={i} className="bg-navy-800 p-8 rounded-xl border-t-4 border-orange-500 shadow-xl">
                <div className="text-4xl font-bold text-orange-500 mb-2">{card.stat}</div>
                <div className="text-lg font-semibold mb-3">{card.label}</div>
                <div className="text-sm text-white/50 leading-relaxed">{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-start gap-4 mb-20 overflow-x-auto pb-4 scrollbar-hide">
            {[
              { icon: <Headset size={20} />, title: "Conversation Starts", desc: "TRACE reads live transcript and case metadata in real time" },
              { icon: <Brain size={20} />, title: "Four Signals Scored", desc: "Skill match, evidence, team fit, and acceptance likelihood — all live" },
              { icon: <CheckCircle size={20} />, title: "Agent Gets Coached", desc: "Resolve in-service when possible. Transfer only when ready." },
              { icon: <ClipboardList size={20} />, title: "Handoff Packet Built", desc: "If transfer proceeds, receiving team gets everything they need — no rework" }
            ].map((step, i) => (
              <React.Fragment key={i}>
                <div className="flex-1 min-w-0 flex flex-col items-center text-center md:items-start md:text-left">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 mb-4">
                    {step.icon}
                  </div>
                  <div className="font-bold mb-2">{step.title}</div>
                  <div className="text-[0.82rem] text-white/60 leading-snug">{step.desc}</div>
                </div>
                {i < 3 && (
                  <div className="hidden md:flex items-center pt-5 text-white/20 flex-shrink-0">
                    <ArrowRight size={24} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="flex flex-col items-center gap-8">
            <button 
              onClick={() => document.getElementById('demo-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-10 rounded-full text-lg shadow-lg transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
            >
              <Play size={20} fill="currentColor" />
              See It In Action
            </button>

            <div className="flex flex-wrap justify-center gap-3">
              {['Trust & Safety', 'Bugs / Engineering', 'Back-Office', 'Service Escalations', 'Success'].map((badge, i) => (
                <span key={i} className="px-4 py-1.5 rounded-full border border-white/10 text-xs text-white/40 font-medium">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — INTERACTIVE DEMO */}
      <section id="demo-section" className="bg-bg-light py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-2">Live Demo — T&S Scenario</h2>
            <p className="text-navy-900/50">Watch TRACE coach an agent through a real misroute in real time.</p>
          </div>

          {/* SCENARIO CONTEXT BAR */}
          <div className="bg-white rounded-full p-4 px-7 shadow-sm mb-12 flex flex-wrap md:flex-nowrap items-center divide-x divide-gray-200">
            <div className="flex flex-col items-start pr-6 pl-0">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider">Scenario</span>
              </div>
              <div className="text-[0.95rem] font-bold text-navy-900">Pro account deactivation</div>
            </div>
            <div className="flex flex-col items-start px-6">
              <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Type</span>
              <div className="text-[0.95rem] font-bold text-navy-900">T&S Repeat Contact</div>
            </div>
            <div className="flex flex-col items-start px-6">
              <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Agent</span>
              <div className="text-[0.95rem] font-bold text-navy-900">L2</div>
            </div>
            <div className="flex flex-col items-start px-6">
              <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Channel</span>
              <div className="text-[0.95rem] font-bold text-navy-900">Voice</div>
            </div>
            <div className="flex flex-col items-start px-6">
              <span className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-wider mb-1">Case Age</span>
              <div className="text-[0.95rem] font-bold text-navy-900">3 weeks</div>
            </div>
          </div>

          {/* DEMO COLUMNS */}
          <div className="flex flex-col lg:flex-row gap-8 mb-8 h-auto lg:h-[780px]">
            {/* LEFT COLUMN — Live Conversation */}
            <div className="flex-1 bg-white rounded-xl shadow-lg flex flex-col overflow-hidden border border-gray-100">
              <div className="bg-navy-900 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Headset size={18} />
                  Live Conversation
                </div>
                <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse-live"></div>
                  LIVE
                </div>
              </div>
              <div 
                ref={transcriptRef}
                className="flex-1 p-6 overflow-y-auto space-y-6 scroll-behavior-smooth"
              >
                <AnimatePresence mode='popLayout'>
                  {TRANSCRIPT.slice(0, msgIndex).map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`flex flex-col ${msg.speaker === 'Agent' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[0.7rem] font-bold text-gray-400 mb-1">{msg.speaker}</span>
                      <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.speaker === 'Agent' 
                          ? 'bg-navy-900 text-white rounded-tr-none' 
                          : 'bg-gray-100 text-navy-900 rounded-tl-none'
                      }`}>
                        {msg.text}
                      </div>
                      <span className="text-[0.65rem] text-gray-400 mt-1">[{msg.time}]</span>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {msgIndex === 0 && (
                  <div className="h-full flex flex-col items-center justify-center text-gray-300 gap-4">
                    <Zap size={48} className="opacity-20" />
                    <p className="text-sm font-medium">Waiting for conversation to start...</p>
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN — TRACE Panel */}
            <div className="flex-1 bg-navy-900 rounded-xl shadow-lg flex flex-col overflow-hidden border border-white/5">
              <div className="p-4 flex justify-between items-center">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Zap className="text-orange-500 fill-orange-500" size={18} />
                  TRACE
                </div>
                <div className="text-white/40 text-[0.7rem] font-medium">
                  AI-Assisted · View Only
                </div>
              </div>
              <div className="h-[3px] w-full bg-white/5">
                <motion.div 
                  className="h-full bg-orange-500"
                  animate={{ width: `${(msgIndex / TRANSCRIPT.length) * 100}%` }}
                />
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={panelState}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                  >
                    {/* Subheader */}
                    <div className="flex items-center justify-between min-h-[24px]">
                      {panelState > 0 ? (
                        <div className="flex items-center gap-2 text-green-500 text-xs font-bold">
                          <CheckCircle2 size={14} />
                          Monitoring Active — Baseline established
                        </div>
                      ) : (
                        <div className="text-white/40 text-xs flex items-center gap-2">
                          <div className="flex gap-0.5">
                            {[1,2,3].map(i => <div key={i} className="w-1 h-1 bg-white/20 rounded-full animate-pulse-analyzing" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                          </div>
                          Monitoring: transcript · metadata · profile · history
                        </div>
                      )}
                      
                      {isAnalyzing && (
                        <div className="text-orange-500 text-xs font-bold animate-pulse-analyzing">
                          ⚡ TRACE is analyzing...
                        </div>
                      )}
                    </div>

                    {panelState === 0 ? (
                      <div className="h-[500px] flex flex-col items-center justify-center text-center space-y-4">
                        <div className="text-white/20 flex gap-1">
                          {[1,2,3,4,5].map(i => <div key={i} className="w-1 h-8 bg-current rounded-full animate-pulse" style={{ animationDelay: `${i*0.1}s` }}></div>)}
                        </div>
                        <p className="text-white/60 font-medium">TRACE will activate when the conversation begins.</p>
                      </div>
                    ) : (
                      <>
                        {/* Score Rows */}
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-white">Agent Skill Match</span>
                              <span className="text-sm font-bold" style={{ color: getScoreColor(scoreData.skill) }}>
                                <AnimatedNumber value={scoreData.skill} />
                              </span>
                            </div>
                            <ProgressBar value={scoreData.skill} color={getScoreColor(scoreData.skill)} />
                            <div className="text-[0.7rem] text-white/40">{scoreData.context.skill}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-white">Evidence Sufficiency</span>
                              <span className="text-sm font-bold" style={{ color: getScoreColor(scoreData.evidence) }}>
                                <AnimatedNumber value={scoreData.evidence} />
                              </span>
                            </div>
                            <ProgressBar value={scoreData.evidence} color={getScoreColor(scoreData.evidence)} />
                            <div className="text-[0.7rem] text-white/40">{scoreData.context.evidence}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-white">Team Selection</span>
                              {panelState === 5 ? (
                                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[0.65rem] font-bold border border-green-500/30">
                                  ✅ Resolved In-Service
                                </span>
                              ) : (
                                <div className="flex gap-2">
                                  {scoreData.team.map((t, i) => (
                                    <span key={i} className="text-[0.65rem] font-bold text-white/60">{t.name}</span>
                                  ))}
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              {panelState < 5 && scoreData.team.map((t, i) => (
                                <div key={i} className="space-y-1">
                                  <ProgressBar value={t.score} color={getScoreColor(t.score)} />
                                </div>
                              ))}
                            </div>
                            <div className="text-[0.7rem] text-white/40">{scoreData.context.team}</div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-xs font-bold text-white">Transfer Acceptance</span>
                              {panelState === 5 ? (
                                <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-500 text-[0.65rem] font-bold border border-green-500/30">
                                  ✅ Transfer Avoided
                                </span>
                              ) : (
                                <span className="text-sm font-bold" style={{ color: getScoreColor(scoreData.transfer) }}>
                                  {scoreData.transfer !== null ? <AnimatedNumber value={scoreData.transfer} /> : '—'}
                                </span>
                              )}
                            </div>
                            {panelState < 5 && <ProgressBar value={scoreData.transfer} color={getScoreColor(scoreData.transfer)} />}
                            <div className="text-[0.7rem] text-white/40">{scoreData.context.transfer}</div>
                          </div>
                        </div>

                        {/* Warning Badge */}
                        <AnimatePresence mode="wait">
                          {scoreData.risk && (
                            <motion.div 
                              key={scoreData.risk.text}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className={`p-3 rounded-lg text-xs font-bold border flex items-center gap-2 ${
                                scoreData.risk.type === 'high' ? 'bg-orange-500/10 text-orange-500 border-orange-500/30' :
                                scoreData.risk.type === 'critical' ? 'bg-red-500/10 text-red-500 border-red-500/30' :
                                scoreData.risk.type === 'reduced' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30' :
                                'bg-green-500/10 text-green-500 border-green-500/30'
                              }`}
                            >
                              {scoreData.risk.text}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {/* Insight Boxes */}
                        {panelState === 1 && (
                          <div className="bg-navy-800 p-4 rounded-lg border border-white/5 text-sm text-white/80 leading-relaxed">
                            {scoreData.insight}
                          </div>
                        )}

                        {panelState === 2 && (
                          <div className="bg-navy-700 p-4 rounded-lg border border-white/5 space-y-3">
                            <div className="text-sm text-white/80 leading-relaxed">{scoreData.insight}</div>
                            <button className="text-orange-500 text-xs font-bold hover:underline">View similar case outcomes →</button>
                          </div>
                        )}

                        {panelState === 3 && (
                          <div className="space-y-4">
                            <div className="bg-navy-800 p-4 rounded-lg border border-white/5 space-y-3">
                              <div className="text-[0.65rem] font-bold text-orange-500 uppercase tracking-widest">Required Before Transfer</div>
                              <ul className="space-y-2">
                                {['Check for existing T&S review record on case', 'Confirm whether outcome has been communicated to customer', 'Verify if L2 agent can deliver final outcome directly'].map((item, i) => (
                                  <li key={i} className="flex items-start gap-2 text-xs text-white/60">
                                    <div className="w-3.5 h-3.5 border border-white/20 rounded mt-0.5"></div>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div className="bg-navy-800 p-4 rounded-lg border border-white/5 space-y-3">
                              <div className="flex items-center gap-2 text-[0.65rem] font-bold text-white/40 uppercase tracking-widest">
                                <Pencil size={12} />
                                Suggested Rewrite
                              </div>
                              <div className="text-xs italic text-red-400/70">Instead of: "I'll need to pass this to our Trust and Safety team."</div>
                              <div className="text-xs text-green-400 font-medium">Try: "Let me check if T&S has already reviewed this before I transfer you — I want to make sure we're not sending you somewhere that won't give you a new answer."</div>
                            </div>
                          </div>
                        )}

                        {panelState === 4 && (
                          <div className="space-y-4">
                            <div className="bg-green-900/20 p-4 rounded-lg border border-green-500/20 space-y-3">
                              <div className="text-[0.65rem] font-bold text-green-500 uppercase tracking-widest">FCR Path — In Progress</div>
                              <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-green-500/50 line-through decoration-green-500/30">
                                  <CheckCircle2 size={14} />
                                  Existing T&S review record confirmed
                                </li>
                                <li className="flex items-start gap-2 text-xs text-green-500/50 line-through decoration-green-500/30">
                                  <CheckCircle2 size={14} />
                                  Outcome never communicated to customer — gap identified
                                </li>
                                <li className="flex items-start gap-2 text-xs text-white font-medium">
                                  <div className="w-3.5 h-3.5 border border-orange-500 bg-orange-500/20 rounded mt-0.5"></div>
                                  Final outcome and policy explanation delivered to customer
                                </li>
                              </ul>
                            </div>
                            <div className="text-sm text-white/80 leading-relaxed">{scoreData.insight}</div>
                          </div>
                        )}

                        {panelState === 5 && (
                          <div className="bg-navy-800 p-6 rounded-lg border border-white/5 space-y-6">
                            <div className="flex items-center gap-2 text-[0.65rem] font-bold text-white/40 uppercase tracking-widest">
                              <ClipboardList size={14} />
                              Case Summary — For Record
                            </div>
                            
                            <div className="bg-white/5 p-4 rounded-lg space-y-4 text-xs leading-relaxed">
                              <div className="text-white/90">
                                <span className="font-bold">Resolution:</span> In-service (no transfer required)<br />
                                <span className="font-bold">Agent:</span> L2 · <span className="font-bold">Case age:</span> 3 weeks · <span className="font-bold">Prior contacts:</span> 2
                              </div>
                              
                              <div className="space-y-1">
                                <div className="font-bold text-white/40 uppercase text-[0.6rem]">Actions taken:</div>
                                <ul className="space-y-1 text-white/70">
                                  <li>· T&S review confirmed on file (completed 8th)</li>
                                  <li>· Policy outcome: Deactivation final — banned account association confirmed</li>
                                  <li>· Outcome communicated directly to customer</li>
                                  <li>· Policy explanation sent to: johnnytc2025@gmail.com</li>
                                  <li>· Case closed with full outcome note</li>
                                </ul>
                              </div>

                              <div className="space-y-1">
                                <div className="font-bold text-white/40 uppercase text-[0.6rem]">Why no transfer was needed:</div>
                                <p className="text-white/70">T&S had already completed their review. The agent had full authority to deliver the final outcome. Re-transferring would have created a duplicate review with no new action — the 3rd such transfer on this case.</p>
                              </div>

                              <div className="text-green-400 font-medium">
                                Outcome: Customer has final written explanation. No callback required. Re-contact risk eliminated.
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <button 
                                onClick={() => showToast("Coming in Phase 1 pilot")}
                                className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <Save size={14} />
                                Save to Case
                              </button>
                              <button 
                                onClick={() => showToast("Coming in Phase 1 pilot")}
                                className="flex-1 border border-white/10 hover:bg-white/5 text-white font-bold py-2.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
                              >
                                <Copy size={14} />
                                Copy Summary
                              </button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* DEMO CONTROL BAR */}
          <div className="bg-white rounded-xl shadow-lg p-6 space-y-6 border border-gray-100">
            {/* Row 1 — Playback */}
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleBack}
                disabled={msgIndex === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
              >
                <ChevronLeft size={18} />
                Back
              </button>

              <button 
                onClick={handleTogglePlay}
                className={`flex items-center gap-3 px-8 py-3 rounded-lg font-bold text-white transition-all hover:scale-105 active:scale-95 shadow-md ${
                  msgIndex >= TRANSCRIPT.length ? 'bg-navy-900' : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {msgIndex >= TRANSCRIPT.length ? (
                  <><RotateCcw size={20} /> Reset</>
                ) : isPlaying ? (
                  <><Pause size={20} fill="currentColor" /> Pause</>
                ) : (
                  <><Play size={20} fill="currentColor" /> {msgIndex === 0 ? 'Start Demo' : 'Resume'}</>
                )}
              </button>

              <button 
                onClick={handleForward}
                disabled={msgIndex >= TRANSCRIPT.length}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-gray-400 font-bold text-sm hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-all"
              >
                Forward
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Row 2 — Speed */}
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                <button 
                  onClick={() => setSpeed('normal')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    speed === 'normal' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  🐢 Normal
                </button>
                <button 
                  onClick={() => setSpeed('fast')}
                  className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${
                    speed === 'fast' ? 'bg-orange-500 text-white shadow-sm' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  ⚡ Fast
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — IMPACT + CLOSE */}
      <section className="bg-white py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-24">
            {[
              { icon: <TrendingDown className="text-red-500" />, stat: "61.5%", label: "No-action transfer rate eliminated", sub: "T&S reviews that confirm what agents already knew" },
              { icon: <Clock className="text-orange-500" />, stat: "~30%", label: "Faster agent decision time", sub: "Real-time guidance reduces case research overhead" },
              { icon: <Repeat className="text-green-500" />, stat: "↑ FCR", label: "More cases resolved without transfer", sub: "Agents empowered to close cases in-service" },
              { icon: <Package className="text-blue-500" />, stat: "100%", label: "Customers receive final outcome", sub: "No more cases closed with no communication" }
            ].map((card, i) => (
              <div key={i} className="p-8 rounded-2xl bg-bg-light border border-gray-100 shadow-sm">
                <div className="mb-4">{card.icon}</div>
                <div className="text-3xl font-bold text-navy-900 mb-1">{card.stat}</div>
                <div className="text-sm font-bold text-navy-900 mb-2">{card.label}</div>
                <div className="text-xs text-gray-500 leading-relaxed">{card.sub}</div>
              </div>
            ))}
          </div>

          <div className="text-center mb-16">
            <p className="text-[0.7rem] text-gray-400 italic">* Metrics simulated on anonymized sample set of cases for prototype demonstration.</p>
          </div>

          <div className="mb-32">
            <h3 className="text-2xl font-bold text-navy-900 mb-10 text-center">Transfer Surface Area</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[
                { icon: <ShieldCheck />, title: "Trust & Safety", desc: "Deactivations and policy outcomes transferred for 'review' when outcome is already documented in-system" },
                { icon: <Bug />, title: "Bugs / Engineering", desc: "Service tickets escalated to Bugs that agents can resolve with a known workaround" },
                { icon: <Building2 />, title: "Back-Office", desc: "Reactivation cases missing documents routed before collection is attempted" },
                { icon: <TrendingUp />, title: "Service Escalations", desc: "L1/L2→L4 escalations where L2 had full authority to resolve" },
                { icon: <Briefcase />, title: "Success", desc: "Payment inquiries transferred without attempting in-service lookup first" }
              ].map((card, i) => (
                <div key={i} className="p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="text-orange-500 mb-4">{card.icon}</div>
                  <div className="text-sm font-bold text-navy-900 mb-2">{card.title}</div>
                  <div className="text-[0.75rem] text-gray-500 leading-relaxed">{card.desc}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold text-navy-900 mb-12 text-center">Phased Rollout</h3>
            <div className="relative flex flex-col md:flex-row gap-8">
              <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 border-t-2 border-dotted border-gray-200 -translate-y-1/2"></div>
              
              {[
                { phase: "Phase 0", title: "Prototype Demo", sub: "This week · Simulated Observe.AI · T&S deactivation scenario · Mock UI", active: true },
                { phase: "Phase 1", title: "Pilot", sub: "20–22 weeks · Observe.AI + Salesforce + KA integration · 10–20 agents · Live metrics", active: false },
                { phase: "Phase 2", title: "Scale", sub: "Q2 2027 · All teams · Full audit logging · Model retraining on production data", active: false }
              ].map((step, i) => (
                <div key={i} className={`relative z-10 flex-1 p-8 rounded-2xl bg-white border-2 transition-all ${
                  step.active ? 'border-orange-500 shadow-xl' : 'border-gray-100 shadow-sm'
                }`}>
                  <div className={`text-[0.65rem] font-bold uppercase tracking-widest mb-2 ${step.active ? 'text-orange-500' : 'text-gray-400'}`}>
                    {step.phase}
                  </div>
                  <div className="text-lg font-bold text-navy-900 mb-3">{step.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{step.sub}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-navy-900 py-12 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-white/40 text-sm text-center md:text-left">
            <span className="text-white font-bold">⚡ TRACE</span> — Transfer Resolution & Agent Coaching Engine<br />
            CommOps AI Hackathon 2026
          </div>
          <div className="text-white/40 text-sm text-center md:text-right">
            Built by Grigorii Kvashnin · Brian King · Venice Segovia · Blaise Anne Cahilog
          </div>
        </div>
      </footer>

      <Toast message={toast || ''} visible={!!toast} onHide={() => setToast(null)} />
    </div>
  );
}
