import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { getCurrentUser, loginUser, registerUser } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('student_dashboard_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrapAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        setUser(response.user || null);
      } catch (error) {
        localStorage.removeItem('student_dashboard_token');
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    bootstrapAuth();
  }, [token]);

  const saveSession = (authData) => {
    const authToken = authData.token;
    localStorage.setItem('student_dashboard_token', authToken);
    setToken(authToken);
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('student_dashboard_token');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login: async (credentials) => {
      const response = await loginUser(credentials);
      saveSession(response);
      return response;
    },
    register: async (payload) => {
      const response = await registerUser(payload);
      saveSession(response);
      return response;
    },
    logout,
    setUser,
  }), [user, token, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
