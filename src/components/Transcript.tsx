import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Transcript({ messages }) {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-[480px] md:h-[780px] flex-col overflow-hidden rounded-[14px] bg-white shadow-md">
      {/* Header */}
      <div className="flex flex-shrink-0 items-center justify-between bg-navy px-5 py-4">
        <div className="text-[0.85rem] font-semibold text-white">🎧 Live Conversation</div>
        <div className="flex items-center">
          <div className="h-2 w-2 animate-pulse-opacity rounded-full bg-green"></div>
          <span className="ml-1.5 text-[0.7rem] font-semibold text-green">LIVE</span>
        </div>
      </div>

      {/* Message area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-5 flex flex-col gap-3"
      >
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
              className={`max-w-[82%] ${msg.speaker === 'agent' ? 'self-end flex flex-col items-end' : 'self-start'}`}
            >
              <div className={`mb-1 text-[0.67rem] font-semibold tracking-[0.04em] text-gray-400 uppercase ${msg.speaker === 'agent' ? 'text-right' : ''}`}>
                {msg.speaker === 'agent' ? 'Agent' : 'Customer'}
              </div>
              <div 
                className={`px-3.5 py-2.5 text-[0.875rem] leading-[1.55] ${
                  msg.speaker === 'agent' 
                    ? 'rounded-l-xl rounded-tr-xl rounded-br-[4px] bg-navy text-white' 
                    : 'rounded-r-xl rounded-tl-xl rounded-bl-[4px] bg-slate-100 text-gray-900'
                }`}
              >
                {msg.text}
              </div>
              <div className={`mt-1 text-[0.65rem] text-gray-400 ${msg.speaker === 'agent' ? 'text-right' : ''}`}>
                {msg.time}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
