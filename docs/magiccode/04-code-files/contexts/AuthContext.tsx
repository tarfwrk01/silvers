import React, { createContext, useContext } from 'react';
import db from '../lib/instant';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithMagicCode: (email: string) => Promise<void>;
  verifyMagicCode: (email: string, code: string) => Promise<void>;
  signOut: () => Promise<void>;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use Instant DB's built-in useAuth hook
  const { user: instantUser, isLoading } = db.useAuth();

  // Transform the user object to match our interface
  const user = instantUser ? {
    id: instantUser.id,
    email: instantUser.email,
  } : null;

  const signInWithMagicCode = async (email: string) => {
    try {
      await db.auth.sendMagicCode({ email });
    } catch (err: any) {
      console.error('Failed to send magic code:', err);
      throw new Error(err.message || 'Failed to send magic code');
    }
  };

  const verifyMagicCode = async (email: string, code: string) => {
    try {
      await db.auth.signInWithMagicCode({ email, code });
    } catch (err: any) {
      console.error('Failed to verify magic code:', err);
      throw new Error(err.message || 'Failed to verify magic code');
    }
  };

  const signOut = async () => {
    try {
      await db.auth.signOut();
    } catch (err: any) {
      console.error('Failed to sign out:', err);
      throw new Error(err.message || 'Failed to sign out');
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    signInWithMagicCode,
    verifyMagicCode,
    signOut,
    error: null, // We'll handle errors in the components
  };

  return (
    <AuthContext.Provider value={value}>
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
