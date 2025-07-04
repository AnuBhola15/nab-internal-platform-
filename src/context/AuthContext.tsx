import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { database } from '../utils/database';

interface AuthContextType {
  currentUser: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinDate'>) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const user = database.getCurrentUser();
    setCurrentUser(user);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simple authentication - in production, this would verify against a secure backend
    const user = database.getUserByEmail(email);
    if (user) {
      setCurrentUser(user);
      database.setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = async (userData: Omit<User, 'id' | 'joinDate'>): Promise<boolean> => {
    try {
      const existingUser = database.getUserByEmail(userData.email);
      if (existingUser) {
        return false; // User already exists
      }

      const newUser: User = {
        id: Date.now().toString(),
        joinDate: new Date().toISOString(),
        ...userData
      };

      database.createUser(newUser);
      setCurrentUser(newUser);
      database.setCurrentUser(newUser);
      return true;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    database.setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (currentUser) {
      const updatedUser = { ...currentUser, ...updates };
      setCurrentUser(updatedUser);
      database.updateUser(currentUser.id, updates);
      database.setCurrentUser(updatedUser);
    }
  };

  const value: AuthContextType = {
    currentUser,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated: !!currentUser,
    isAdmin: currentUser?.isAdmin || false
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};