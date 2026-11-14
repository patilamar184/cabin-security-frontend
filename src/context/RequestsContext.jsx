import { createContext, useCallback, useContext, useState } from 'react';
import { requestApi, visitorApi } from '../api';
import usePolling from '../hooks/usePolling';

const RequestsContext = createContext(null);

export function RequestsProvider({ children }) {
  const [requests, setRequests] = useState([]);
  const [names, setNames] = useState({});
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const list = await requestApi.pending();
      setRequests(list);
      if (list.length > 0) {
        const visitors = await visitorApi.list();
        const map = {};
        visitors.forEach((visitor) => { map[visitor.id] = visitor; });
        setNames(map);
      }
    } catch {
      // Poll again on the next interval. Do not interrupt the page.
    } finally {
      setLoaded(true);
    }
  }, []);

  usePolling(refresh, 5000);

  return (
    <RequestsContext.Provider value={{ requests, visitors: names, loaded, refresh }}>
      {children}
    </RequestsContext.Provider>
  );
}

export function useRequests() {
  return useContext(RequestsContext);
}
