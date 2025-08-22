"use client";

import { useEffect } from 'react';
import { auth } from '@/config/firebase';

interface GoogleAuthProviderProps {
  children: React.ReactNode;
}

export function GoogleAuthProvider({ children }: GoogleAuthProviderProps) {
  useEffect(() => {
    // Initialize Firebase Auth
    // Firebase is automatically initialized when imported
    console.log('Firebase Auth initialized:', auth);
  }, []);

  return <>{children}</>;
}