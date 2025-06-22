'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, LoginCredentials, RegisterCredentials } from '@/types';

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginCredentials) => Promise<boolean>;
  register: (credentials: RegisterCredentials) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate with localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => 
        u.email === credentials.email && u.password === credentials.password
      );

      if (foundUser) {
        const authUser: AuthUser = {
          id: foundUser.id,
          email: foundUser.email,
          firstName: foundUser.firstName,
          lastName: foundUser.lastName,
          accountType: foundUser.accountType,
        };
        setUser(authUser);
        localStorage.setItem('user', JSON.stringify(authUser));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    try {
      // In a real app, this would make an API call
      // For demo purposes, we'll simulate with localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user already exists
      if (users.find((u: any) => u.email === credentials.email)) {
        return false;
      }

      const newUser = {
        id: Date.now().toString(),
        ...credentials,
        bio: '',
        profilePicture: '',
        education: [],
        workExperience: [],
        skills: [],
        connections: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));

      const authUser: AuthUser = {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        accountType: newUser.accountType,
      };
      setUser(authUser);
      localStorage.setItem('user', JSON.stringify(authUser));
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
