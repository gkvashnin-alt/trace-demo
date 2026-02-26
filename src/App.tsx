/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Hero from './components/Hero';
import Demo from './components/Demo';
import Impact from './components/Impact';

function Toast({ message, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(onDismiss, 2000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: 20, x: '-50%' }}
      className="fixed bottom-6 left-1/2 z-[9999] rounded-full bg-navy px-5 py-2.5 text-[0.8rem] text-white shadow-lg"
    >
      {message}
    </motion.div>
  );
}

export default function App() {
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const handleToast = (e: any) => {
      setToast(e.detail);
    };
    window.addEventListener('show-toast', handleToast);
    return () => window.removeEventListener('show-toast', handleToast);
  }, []);

  return (
    <div className="min-h-screen w-full">
      <Hero />
      <Demo />
      <Impact />
      
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast} 
            onDismiss={() => setToast(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
