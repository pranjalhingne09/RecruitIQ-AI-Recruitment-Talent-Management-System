import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('recruitiq_user');
    return cached ? JSON.parse(cached) : null;
  });
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchCurrentUser = async () => {
    const token = localStorage.getItem('recruitiq_token');
    if (!token) {
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem('recruitiq_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Session validation error:', err.message);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('recruitiq_token');
      localStorage.removeItem('recruitiq_user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    await fetchCurrentUser();
    return res;
  };

  const registerCandidate = async (data) => {
    const res = await authService.registerCandidate(data);
    await fetchCurrentUser();
    return res;
  };

  const registerRecruiter = async (data) => {
    const res = await authService.registerRecruiter(data);
    await fetchCurrentUser();
    return res;
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAuthenticated: !!user,
        role: user?.role,
        login,
        registerCandidate,
        registerRecruiter,
        logout,
        refreshUser: fetchCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
