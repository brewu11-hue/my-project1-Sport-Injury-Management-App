'use client';
import { useState, useEffect, useMemo } from 'react';
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

const useMemoFirebase = (creator, deps) => useMemo(creator, deps);


function useDoc<T extends DocumentData>(
  ref: DocumentReference<T> | null,
  options: UseDocOptions = { listen: true }
) {
  const { user, loading: userLoading } = useUser();
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<FirestoreError | null>(null);

  const memoizedRef = useMemoFirebase(() => ref, [JSON.stringify(ref)]);

  useEffect(() => {
    if (userLoading) {
        setLoading(true);
        return;
    }
    if (!memoizedRef || !user) {
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const unsubscribe = onSnapshot(
      memoizedRef,
      (snapshot: DocumentSnapshot<T>) => {
        if (snapshot.exists()) {
          setData({ id: snapshot.id, ...snapshot.data() } as T);
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
  }, [memoizedRef, user, userLoading]);

  return { data, loading, error };
}

export { useDoc };
