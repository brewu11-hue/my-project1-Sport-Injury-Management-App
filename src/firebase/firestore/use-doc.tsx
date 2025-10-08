'use client';
import { useState, useEffect, useMemo } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
  Timestamp,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface UseDocOptions {
  listen?: boolean;
}

// Function to recursively convert Timestamps to Dates
const convertTimestampsToDates = (data: any): any => {
    if (data instanceof Timestamp) {
        return data.toDate();
    }
    if (Array.isArray(data)) {
        return data.map(item => convertTimestampsToDates(item));
    }
    if (data !== null && typeof data === 'object') {
        const newData: { [key: string]: any } = {};
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(data, key)) {
                newData[key] = convertTimestampsToDates(data[key]);
            }
        }
        return newData;
    }
    return data;
};


function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null,
  options: UseDocOptions = { listen: true }
) {
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // Wait until user's auth state is confirmed
    if (userLoading) {
        setLoading(true);
        return;
    }
    
    // If no user is logged in, or ref is null, stop.
    if (!ref || !user) {
      setLoading(false);
      setData(null);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      ref,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          const docData = snapshot.data();
          const dataWithDates = convertTimestampsToDates(docData);
          setData({ id: snapshot.id, ...dataWithDates } as T);
        } else {
          setData(null);
        }
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching document:", err);
      }
    );

    return () => unsubscribe();
  }, [ref, user, userLoading]);

  return { data, loading, error };
}

export { useDoc };
