'use client';
import { useState, useEffect } from 'react';
import type {
  Query,
  DocumentData,
  FirestoreError,
  QuerySnapshot,
} from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';
import { useUser } from '@/firebase';

interface UseCollectionOptions {
  listen?: boolean;
}

// Function to recursively convert Timestamps to Dates
const convertTimestampsToDates = (data: any): any => {
    // Note: We check for a `toDate` function rather than `instanceof Timestamp`
    // to avoid importing the Timestamp class on the client, which can cause
    // server-side rendering issues in Next.js.
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


function useCollection<T extends DocumentData>(
  query: Query<T> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This effect runs only on the client, ensuring `isClient` is true on the client-side.
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Only run this logic on the client
    if (!isClient) {
      return;
    }

    // Wait until user's auth state is confirmed before doing anything
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
  // We only want to re-run this effect if the query, user, loading status, or client status changes.
  }, [query, user, userLoading, isClient]);

  return { data, loading, error };
}

export { useCollection };
