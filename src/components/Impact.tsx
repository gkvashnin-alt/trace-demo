import React from 'react';

export default function Impact() {
  return (
    <section className="bg-white px-6 py-20">
      {/* Impact metrics */}
      <div className="mx-auto mb-12 grid max-w-[960px] grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
        {[
          { stat: "📉 61.5%", label: "No-action transfers eliminated", sub: "T&S reviews that confirm what agents already knew" },
          { stat: "⏱️ ~30%", label: "Faster agent decision time", sub: "Clear directive replaces ambiguous scoring" },
          { stat: "🔁 ↑ FCR", label: "More cases resolved without transfer", sub: "Agents empowered to act on what's already in the system" },
          { stat: "📦 100%", label: "Customers receive final outcome", sub: "No more cases closed with no communication sent" }
        ].map((item, idx) => (
          <div key={idx} className="rounded-xl border border-gray-200 bg-white p-6 text-center shadow-sm">
            <div className="text-[2rem] font-extrabold tracking-tight text-navy">{item.stat}</div>
            <div className="my-1.5 text-[0.8rem] font-semibold text-gray-600">{item.label}</div>
            <div className="text-[0.72rem] leading-relaxed text-gray-400">{item.sub}</div>
          </div>
        ))}
      </div>

      <div className="mb-16 text-center text-[0.72rem] text-gray-400">
        * Metrics simulated on anonymized sample set of cases for prototype demonstration.
      </div>

      {/* Traffic light callout card */}
      <div className="mx-auto mb-16 max-w-[900px] rounded-[14px] bg-navy p-9 px-10 shadow-md">
        <div className="mb-2 text-[1.1rem] font-bold text-white">🚦 The Traffic Light System</div>
        <div className="mb-7 text-[0.88rem] leading-relaxed text-white/50">
          Instead of interpreting fluctuating scores, agents receive one decisive signal at the top of every interaction.
        </div>

        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="min-w-[120px] pt-0.5 text-[0.78rem] font-bold text-green">🟢 RESOLVE</div>
            <div className="text-[0.83rem] leading-relaxed text-white/55">
              You have the authority and evidence to close this case in-service right now. No transfer needed.
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="min-w-[120px] pt-0.5 text-[0.78rem] font-bold text-yellow">🟡 HOLD</div>
            <div className="text-[0.83rem] leading-relaxed text-white/55">
              Evidence gaps detected. Gather more context before making a transfer decision.
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="min-w-[120px] pt-0.5 text-[0.78rem] font-bold text-red">🔴 TRANSFER</div>
            <div className="text-[0.83rem] leading-relaxed text-white/55">
              Specialist action genuinely required. Here is which team, why, and exactly what to prepare before you route.
            </div>
          </div>
        </div>
      </div>

      {/* Surface area */}
      <div className="mx-auto mb-16 max-w-[1100px]">
        <div className="mb-5 text-center text-[0.72rem] font-bold tracking-[0.08em] text-gray-400 uppercase">WHERE TRACE APPLIES</div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {[
            { icon: "🔒", name: "Trust & Safety", desc: "Deactivations transferred for review when outcome is already documented in-system" },
            { icon: "🐛", name: "Bugs / Engineering", desc: "Not-a-bug tickets escalated when agents can resolve with a known workaround" },
            { icon: "🏢", name: "Back-Office", desc: "Reactivation cases routed before missing documents are collected from the customer" },
            { icon: "📈", name: "Service Escalations", desc: "L1/L2→L4 escalations where the agent had full authority to resolve" },
            { icon: "💼", name: "Success", desc: "Payment inquiries transferred without attempting in-service lookup first" }
          ].map((item, idx) => (
            <div key={idx} className="rounded-lg border border-gray-200 bg-white p-5 px-4 shadow-sm">
              <span className="mb-2 block text-[1.4rem]">{item.icon}</span>
              <div className="mb-1.5 text-[0.82rem] font-bold text-navy">{item.name}</div>
              <div className="text-[0.74rem] leading-relaxed text-gray-500">{item.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Roadmap */}
      <div className="mx-auto mb-16 max-w-[900px]">
        <div className="mb-6 text-center text-[0.72rem] font-bold tracking-[0.08em] text-gray-400 uppercase">ROADMAP</div>
        <div className="relative grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Dotted connector line (Desktop only) */}
          <div className="absolute top-1/2 left-0 hidden h-0.5 w-full -translate-y-1/2 border-t-2 border-dashed border-gray-200 md:block" style={{ zIndex: 0 }}></div>
          
          <div className="relative z-10 rounded-xl border-2 border-orange bg-orange-soft p-6 px-5 text-center">
            <div className="mb-2 text-[0.67rem] font-bold tracking-[0.08em] text-orange uppercase">Phase 0</div>
            <div className="mb-2 text-[0.9rem] font-bold text-navy">Prototype Demo</div>
            <div className="text-[0.77rem] leading-relaxed text-gray-500">This week · Simulated Observe.AI · T&S deactivation scenario · Mock UI</div>
          </div>
          <div className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 px-5 text-center">
            <div className="mb-2 text-[0.67rem] font-bold tracking-[0.08em] text-gray-400 uppercase">Phase 1</div>
            <div className="mb-2 text-[0.9rem] font-bold text-navy">Pilot</div>
            <div className="text-[0.77rem] leading-relaxed text-gray-500">20–22 weeks · Observe.AI + Salesforce + KA integration · 10–20 agents · Live metrics</div>
          </div>
          <div className="relative z-10 rounded-xl border border-gray-200 bg-white p-6 px-5 text-center">
            <div className="mb-2 text-[0.67rem] font-bold tracking-[0.08em] text-gray-400 uppercase">Phase 2</div>
            <div className="mb-2 text-[0.9rem] font-bold text-navy">Scale</div>
            <div className="text-[0.77rem] leading-relaxed text-gray-500">Q2 2027 · All teams · Full audit logging · Model retraining on production data</div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 -mx-6 -mb-20 flex flex-col items-center justify-between gap-4 bg-navy p-7 px-12 md:flex-row">
        <div className="text-[0.78rem] text-white/40">
          ⚡ TRACE — Transfer Resolution & Agent Coaching Engine · CommOps AI Hackathon 2026
        </div>
        <div className="text-[0.78rem] text-white/40">
          Built by Grigorii Kvashnin · Brian King · Venice Segovia · Blaise Anne Cahilog
        </div>
      </footer>
    </section>
  );
}
