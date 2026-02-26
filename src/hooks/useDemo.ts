import { useState, useEffect, useRef, useCallback } from 'react';
import { MESSAGES } from '../constants/messages';
import { SCORE_TABLE, STATE_BY_MESSAGE, MESSAGE_TIMINGS_NORMAL, STATE_PAUSE_MS } from '../constants/scoreTable';

export function useDemo() {
  const [visibleMessages, setVisibleMessages] = useState([]);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(-1);
  const [panelState, setPanelState] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState('normal');
  const [signalDetailsOpen, setSignalDetailsOpen] = useState(false);

  const timersRef = useRef([]);
  const startTimeRef = useRef(null);
  const pausedAtRef = useRef(null);
  const remainingTimingsRef = useRef([]);

  const clearAllTimers = useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  const getTimings = useCallback(() => {
    const factor = speed === 'fast' ? 0.5 : 1;
    return MESSAGE_TIMINGS_NORMAL.map(t => t * factor);
  }, [speed]);

  const updatePanelState = useCallback((msgIndex, instant = false) => {
    const newState = STATE_BY_MESSAGE[msgIndex + 1] || 0;
    const currentState = STATE_BY_MESSAGE[msgIndex] || 0;

    if (newState !== currentState && !instant) {
      setIsAnalyzing(true);
      const pauseDuration = (STATE_PAUSE_MS[newState] || 1000) * (speed === 'fast' ? 0.5 : 1);
      const timer = setTimeout(() => {
        setPanelState(newState);
        setIsAnalyzing(false);
      }, pauseDuration);
      timersRef.current.push(timer);
    } else {
      setPanelState(newState);
      setIsAnalyzing(false);
    }
  }, [speed]);

  const playFrom = useCallback((index, offset = 0) => {
    const timings = getTimings();
    const now = Date.now();
    startTimeRef.current = now - offset;

    for (let i = index + 1; i < MESSAGES.length; i++) {
      const delay = timings[i] - offset;
      if (delay >= 0) {
        const timer = setTimeout(() => {
          setVisibleMessages(prev => [...prev, MESSAGES[i]]);
          setCurrentMessageIndex(i);
          updatePanelState(i);
          if (i === MESSAGES.length - 1) {
            setIsPlaying(false);
            setIsComplete(true);
          }
        }, delay);
        timersRef.current.push(timer);
      }
    }
  }, [getTimings, updatePanelState]);

  const handleStart = useCallback(() => {
    if (isComplete) {
      handleReset();
      // Wait a tick for reset to clear
      setTimeout(() => {
        setIsPlaying(true);
        setVisibleMessages([MESSAGES[0]]);
        setCurrentMessageIndex(0);
        updatePanelState(0, true);
        playFrom(0, 0);
      }, 0);
    } else {
      setIsPlaying(true);
      if (currentMessageIndex === -1) {
        setVisibleMessages([MESSAGES[0]]);
        setCurrentMessageIndex(0);
        updatePanelState(0, true);
        playFrom(0, 0);
      } else {
        const offset = pausedAtRef.current - startTimeRef.current;
        playFrom(currentMessageIndex, offset);
      }
    }
  }, [currentMessageIndex, isComplete, playFrom, updatePanelState]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    pausedAtRef.current = Date.now();
    clearAllTimers();
  }, [clearAllTimers]);

  const handleReset = useCallback(() => {
    setIsPlaying(false);
    setIsComplete(false);
    setVisibleMessages([]);
    setCurrentMessageIndex(-1);
    setPanelState(0);
    setIsAnalyzing(false);
    clearAllTimers();
    startTimeRef.current = null;
    pausedAtRef.current = null;
  }, [clearAllTimers]);

  const handleForward = useCallback(() => {
    if (currentMessageIndex < MESSAGES.length - 1) {
      const nextIndex = currentMessageIndex + 1;
      const nextMsg = MESSAGES[nextIndex];
      setVisibleMessages(prev => [...prev, nextMsg]);
      setCurrentMessageIndex(nextIndex);
      setPanelState(STATE_BY_MESSAGE[nextIndex + 1] || 0);
      setIsAnalyzing(false);
      
      if (nextIndex === MESSAGES.length - 1) {
        setIsPlaying(false);
        setIsComplete(true);
      }

      if (isPlaying) {
        clearAllTimers();
        const timings = getTimings();
        playFrom(nextIndex, timings[nextIndex]);
      }
    }
  }, [currentMessageIndex, isPlaying, clearAllTimers, getTimings, playFrom]);

  const handleBack = useCallback(() => {
    if (currentMessageIndex >= 0) {
      const prevIndex = currentMessageIndex - 1;
      setVisibleMessages(prev => prev.slice(0, -1));
      setCurrentMessageIndex(prevIndex);
      setPanelState(STATE_BY_MESSAGE[prevIndex + 1] || 0);
      setIsAnalyzing(false);
      setIsComplete(false);

      if (isPlaying) {
        clearAllTimers();
        const timings = getTimings();
        if (prevIndex >= 0) {
          playFrom(prevIndex, timings[prevIndex]);
        } else {
           handleReset();
           handleStart();
        }
      }
    }
  }, [currentMessageIndex, isPlaying, clearAllTimers, getTimings, playFrom, handleReset, handleStart]);

  const toggleSpeed = useCallback(() => {
    setSpeed(prev => (prev === 'normal' ? 'fast' : 'normal'));
    if (isPlaying) {
      const offset = Date.now() - startTimeRef.current;
      // This is tricky because speed changed, so offset needs to be scaled
      // But for simplicity, we'll just pause and resume or let the user handle it
      // Actually, let's just clear and restart with new speed from current index
      clearAllTimers();
      // We don't scale the offset perfectly here, just resume from current index
      // To be more accurate, we'd need to know how far into the current message we are
      handlePause();
      // The user will have to press resume
    }
  }, [isPlaying, clearAllTimers, handlePause]);

  return {
    visibleMessages,
    currentMessageIndex,
    panelState,
    isAnalyzing,
    isPlaying,
    isComplete,
    speed,
    signalDetailsOpen,
    setSignalDetailsOpen,
    handleStart,
    handlePause,
    handleReset,
    handleForward,
    handleBack,
    toggleSpeed,
  };
}
