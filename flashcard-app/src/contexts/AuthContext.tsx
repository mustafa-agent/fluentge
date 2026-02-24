import React, { createContext, useContext, useEffect, useState } from 'react';
import * as FirebaseStub from '../lib/firebase-stub';
import { auth, googleProvider, db } from '../lib/firebase';

interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  createdAt: Date;
  isPremium: boolean;
  dailyGoal: number; // minutes per day
  streak: number;
  totalXP: number;
  level: number;
}

interface AuthContextType {
  currentUser: any | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isGuest: boolean;
  getUserId: () => string;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, displayName: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  continueAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);

  // Create or update user profile in Firestore (stubbed for now)
  async function createUserProfile(user: any, additionalData?: any): Promise<UserProfile> {
    // Temporary stub - will be replaced when Firebase is properly installed
    return {
      uid: user?.uid || 'temp-uid',
      email: user?.email || 'temp@example.com',
      displayName: user?.displayName || 'მომხმარებელი',
      photoURL: user?.photoURL,
      createdAt: new Date(),
      isPremium: false,
      dailyGoal: 10,
      streak: 0,
      totalXP: 0,
      level: 1,
      ...additionalData
    };
  }

  // Authentication methods (stubbed for now)
  async function register(email: string, password: string, displayName: string) {
    // Temporary stub - will be replaced when Firebase is properly installed
    console.log('Register attempt:', email, displayName);
    throw new Error('Firebase not yet installed - please complete Firebase setup');
  }

  async function login(email: string, password: string) {
    // Temporary stub - will be replaced when Firebase is properly installed
    console.log('Login attempt:', email);
    throw new Error('Firebase not yet installed - please complete Firebase setup');
  }

  async function loginWithGoogle() {
    // Temporary stub - will be replaced when Firebase is properly installed
    console.log('Google login attempt');
    throw new Error('Firebase not yet installed - please complete Firebase setup');
  }

  async function logout() {
    // Temporary stub - will be replaced when Firebase is properly installed
    setIsGuest(false);
    setCurrentUser(null);
    setUserProfile(null);
  }

  function continueAsGuest() {
    setIsGuest(true);
    setCurrentUser(null);
    setUserProfile(null);
    setLoading(false);
  }

  function getUserId(): string {
    if (isGuest) {
      return 'guest';
    }
    return currentUser?.uid || '';
  }

  useEffect(() => {
    // Temporary stub - will be replaced when Firebase is properly installed
    setLoading(false);
    return () => {};
  }, [isGuest]);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    isGuest,
    getUserId,
    login,
    register,
    loginWithGoogle,
    logout,
    continueAsGuest,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}