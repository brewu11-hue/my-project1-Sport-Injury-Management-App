'use client';
import { useState, useEffect, useMemo } from 'react';
import type {
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot, Timestamp } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface UseCollectionOptions {
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


function useCollection<T extends DocumentData>(
  query: Query<T> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  useEffect(() => {
    // Wait until user's auth state is confirmed
    if (userLoading) {
      setLoading(true);
      return;
    }
    
    // If no user is logged in, or query is null, stop loading and return empty array.
    if (!query || !user) {
        setData([]);
        setLoading(false);
        return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      query,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => {
          const docData = doc.data();
          const dataWithDates = convertTimestampsToDates(docData);
          return {
            id: doc.id,
            ...dataWithDates,
          } as T;
        });
        setData(docs);
        setLoading(false);
      },
      (err: FirestoreError) => {
        setError(err);
        setLoading(false);
        console.error("Error fetching collection:", err);
      }
    );

    return () => unsubscribe();
  }, [query, user, userLoading]);

  return { data: data ?? [], loading, error };
}

export { useCollection };
