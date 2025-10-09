'use client';
import { useState, useEffect } from 'react';
import type {
  DocumentReference,
  DocumentData,
  FirestoreError,
  DocumentSnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface UseDocOptions {
  listen?: boolean;
}

// Function to recursively convert Timestamps to Dates
const convertTimestampsToDates = (data: any): any => {
    if (data && typeof data.toDate === 'function') {
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this logic on the client
    if (!isClient) {
        return;
    }

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
  }, [ref, user, userLoading, isClient]);

  return { data, loading, error };
}

export { useDoc };
