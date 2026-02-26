import React from 'react';
import Transcript from './Transcript';
import TracePanel from './TracePanel';
import DemoControls from './DemoControls';
import { useDemo } from '../hooks/useDemo';

export default function Demo() {
  const demo = useDemo();

  return (
    <section id="demo-section" className="bg-gray-bg px-6 py-[72px]">
      {/* Section header */}
      <div className="mb-8 text-center">
        <h2 className="text-[1.8rem] font-extrabold tracking-tight text-navy">Live Demo</h2>
        <p className="mt-2 text-[0.95rem] text-gray-600">
          Watch TRACE coach an agent through a real transfer decision in real time.
        </p>
      </div>

      {/* Scenario bar */}
      <div className="mx-auto mb-7 flex max-w-[1280px] items-center rounded-full bg-white px-7 py-3.5 shadow-sm">
        <div className="mr-5 h-2 w-2 flex-shrink-0 rounded-full bg-orange"></div>
        <div className="flex flex-1 items-center">
          <div className="flex flex-col pr-6">
            <span className="mb-0.5 text-[0.67rem] font-semibold tracking-[0.06em] text-gray-400 uppercase">Scenario</span>
            <span className="text-[0.9rem] font-semibold text-navy">Pro account deactivation</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col px-6">
            <span className="mb-0.5 text-[0.67rem] font-semibold tracking-[0.06em] text-gray-400 uppercase">Type</span>
            <span className="text-[0.9rem] font-semibold text-navy">T&S Repeat Contact</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col px-6">
            <span className="mb-0.5 text-[0.67rem] font-semibold tracking-[0.06em] text-gray-400 uppercase">Agent</span>
            <span className="text-[0.9rem] font-semibold text-navy">L2</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col px-6">
            <span className="mb-0.5 text-[0.67rem] font-semibold tracking-[0.06em] text-gray-400 uppercase">Channel</span>
            <span className="text-[0.9rem] font-semibold text-navy">Voice</span>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex flex-col px-6">
            <span className="mb-0.5 text-[0.67rem] font-semibold tracking-[0.06em] text-gray-400 uppercase">Case Age</span>
            <span className="text-[0.9rem] font-semibold text-navy">3 weeks</span>
          </div>
        </div>
      </div>

      {/* Demo layout */}
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-6 md:grid-cols-2">
        <Transcript messages={demo.visibleMessages} />
        <TracePanel 
          panelState={demo.panelState} 
          isAnalyzing={demo.isAnalyzing} 
          messageIndex={demo.currentMessageIndex}
          signalDetailsOpen={demo.signalDetailsOpen}
          setSignalDetailsOpen={demo.setSignalDetailsOpen}
        />
      </div>

      <DemoControls demo={demo} />
    </section>
  );
}
