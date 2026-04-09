import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  register: (name: string, phone: string, password: string, email: string) => Promise<void>;
  login: (phone: string, password: string) => Promise<void>;
  promoteToAdmin: (pin: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
  user: any;
  token: string | null;
  logout: () => void;
  updateUser: (updates: Partial<any>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = 'http://localhost:5000/api/auth';
const AUTH_SESSION_KEY = 'auth_session';

function saveSession(user: any, token: string | null) {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify({ user, token }));
  localStorage.setItem('user', JSON.stringify(user));
}

function clearSession() {
  localStorage.removeItem(AUTH_SESSION_KEY);
  localStorage.removeItem('user');
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<{ user: any; token: string | null }>(() => {
    const savedSession = localStorage.getItem(AUTH_SESSION_KEY);
    if (savedSession) {
      try {
        return JSON.parse(savedSession);
      } catch {
        clearSession();
      }
    }
    const savedUser = localStorage.getItem('user');
    return { user: savedUser ? JSON.parse(savedUser) : null, token: null };
  });

  const user = session.user;
  const token = session.token;

  const applySession = (nextUser: any, nextToken: string | null) => {
    setSession({ user: nextUser, token: nextToken });
    saveSession(nextUser, nextToken);
  };

  const register = async (name: string, phone: string, password: string, email: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, phone, password, email }),
      });

      const data = await response.json();
      
      if (data.message === 'User registered' || response.ok) {
        setError(null);
        await login(phone, password);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, password }),
      });

      const data = await response.json();

      if (data.message === 'Login successful' && data.user) {
        applySession(data.user, data.token ?? null);
        setError(null);
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const promoteToAdmin = async (pin: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      if (!token) {
        setError('Unauthorized');
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/promote-admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ pin }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(data.message || 'Admin promotion failed');
        return false;
      }

      if (data.user) {
        applySession(data.user, data.token ?? token);
      }
      return true;
    } catch {
      setError('Network error. Please check your connection.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setSession({ user: null, token: null });
    clearSession();
  };

  const updateUser = (updates: Partial<any>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      applySession(updatedUser, token ?? null);
    }
  };

  return (
    <AuthContext.Provider value={{ register, login, promoteToAdmin, logout, updateUser, isLoading, error, user, token }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
