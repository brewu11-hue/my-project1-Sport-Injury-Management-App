'use client';
import { useState, useEffect, useMemo } from 'react';
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

const useMemoFirebase = (creator, deps) => useMemo(creator, deps);

function useCollection<T extends DocumentData>(
  query: Query<T> | null,
  options: UseCollectionOptions = { listen: true }
) {
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedQuery = useMemoFirebase(() => query, [JSON.stringify(query)]);

  useEffect(() => {
    if (userLoading) {
      setLoading(true);
      return;
    }
    if (!memoizedQuery || !user) {
        setLoading(false);
        setData([]);
        return;
    }

    setLoading(true);

    const unsubscribe = onSnapshot(
      memoizedQuery,
      (snapshot: QuerySnapshot<T>) => {
        const docs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as T)); // Cast to T, assuming data matches
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
  }, [memoizedQuery, user, userLoading]);

  return { data, loading, error };
}

export { useCollection };
