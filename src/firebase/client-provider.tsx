'use client';

import { useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider } from './provider';

interface FirebaseClientProviderProps {
  children: React.ReactNode;
}

export function FirebaseClientProvider({
  children,
}: FirebaseClientProviderProps) {
  const { app, auth, firestore } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider app={app} auth={auth} firestore={firestore}>
      {children}
    </FirebaseProvider>
  );
}
