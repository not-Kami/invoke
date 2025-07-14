import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@/types';
import { authApi } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      // Verify token is still valid
      authApi.getMe().catch(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
      });
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { user: userData, token: userToken } = response.data.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    try {
      const response = await authApi.signup(data);
      const { user: userData, token: userToken } = response.data.data;
      
      setUser(userData);
      setToken(userToken);
      localStorage.setItem('token', userToken);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}