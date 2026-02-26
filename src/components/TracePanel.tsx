import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PANEL_STATES } from '../constants/panelStates';
import { SCORE_TABLE } from '../constants/scoreTable';

function AnimatedNumber({ value, duration = 900 }) {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const startTimeRef = useRef(null);
  const startValueRef = useRef(value || 0);

  useEffect(() => {
    if (value === null) return;
    
    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const progress = Math.min((timestamp - startTimeRef.current) / duration, 1);
      const current = Math.floor(startValueRef.current + (value - startValueRef.current) * progress);
      setDisplayValue(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        startValueRef.current = value;
        startTimeRef.current = null;
      }
    };
    
    requestAnimationFrame(animate);
  }, [value, duration]);

  if (value === null) return '--';
  return displayValue;
}

function SignalBar({ label, value, context, colorThreshold = true }) {
  const getColor = (v) => {
    if (v === null) return '#6B7280';
    if (v >= 70) return '#22C55E';
    if (v >= 40) return '#EAB308';
    return '#EF4444';
  };

  return (
    <div className="mb-3.5">
      <div className="flex justify-between">
        <span className="text-[0.72rem] font-semibold tracking-[0.05em] text-white/50 uppercase">{label}</span>
        <span 
          className="text-[0.72rem] font-bold" 
          style={{ color: colorThreshold ? getColor(value) : 'white' }}
        >
          <AnimatedNumber value={value} />%
        </span>
      </div>
      <div className="mt-1.5 h-[5px] w-full overflow-hidden rounded-full bg-white/8">
        <div 
          className="h-full rounded-full transition-[width] duration-900 ease-in-out transition-[background-color] duration-600"
          style={{ 
            width: `${value || 0}%`, 
            backgroundColor: getColor(value) 
          }}
        />
      </div>
      <div className="mt-1 text-[0.7rem] leading-relaxed text-white/30">{context}</div>
    </div>
  );
}

export default function TracePanel({ panelState, isAnalyzing, messageIndex, signalDetailsOpen, setSignalDetailsOpen }) {
  const stateData = PANEL_STATES[panelState];
  const scoreData = SCORE_TABLE[panelState];

  const getContext = (metric, state) => {
    const contexts = {
      agentSkillMatch: {
        1: "L2 agent identified · Account deactivation case loaded",
        2: "Repeat contact detected · Case complexity elevated",
        3: "Transfer reflex detected · Prior review not checked",
        4: "Prior review surfaced · L2 authority confirmed for final communication",
        5: "Final outcome delivered · Re-contact eliminated"
      },
      evidenceSufficiency: {
        1: "Identity verified · Case located · Review status unknown",
        2: "T&S review unconfirmed · Prior contacts not surfaced",
        3: "Review record not accessed · Customer without explanation",
        4: "T&S outcome on file · Policy basis documented · Context gathered",
        5: "Policy explanation sent · Case notes complete"
      },
      teamSelection: {
        1: "Banned account flag · T&S flagged as candidate",
        2: "T&S primary · No-action rate 61.5% for this type",
        3: "T&S primary — but review already complete",
        4: "No specialist action required · Agent can deliver final outcome"
      },
      transferAcceptance: {
        1: "Insufficient context yet — monitoring",
        2: "2 prior transfers with no resolution recorded",
        3: "Re-transfer = duplicate review. No new action expected.",
        4: "Transfer no longer recommended · In-service path confirmed"
      }
    };
    return contexts[metric]?.[state] || "";
  };

  const showToast = (text) => {
    const event = new CustomEvent('show-toast', { detail: text });
    window.dispatchEvent(event);
  };

  return (
    <div className="flex h-[480px] md:h-[780px] flex-col overflow-hidden rounded-[14px] bg-navy shadow-md">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between border-bottom border-white/7 px-5 py-4">
        <div className="text-[0.9rem] font-bold text-white">⚡ TRACE</div>
        <div className="text-[0.67rem] text-white/35">AI-Assisted · View Only</div>
      </div>

      {/* Progress bar */}
      <div className="h-[3px] w-full flex-shrink-0 bg-white/8">
        <div 
          className="h-full bg-orange transition-[width] duration-600 ease-out"
          style={{ width: `${Math.max(0, (messageIndex + 1) / 14) * 100}%` }}
        />
      </div>

      {/* Traffic light legend */}
      {panelState > 0 && (
        <div className="flex items-center gap-4 border-b border-white/6 bg-white/3 px-5 py-2">
          <span className="text-[0.72rem] font-semibold text-green">🟢 Resolve</span>
          <span className="text-[0.72rem] font-semibold text-yellow">🟡 Hold</span>
          <span className="text-[0.72rem] font-semibold text-red">🔴 Transfer</span>
          <span className="ml-auto text-[0.68rem] italic text-white/20">Real-time transfer decision guidance</span>
        </div>
      )}

      {/* Analyzing indicator */}
      <div className="flex h-8 items-center px-5">
        {isAnalyzing && (
          <div className="animate-pulse-fast text-[0.72rem] italic text-orange/80">
            ⚡ TRACE is analyzing...
          </div>
        )}
      </div>

      {/* Content area */}
      <div className="flex-1 overflow-y-auto">
        <AnimatePresence mode="wait">
          {panelState === 0 ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="flex h-full flex-col items-center justify-center px-8"
            >
              <div className="mb-4 text-[2rem]">〰️</div>
              <div className="text-center text-[0.9rem] text-white/40">
                TRACE will activate when the conversation begins.
              </div>
              <div className="mt-2 text-center text-[0.72rem] text-white/25">
                Monitoring: transcript · case metadata · agent profile · transfer history
              </div>
            </motion.div>
          ) : (
            <motion.div
              key={panelState}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="pb-4"
            >
              {/* Directive Card */}
              {stateData.directive && (
                <div 
                  className={`m-4 rounded-[10px] border border-l-3 p-3.5 px-4 ${
                    stateData.directive.color === 'yellow' ? 'border-yellow/30 border-l-yellow bg-yellow/12' :
                    stateData.directive.color === 'red' ? 'border-red/25 border-l-red bg-red/10' :
                    'border-green/25 border-l-green bg-green/10'
                  }`}
                >
                  <div className={`mb-1 text-[0.7rem] font-bold tracking-[0.08em] uppercase ${
                    stateData.directive.color === 'yellow' ? 'text-yellow' :
                    stateData.directive.color === 'red' ? 'text-red' :
                    'text-green'
                  }`}>
                    {stateData.directive.status}
                  </div>
                  <div className="text-[0.92rem] font-semibold leading-relaxed text-white">
                    {stateData.directive.message}
                  </div>
                  <div className="mt-1 text-[0.75rem] text-white/45">
                    {stateData.directive.sub}
                  </div>
                </div>
              )}

              {/* Checklist Card */}
              {stateData.checklistItems.length > 0 && (
                <div className="mx-4 mb-4 rounded-[10px] border border-white/8 bg-white/4 p-3.5 px-4">
                  <div className="mb-2.5 text-[0.67rem] font-bold tracking-[0.08em] text-white/35 uppercase">DO THIS NOW</div>
                  {stateData.checklistItems.map((item, idx) => (
                    <div key={idx} className={`mb-2 flex items-start gap-2 ${item.highlighted ? 'border-l-2 border-orange pl-2' : ''}`}>
                      <span className={`text-[1rem] leading-none ${item.done ? 'text-green' : 'text-white/25'}`}>
                        {item.done ? '☑' : '☐'}
                      </span>
                      <span className={`text-[0.83rem] leading-relaxed ${
                        item.done ? 'text-green/50 line-through' : 
                        item.highlighted ? 'font-semibold text-white' : 'text-white/70'
                      }`}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Insight Card */}
              {stateData.insightCard && (
                <div className="mx-4 mb-4 rounded-[10px] border border-white/8 bg-white/4 p-3.5 px-4">
                  {stateData.insightCard.title && (
                    <div className={`mb-1.5 text-[0.7rem] font-bold tracking-[0.06em] uppercase ${panelState >= 4 ? 'text-green' : 'text-orange'}`}>
                      {stateData.insightCard.icon} {stateData.insightCard.title}
                    </div>
                  )}
                  <div className="text-[0.78rem] leading-relaxed text-white/55">
                    {stateData.insightCard.body}
                  </div>
                  {panelState === 2 && (
                    <a href="#" onClick={(e) => { e.preventDefault(); showToast("Coming in Phase 1 pilot"); }} className="mt-1.5 block text-[0.75rem] text-orange">
                      View similar case outcomes →
                    </a>
                  )}
                </div>
              )}

              {/* Rewrite Card */}
              {stateData.rewriteCard && (
                <div className="mx-4 mb-4 rounded-[10px] border border-white/8 bg-white/4 p-3.5 px-4">
                  <div className="mb-1.5 text-[0.7rem] font-bold tracking-[0.06em] text-orange uppercase">✏️ SUGGESTED REWRITE</div>
                  <div className="mb-2 text-[0.78rem] italic text-red/70">
                    {stateData.rewriteCard.original}
                  </div>
                  <div className="text-[0.78rem] leading-relaxed text-green">
                    {stateData.rewriteCard.suggested}
                  </div>
                </div>
              )}

              {/* Case Summary Card */}
              {stateData.showCaseSummary && (
                <div className="mx-4 mb-4 rounded-[10px] border border-white/8 bg-white/4 p-3.5 px-4">
                  <div className="mb-2.5 text-[0.67rem] font-bold tracking-[0.06em] text-orange uppercase">📋 CASE SUMMARY</div>
                  <div className="text-[0.78rem] leading-[1.7] text-white/55">
                    Resolution: In-service · No transfer required<br />
                    Agent: L2 · Case age: 3 weeks · Prior contacts: 2<br />
                    <br />
                    · T&S review confirmed on file (completed 8th)<br />
                    · Policy outcome: Deactivation final — banned account link confirmed<br />
                    · Outcome communicated directly to customer<br />
                    · Policy explanation sent to: johnnytc2025@gmail.com<br />
                    · Case closed with full outcome note<br />
                    <br />
                    <span className="text-[0.74rem] text-orange/70">
                      3rd T&S transfer avoided · Duplicate review prevented · Re-contact risk eliminated
                    </span>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button 
                      onClick={() => showToast("Coming in Phase 1 pilot")}
                      className="flex-1 cursor-pointer rounded-md border-none bg-orange py-2 text-[0.78rem] font-semibold text-white"
                    >
                      📄 Save to Case
                    </button>
                    <button 
                      onClick={() => showToast("Coming in Phase 1 pilot")}
                      className="flex-1 cursor-pointer rounded-md border border-white/15 bg-transparent py-2 text-[0.78rem] text-white/60"
                    >
                      📋 Copy Summary
                    </button>
                  </div>
                </div>
              )}

              {/* Signal Details Toggle */}
              <div className="mx-4 mb-4">
                <div 
                  onClick={() => setSignalDetailsOpen(!signalDetailsOpen)}
                  className="flex cursor-pointer items-center justify-between rounded-lg bg-white/4 p-2.5 px-3.5"
                >
                  <span className="text-[0.75rem] font-medium text-white/40">📊 Signal details</span>
                  <span 
                    className="text-[0.65rem] text-white/30 transition-transform duration-200"
                    style={{ transform: signalDetailsOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                  >
                    ▼
                  </span>
                </div>
                
                <motion.div
                  initial={false}
                  animate={{ height: signalDetailsOpen ? 'auto' : 0, opacity: signalDetailsOpen ? 1 : 0 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pt-3 pb-1">
                    <SignalBar 
                      label="Agent Skill Match" 
                      value={scoreData.agentSkillMatch} 
                      context={getContext('agentSkillMatch', panelState)} 
                    />
                    <SignalBar 
                      label="Evidence Sufficiency" 
                      value={scoreData.evidenceSufficiency} 
                      context={getContext('evidenceSufficiency', panelState)} 
                    />
                    
                    {/* Team Selection */}
                    <div className="mb-3.5">
                      <div className="mb-1 text-[0.72rem] font-semibold tracking-[0.05em] text-white/50 uppercase">Team Selection</div>
                      <AnimatePresence mode="wait">
                        {panelState === 5 ? (
                          <motion.div 
                            key="resolved"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block rounded-full bg-green/20 px-3 py-1 text-[0.72rem] font-bold text-green"
                          >
                            ✅ Resolved In-Service
                          </motion.div>
                        ) : (
                          <motion.div key="bars" exit={{ opacity: 0, transition: { duration: 0.4 } }}>
                            {scoreData.teamPrimary && scoreData.teamPrimary !== 'resolved' && (
                              <SignalBar 
                                label={scoreData.teamPrimary} 
                                value={scoreData.teamPrimaryPct} 
                                context={getContext('teamSelection', panelState)}
                                colorThreshold={false}
                              />
                            )}
                            {scoreData.teamSecondary && (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.4 }}
                              >
                                <SignalBar 
                                  label={scoreData.teamSecondary} 
                                  value={scoreData.teamSecondaryPct} 
                                  context=""
                                  colorThreshold={false}
                                />
                              </motion.div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Transfer Acceptance */}
                    <div className="mb-3.5">
                      <div className="mb-1 text-[0.72rem] font-semibold tracking-[0.05em] text-white/50 uppercase">Transfer Acceptance</div>
                      <AnimatePresence mode="wait">
                        {panelState === 5 ? (
                          <motion.div 
                            key="avoided"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="inline-block rounded-full bg-green/20 px-3 py-1 text-[0.72rem] font-bold text-green"
                          >
                            ✅ Transfer Avoided
                          </motion.div>
                        ) : (
                          <motion.div key="bar" exit={{ opacity: 0, transition: { duration: 0.3 } }}>
                            <SignalBar 
                              label="Likelihood" 
                              value={scoreData.transferAcceptance} 
                              context={getContext('transferAcceptance', panelState)} 
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
