import { useEffect, useRef } from 'react';

// Calls fn now and then every `ms` milliseconds until the component unmounts.
export default function usePolling(fn, ms, enabled = true) {
  const saved = useRef(fn);
  saved.current = fn;

  useEffect(() => {
    if (!enabled) return undefined;
    saved.current();
    const timer = setInterval(() => saved.current(), ms);
    return () => clearInterval(timer);
  }, [ms, enabled]);
}
