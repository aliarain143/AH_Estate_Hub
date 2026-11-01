import { createContext, useContext, useEffect, useState } from 'react';
import api from '../api';
const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (localStorage.getItem('estatehub_token')) api.get('/auth/me').then(r => setUser(r.data.user)).catch(() => localStorage.removeItem('estatehub_token')).finally(() => setLoading(false));
    else setLoading(false);
  }, []);
  const login = async (credentials) => { const { data } = await api.post('/auth/login', credentials); localStorage.setItem('estatehub_token', data.token); setUser(data.user); };
  const register = async (details) => { const { data } = await api.post('/auth/register', details); localStorage.setItem('estatehub_token', data.token); setUser(data.user); };
  const logout = () => { localStorage.removeItem('estatehub_token'); setUser(null); };
  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);
