import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Runs an async function when the component loads (and whenever `deps` change).
 * Returns { data, loading, error, reload }.
 * reload(true) refreshes quietly in the background (no spinner).
 */
export function useAsync(fn, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  const latest = useRef(0);

  const run = useCallback(
    async (silent = false) => {
      const id = ++latest.current;
      if (!silent) setState((s) => ({ ...s, loading: true, error: '' }));
      try {
        const data = await fn();
        if (id === latest.current) setState({ data, loading: false, error: '' });
      } catch (err) {
        if (id === latest.current) {
          setState((s) => ({ data: silent ? s.data : null, loading: false, error: err.message }));
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  );

  useEffect(() => {
    run();
  }, [run]);

  return { ...state, reload: run };
}
