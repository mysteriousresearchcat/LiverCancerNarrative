import { useCallback, useEffect, useRef, useState } from "react";

const RESUME_DELAY_MS = 2000;

export function useAutoRotateResume() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [countdownMs, setCountdownMs] = useState(0);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const autoRotateRef = useRef(true);

  const clearResumeTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setCountdownMs(0);
  }, []);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    setCountdownMs(RESUME_DELAY_MS);

    const startedAt = Date.now();
    intervalRef.current = setInterval(() => {
      const remaining = Math.max(0, RESUME_DELAY_MS - (Date.now() - startedAt));
      setCountdownMs(remaining);
    }, 100);

    timeoutRef.current = setTimeout(() => {
      clearResumeTimer();
      autoRotateRef.current = true;
      setAutoRotate(true);
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer]);

  const handleToggleRotation = useCallback(() => {
    clearResumeTimer();
    setAutoRotate((current) => {
      const next = !current;
      autoRotateRef.current = next;
      return next;
    });
  }, [clearResumeTimer]);

  const handleInteractionStart = useCallback(() => {
    clearResumeTimer();
    autoRotateRef.current = false;
    setAutoRotate(false);
  }, [clearResumeTimer]);

  const handleInteractionEnd = useCallback(() => {
    if (autoRotateRef.current) return;
    scheduleResume();
  }, [scheduleResume]);

  useEffect(() => {
    return () => {
      clearResumeTimer();
    };
  }, [clearResumeTimer]);

  return {
    autoRotate,
    countdownSeconds: Math.max(0, Math.ceil(countdownMs / 1000)),
    isResumePending: countdownMs > 0,
    handleInteractionStart,
    handleInteractionEnd,
    handleToggleRotation,
  };
}
