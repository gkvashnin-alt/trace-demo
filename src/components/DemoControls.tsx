import React from 'react';

export default function DemoControls({ demo }) {
  const {
    currentMessageIndex,
    isPlaying,
    isComplete,
    speed,
    handleStart,
    handlePause,
    handleReset,
    handleForward,
    handleBack,
    toggleSpeed,
  } = demo;

  return (
    <div className="mx-auto mt-4 flex max-w-[1280px] flex-col items-center gap-3 rounded-[14px] bg-white p-4 px-6 shadow-sm">
      {/* Playback row */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleBack}
          disabled={currentMessageIndex <= 0}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4.5 py-2.25 text-[0.82rem] font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-35 disabled:pointer-events-none"
        >
          ⏮ Back
        </button>

        <div className="min-w-[140px]">
          {!isPlaying && !isComplete && currentMessageIndex === -1 && (
            <button
              onClick={handleStart}
              className="w-full cursor-pointer rounded-lg border-none bg-orange px-7 py-2.5 text-[0.85rem] font-semibold text-white"
            >
              ▶ Start Demo
            </button>
          )}
          {isPlaying && (
            <button
              onClick={handlePause}
              className="w-full cursor-pointer rounded-lg border-none bg-navy px-7 py-2.5 text-[0.85rem] font-semibold text-white"
            >
              ⏸ Pause
            </button>
          )}
          {!isPlaying && currentMessageIndex !== -1 && !isComplete && (
            <button
              onClick={handleStart}
              className="w-full cursor-pointer rounded-lg border-none bg-orange px-7 py-2.5 text-[0.85rem] font-semibold text-white"
            >
              ▶ Resume
            </button>
          )}
          {isComplete && (
            <button
              onClick={handleReset}
              className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white px-7 py-2.5 text-[0.85rem] font-semibold text-navy"
            >
              ⏹ Reset
            </button>
          )}
        </div>

        <button
          onClick={handleForward}
          disabled={currentMessageIndex >= 13}
          className="cursor-pointer rounded-lg border border-gray-200 bg-white px-4.5 py-2.25 text-[0.82rem] font-medium text-gray-600 disabled:cursor-not-allowed disabled:opacity-35 disabled:pointer-events-none"
        >
          ⏭ Forward
        </button>
      </div>

      {/* Speed row */}
      <div className="flex items-center gap-2">
        <span className="text-[0.75rem] text-gray-400">Speed:</span>
        <button
          onClick={() => speed !== 'normal' && toggleSpeed()}
          className={`cursor-pointer rounded-full px-3.5 py-1.25 text-[0.75rem] transition-all ${
            speed === 'normal' 
              ? 'border-none bg-navy text-white' 
              : 'border border-gray-200 bg-white text-gray-600'
          }`}
        >
          🐢 Normal
        </button>
        <button
          onClick={() => speed !== 'fast' && toggleSpeed()}
          className={`cursor-pointer rounded-full px-3.5 py-1.25 text-[0.75rem] transition-all ${
            speed === 'fast' 
              ? 'border-none bg-navy text-white' 
              : 'border border-gray-200 bg-white text-gray-600'
          }`}
        >
          ⚡ Fast
        </button>
      </div>
    </div>
  );
}
