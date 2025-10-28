'use client';

import { createContext, useContext, useMemo } from 'react';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';

// Define the shape of the Firebase context
interface FirebaseContextValue {
  app: FirebaseApp | null;
  auth: Auth | null;
  firestore: Firestore | null;
}

// Create the context with a default value of null
const FirebaseContext = createContext<FirebaseContextValue | null>(null);

// Custom hook to access the Firebase context
export const useFirebase = () => {
  const context = useContext(FirebaseContext);
  if (!context) {
    throw new Error('useFirebase must be used within a FirebaseProvider');
  }
  return context;
};

// Custom hooks for specific Firebase services
export const useFirebaseApp = () => useFirebase().app;
export const useFirestore = () => useFirebase().firestore;
export const useAuth = () => useFirebase().auth;

// Props for the FirebaseProvider component
interface FirebaseProviderProps {
  children: React.ReactNode;
  app: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

// Provider component to make Firebase services available to the app
export function FirebaseProvider({
  children,
  app,
  auth,
  firestore,
}: FirebaseProviderProps) {
  const value = useMemo(
    () => ({
      app,
      auth,
      firestore,
    }),
    [app, auth, firestore]
  );

  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  );
}
