'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getProfile } from '@/lib/api/profile';
import { resolveWelcomeName } from '@/lib/client/profileDisplay';
import type { UserProfile } from '@/lib/api/types';

type ProfileContextValue = {
  profile: UserProfile | null;
  displayName: string;
  initial: string;
  photoUrl: string | null;
  setProfile: (partial: Partial<UserProfile>) => void;
  markPhotoUploaded: () => void;
  markPhotoRemoved: () => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

// Бекенд віддає has_profile_photo як рядок/булеве; трактуємо акуратно.
function hasPhotoFlag(value: unknown): boolean {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'string') {
    const v = value.trim().toLowerCase();
    return v !== '' && v !== 'false' && v !== '0' && v !== 'none' && v !== 'null';
  }
  return Boolean(value);
}

export function ProfileProvider({
  initial,
  children,
}: {
  initial: UserProfile | null;
  children: React.ReactNode;
}) {
  const [profile, setProfileState] = useState<UserProfile | null>(initial);
  const [photoVersion, setPhotoVersion] = useState(0);
  const fetchedFallback = useRef(false);

  useEffect(() => {
    if (profile || fetchedFallback.current) return;
    fetchedFallback.current = true;
    getProfile()
      .then(setProfileState)
      .catch(() => {
        // лишаємо null — компоненти покажуть фолбек (Player / U)
      });
  }, [profile]);

  const setProfile = useCallback((partial: Partial<UserProfile>) => {
    setProfileState(prev => (prev ? { ...prev, ...partial } : prev));
  }, []);

  const markPhotoUploaded = useCallback(() => {
    setProfileState(prev => (prev ? { ...prev, has_profile_photo: 'true' } : prev));
    setPhotoVersion(Date.now());
  }, []);

  const markPhotoRemoved = useCallback(() => {
    setProfileState(prev => (prev ? { ...prev, has_profile_photo: '' } : prev));
    setPhotoVersion(0);
  }, []);

  const value = useMemo<ProfileContextValue>(() => {
    const displayName = resolveWelcomeName(profile);
    const initialChar = (displayName || 'U').charAt(0).toUpperCase() || 'U';
    const photoUrl = hasPhotoFlag(profile?.has_profile_photo)
      ? `/api/user/profile/photo${photoVersion ? `?v=${photoVersion}` : ''}`
      : null;

    return {
      profile,
      displayName,
      initial: initialChar,
      photoUrl,
      setProfile,
      markPhotoUploaded,
      markPhotoRemoved,
    };
  }, [profile, photoVersion, setProfile, markPhotoUploaded, markPhotoRemoved]);

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useProfile(): ProfileContextValue {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error('useProfile must be used within ProfileProvider');
  }
  return ctx;
}
