import React from 'react';
import { motion } from 'motion/react';

export default function Hero() {
  const scrollToDemo = () => {
    const demoSection = document.getElementById('demo-section');
    if (demoSection) {
      demoSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-navy pt-20 pb-[100px] text-white">
      {/* Top bar */}
      <div className="flex w-full justify-between px-12">
        <div>
          <div className="text-[1.1rem] font-bold tracking-tight">⚡ TRACE</div>
          <div className="text-[0.72rem] tracking-wider text-gray-400">
            Transfer Resolution & Agent Coaching Engine · CommOps AI Hackathon 2026
          </div>
        </div>
      </div>

      {/* Headline block */}
      <div className="mx-auto mt-12 mb-6 max-w-[860px] text-center">
        <h1 className="text-[clamp(2.4rem,4.5vw,3.4rem)] font-extrabold leading-[1.1] tracking-[-0.03em]">
          50% of transfers don't belong there.<br />
          Agents are making judgment calls with no data.
        </h1>
      </div>

      {/* Subheadline */}
      <div className="mx-auto mb-12 max-w-[620px] text-center">
        <p className="text-[1.05rem] leading-[1.7] font-normal text-white/65">
          A real-time AI coaching layer that tells agents when to transfer, where to transfer, and when they already have the power to resolve it themselves — reducing invalid transfers, bounce-backs, and repeat contacts across every team.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mx-auto mb-14 grid max-w-[900px] grid-cols-1 gap-4 px-4 md:grid-cols-3">
        <div className="rounded-[10px] border-t-3 border-orange bg-navy-mid p-6 px-7">
          <div className="text-[2rem] font-extrabold">61.5%</div>
          <div className="my-1 text-[0.8rem] font-semibold tracking-[0.06em] text-orange uppercase">No-action transfer rate</div>
          <div className="text-[0.78rem] leading-relaxed text-white/55">
            T&S reviews deactivation cases only to confirm what the agent already knew — no new action taken
          </div>
        </div>
        <div className="rounded-[10px] border-t-3 border-orange bg-navy-mid p-6 px-7">
          <div className="text-[2rem] font-extrabold">~35%</div>
          <div className="my-1 text-[0.8rem] font-semibold tracking-[0.06em] text-orange uppercase">Re-contact rate</div>
          <div className="text-[0.78rem] leading-relaxed text-white/55">
            Repeat inbound contacts from unresolved transfers, directly inflating total ticket volume
          </div>
        </div>
        <div className="rounded-[10px] border-t-3 border-orange bg-navy-mid p-6 px-7">
          <div className="text-[2rem] font-extrabold">4+ teams</div>
          <div className="my-1 text-[0.8rem] font-semibold tracking-[0.06em] text-orange uppercase">Misroute surface area</div>
          <div className="text-[0.78rem] leading-relaxed text-white/55">
            Invalid transfers span T&S, Bugs, Back-Office, Escalations, and Success
          </div>
        </div>
      </div>

      {/* Four-step flow */}
      <div className="mx-auto mb-14 max-w-[960px] px-4">
        <div className="flex flex-wrap items-start md:flex-nowrap">
          <div className="w-1/2 min-w-0 px-3 text-center mb-8 md:flex-1 md:mb-0">
            <span className="mb-2.5 block text-[1.6rem]">🎧</span>
            <div className="mb-1.5 text-[0.85rem] font-bold">Conversation Starts</div>
            <div className="text-[0.77rem] leading-relaxed text-white/55">TRACE reads live transcript and case metadata in real time</div>
          </div>
          <div className="hidden md:block flex-shrink-0 pt-5 text-[1.2rem] text-white/30">→</div>
          <div className="w-1/2 min-w-0 px-3 text-center mb-8 md:flex-1 md:mb-0">
            <span className="mb-2.5 block text-[1.6rem]">🧠</span>
            <div className="mb-1.5 text-[0.85rem] font-bold">Four Signals Scored</div>
            <div className="text-[0.77rem] leading-relaxed text-white/55">Skill match, evidence, team fit, and acceptance likelihood — all live</div>
          </div>
          <div className="hidden md:block flex-shrink-0 pt-5 text-[1.2rem] text-white/30">→</div>
          <div className="w-1/2 min-w-0 px-3 text-center mb-8 md:flex-1 md:mb-0">
            <span className="mb-2.5 block text-[1.6rem]">🚦</span>
            <div className="mb-1.5 text-[0.85rem] font-bold">Traffic Light Directive</div>
            <div className="text-[0.77rem] leading-relaxed text-white/55">A single 🟢 Resolve, 🟡 Hold, or 🔴 Transfer signal tells the agent exactly what to do next</div>
          </div>
          <div className="hidden md:block flex-shrink-0 pt-5 text-[1.2rem] text-white/30">→</div>
          <div className="w-1/2 min-w-0 px-3 text-center md:flex-1">
            <span className="mb-2.5 block text-[1.6rem]">📋</span>
            <div className="mb-1.5 text-[0.85rem] font-bold">Handoff Packet Built</div>
            <div className="text-[0.77rem] leading-relaxed text-white/55">If transfer proceeds, receiving team gets everything they need — no rework</div>
          </div>
        </div>
      </div>

      {/* CTA button */}
      <div className="mb-8 flex justify-center">
        <button 
          onClick={scrollToDemo}
          className="cursor-pointer rounded-full border-none bg-orange px-8 py-3.5 text-[0.9rem] font-semibold text-white shadow-[0_4px_14px_rgba(249,115,22,0.4)] transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#EA6C0A]"
        >
          ▶ See It In Action
        </button>
      </div>

      {/* Team badges */}
      <div className="flex flex-wrap justify-center gap-2 px-4">
        {["Trust & Safety", "Bugs / Engineering", "Back-Office", "Service Escalations", "Success"].map((badge) => (
          <span key={badge} className="rounded-full border border-white/15 px-3.5 py-1 text-[0.72rem] text-white/50">
            {badge}
          </span>
        ))}
      </div>
    </section>
  );
}
