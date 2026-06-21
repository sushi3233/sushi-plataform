'use client';

import { useEffect } from 'react';

export function DevToolsProtection({ enabled }: { enabled: boolean }) {
  useEffect(() => {
    if (!enabled) return;

    const THRESHOLD = 160;

    const isOpen = () =>
      window.outerWidth - window.innerWidth > THRESHOLD ||
      window.outerHeight - window.innerHeight > THRESHOLD;

    const handleDetection = () => {
      if (isOpen()) {
        document.documentElement.innerHTML = '';
        window.location.replace('about:blank');
      }
    };

    handleDetection();
    window.addEventListener('resize', handleDetection);
    const interval = setInterval(handleDetection, 1000);

    return () => {
      window.removeEventListener('resize', handleDetection);
      clearInterval(interval);
    };
  }, [enabled]);

  return null;
}
