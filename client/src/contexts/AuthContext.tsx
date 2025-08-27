import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, authAPI, usersApi } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isDM?: boolean;
    avatar?: string;
  }) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté via le cookie
    
          authAPI.getCurrentUser().then((response) => {
        
        if (response.success && response.data && response.data.user) {
          setToken('cookie');
          setUser(response.data.user);
        } else {
          setToken(null);
          setUser(null);
        }
        setLoading(false);
      }).catch((error) => {
      setToken(null);
      setUser(null);
      setLoading(false);
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Login failed');
      }
      
      const userData = response.data?.user;
      
      if (!userData) {
        throw new Error('No user data received from server');
      }
      
      setToken('cookie'); // Le token est maintenant dans un cookie HTTP-only
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Login failed');
    }
  };

  const signup = async (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    isDM?: boolean;
    avatar?: string;
  }) => {
    try {
      const response = await authAPI.signup(data);
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Signup failed');
      }
      
      const userData = response.data?.user;
      setToken('cookie'); // Le token est maintenant dans un cookie HTTP-only
      setUser(userData);
    } catch (error: any) {
      throw new Error(error.message || 'Signup failed');
    }
  };

  const updateUser = async (updates: Partial<User>) => {
    if (!user) {
      throw new Error('No user logged in');
    }

    try {
      // Appeler l'API pour mettre à jour le profil utilisateur
      const response = await usersApi.updateProfile(user._id, updates);
      
      if (!response.success || !response.data) {
        throw new Error(response.error || 'Failed to update user');
      }
      
      // Mettre à jour l'utilisateur localement
      setUser(response.data);
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.message || 'Failed to update user');
    }
  };

  const logout = async () => {
    try {
      // Appeler l'API de logout pour supprimer le cookie
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setToken(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, updateUser, loading }}>
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