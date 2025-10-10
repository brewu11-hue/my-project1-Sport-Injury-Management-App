
'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';

const LOCAL_STORAGE_KEY = 'userProfile';

export type Profile = {
  displayName: string;
  email: string;
  photoURL: string;
};

type ProfileContextType = {
  profile: Profile | null;
  updateProfile: (newProfileData: Omit<Profile, 'photoURL'>) => Promise<void>;
  loading: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

const defaultProfile: Profile = {
    displayName: 'Alex Doe',
    email: 'alex.doe@example.com',
    photoURL: 'https://picsum.photos/seed/1/100/100',
}

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedProfile = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProfile) {
        setProfile(JSON.parse(storedProfile));
      } else {
        // If no profile in storage, set the default one
        setProfile(defaultProfile);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(defaultProfile));
      }
    } catch (error) {
      console.error("Failed to read profile from localStorage", error);
      setProfile(defaultProfile);
    }
    setLoading(false);
  }, []);

  const updateProfile = useCallback(async (newProfileData: Omit<Profile, 'photoURL'>) => {
    setLoading(true);
    // In a real app, you might generate a new photoURL based on the new data
    // For now, we'll keep the photoURL consistent.
    const newProfile: Profile = {
        ...newProfileData,
        photoURL: profile?.photoURL || defaultProfile.photoURL,
    }
    
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newProfile));
      setProfile(newProfile);
    } catch (error) {
      console.error("Failed to save profile to localStorage", error);
    } finally {
      setLoading(false);
    }
  }, [profile?.photoURL]);
  

  const value = { profile, updateProfile, loading };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfileData() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfileData must be used within a ProfileProvider');
  }
  return context;
}
