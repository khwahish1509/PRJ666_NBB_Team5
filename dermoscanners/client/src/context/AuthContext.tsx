import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../services/api';

type User = {
  id: string;
  name: string;
  email: string;
  skinType?: string;
  skinGoals: string;
};

type AuthContextType = {
  user: User | null;
  accessToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; skinType?: string; skinGoals: string }) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('auth');
    if (stored) {
      const parsed = JSON.parse(stored);
      setUser(parsed.user);
      setAccessToken(parsed.tokens.accessToken);
      setRefreshToken(parsed.tokens.refreshToken);
    }
  }, []);

  const persist = useCallback((payload: any) => {
    localStorage.setItem('auth', JSON.stringify(payload));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    setUser(res.data.user);
    setAccessToken(res.data.tokens.accessToken);
    setRefreshToken(res.data.tokens.refreshToken);
    persist(res.data);
  }, [persist]);

  const register = useCallback(async (data: { name: string; email: string; password: string; skinType?: string; skinGoals: string }) => {
    const res = await api.post('/auth/register', data);
    setUser(res.data.user);
    setAccessToken(res.data.tokens.accessToken);
    setRefreshToken(res.data.tokens.refreshToken);
    persist(res.data);
  }, [persist]);

  const logout = useCallback(() => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('auth');
  }, []);

  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (resp) => resp,
      async (error) => {
        const original = error.config;
        if (error.response?.status === 401 && refreshToken && !original._retry) {
          original._retry = true;
          try {
            const res = await api.post('/auth/refresh', { refreshToken });
            setAccessToken(res.data.accessToken);
            if (user) {
              persist({ user, tokens: { accessToken: res.data.accessToken, refreshToken } });
            }
            return api({ ...original, headers: { ...original.headers, Authorization: `Bearer ${res.data.accessToken}` } });
          } catch (_e) {
            logout();
          }
        }
        return Promise.reject(error);
      }
    );
    return () => api.interceptors.response.eject(interceptor);
  }, [refreshToken, logout, persist, user]);

  const value = useMemo(() => ({ user, accessToken, login, register, logout }), [user, accessToken, login, register, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

