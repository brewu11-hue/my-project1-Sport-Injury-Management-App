'use client';

import { createContext, useContext, ReactNode, useCallback, useMemo } from 'react';
import { collection, addDoc, serverTimestamp, Timestamp, doc, query, orderBy } from 'firebase/firestore';
import { useAuth, useCollection, useFirestore, useUser } from '@/firebase';

export type Treatment = {
  id: string;
  date: Date;
  activity: string;
  notes: string;
};

export type Injury = {
  id:string;
  type: string;
  severity: number; // 1-10
  date: Date;
  treatments?: Treatment[];
  recoveryHistory?: { date: Date; severity: number }[];
  createdAt: Timestamp;
  userId: string;
};

type InjuryDataContextType = {
  injuries: Injury[];
  addInjury: (injury: Pick<Injury, 'type' | 'date' | 'severity'>) => Promise<void>;
  addTreatment: (injuryId: string, treatment: Omit<Treatment, 'id'>) => Promise<void>;
  getInjuryById: (injuryId: string) => Injury | undefined;
  loading: boolean;
};

const InjuryDataContext = createContext<InjuryDataContextType | undefined>(undefined);

export function InjuryDataProvider({ children }: { children: ReactNode }) {
  const firestore = useFirestore();
  const { user } = useUser();

  const injuriesQuery = useMemo(() => {
    if (!firestore || !user?.uid) return null;
    return query(collection(firestore, 'users', user.uid, 'injuries'), orderBy('date', 'desc'));
  }, [firestore, user?.uid]);

  const { data: injuries = [], loading } = useCollection<Injury>(injuriesQuery);

  const addInjury = useCallback(async (injury: Pick<Injury, 'type' | 'date' | 'severity'>) => {
    if (!firestore || !user?.uid) throw new Error("User or Firestore not available");

    const injuriesCollection = collection(firestore, 'users', user.uid, 'injuries');
    await addDoc(injuriesCollection, {
        ...injury,
        userId: user.uid,
        createdAt: serverTimestamp(),
        // Initialize with empty arrays for subcollections in the data model
        treatments: [],
        recoveryHistory: [{ date: injury.date, severity: injury.severity }],
    });
  }, [firestore, user?.uid]);

  const addTreatment = useCallback(async (injuryId: string, treatment: Omit<Treatment, 'id'>) => {
    if (!firestore || !user?.uid) throw new Error("User or Firestore not available");

    const treatmentsCollection = collection(firestore, 'users', user.uid, 'injuries', injuryId, 'treatments');
    await addDoc(treatmentsCollection, {
        ...treatment,
        createdAt: serverTimestamp(),
    });
    // Note: In a real app, you might want to update the injury's severity
    // or recovery history here via a transaction or another doc update.
    // For simplicity, we are omitting that for now. The chart will still
    // reflect history if it is manually updated or handled by another process.
  }, [firestore, user?.uid]);

  const getInjuryById = useCallback((injuryId: string) => {
    return injuries.find(injury => injury.id === injuryId);
  }, [injuries]);

  const value = {
    injuries,
    addInjury,
    addTreatment,
    getInjuryById,
    loading
  };

  return (
    <InjuryDataContext.Provider value={value}>
      {children}
    </InjuryDataContext.Provider>
  );
}

export function useInjuryData() {
  const context = useContext(InjuryDataContext);
  if (!context) {
    throw new Error('useInjuryData must be used within an InjuryDataProvider');
  }
  return context;
}
