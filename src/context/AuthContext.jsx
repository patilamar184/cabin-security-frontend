import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { authApi } from '../api';
import { session } from '../api/client';

const AuthContext = createContext(null);

function normalizeOwner(data) {
  if (!data) return null;
  return { ...data, name: data.full_name || data.name || '' };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(session.token);
  const [role, setRole] = useState(session.role);
  const [user, setUser] = useState(null);

  const signOut = useCallback(() => {
    session.clear();
    setToken(null);
    setRole(null);
    setUser(null);
  }, []);

  useEffect(() => {
    window.addEventListener('smartcabin:signed-out', signOut);
    return () => window.removeEventListener('smartcabin:signed-out', signOut);
  }, [signOut]);

  useEffect(() => {
    if (token && role === 'owner') {
      authApi.me().then((data) => setUser(normalizeOwner(data))).catch(() => {});
    } else {
      setUser(null);
    }
  }, [token, role]);

  async function signIn(kind, email, password) {
    const call = kind === 'admin' ? authApi.adminLogin : authApi.ownerLogin;
    const data = await call(email, password);
    session.save(data.access_token, kind, data.refresh_token || null);
    setToken(data.access_token);
    setRole(kind);
    if (kind === 'owner') {
      try {
        const profile = await authApi.me();
        setUser(normalizeOwner(profile));
      } catch {
        setUser(null);
      }
    }
    return kind;
  }

  async function signOutAndRevoke() {
    const refreshToken = session.refreshToken;
    if (role === 'owner' && refreshToken) {
      try { await authApi.logout(refreshToken); } catch { /* local sign-out must still complete */ }
    }
    signOut();
  }

  return (
    <AuthContext.Provider value={{ token, role, user, setUser, signIn, signOut: signOutAndRevoke }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
