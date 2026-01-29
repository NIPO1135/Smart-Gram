
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (phone: string, password: string) => Promise<void>;
  register: (name: string, phone: string, password: string, email?: string) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database for demonstration
const MOCK_DB_KEY = 'smart_village_users';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    // Check local storage for persistent session
    const storedUser = localStorage.getItem('smart_village_session');
    if (storedUser) {
      setState(prev => ({ ...prev, user: JSON.parse(storedUser), isLoading: false }));
    } else {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (phone: string, password: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const usersRaw = localStorage.getItem(MOCK_DB_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      const foundUser = users.find((u: any) => u.phone === phone && u.password === password);
      
      if (foundUser) {
        const { password: _, ...userWithoutPass } = foundUser;
        localStorage.setItem('smart_village_session', JSON.stringify(userWithoutPass));
        setState({ user: userWithoutPass as User, isLoading: false, error: null });
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
      throw err;
    }
  };

  const register = async (name: string, phone: string, password: string, email?: string) => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const usersRaw = localStorage.getItem(MOCK_DB_KEY);
      const users = usersRaw ? JSON.parse(usersRaw) : [];
      
      if (users.some((u: any) => u.phone === phone)) {
        throw new Error('Phone number already registered');
      }

      const newUser = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        phone,
        email,
        password,
        role: 'user' as const
      };

      users.push(newUser);
      localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
      
      const { password: _, ...userWithoutPass } = newUser;
      localStorage.setItem('smart_village_session', JSON.stringify(userWithoutPass));
      setState({ user: userWithoutPass as User, isLoading: false, error: null });
    } catch (err: any) {
      setState(prev => ({ ...prev, isLoading: false, error: err.message }));
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('smart_village_session');
    setState({ user: null, isLoading: false, error: null });
  };

  const updateUser = (updates: Partial<User>) => {
    if (!state.user) return;
    
    const updatedUser = { ...state.user, ...updates };
    
    // Update in localStorage
    localStorage.setItem('smart_village_session', JSON.stringify(updatedUser));
    
    // Update in users database
    const usersRaw = localStorage.getItem(MOCK_DB_KEY);
    if (usersRaw) {
      const users = JSON.parse(usersRaw);
      const userIndex = users.findIndex((u: any) => u.id === state.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        localStorage.setItem(MOCK_DB_KEY, JSON.stringify(users));
      }
    }
    
    setState(prev => ({ ...prev, user: updatedUser }));
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
