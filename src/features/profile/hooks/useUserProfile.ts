import { useState, useEffect, useCallback } from 'react';
import type { UserProfileData } from '@/features/profile/components/edit-profile-form';
import { loadUserProfile, saveUserProfile } from '@/features/profile/utils/userProfile';
export function useUserProfile(defaultData?: Partial<UserProfileData>) {
    const [profile, setProfile] = useState<UserProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        try {
            const savedProfile = loadUserProfile();
            if (savedProfile) {
                setProfile(savedProfile);
            }
            else if (defaultData) {
                setProfile(defaultData as UserProfileData);
            }
        }
        catch (err) {
            setError('Failed to load profile');
            console.error('Error loading profile:', err);
        }
        finally {
            setLoading(false);
        }
    }, [defaultData]);
    const updateProfile = useCallback((updates: Partial<UserProfileData>) => {
        try {
            setError(null);
            const updatedProfile = { ...profile, ...updates } as UserProfileData;
            const success = saveUserProfile(updatedProfile);
            if (success) {
                setProfile(updatedProfile);
                return true;
            }
            else {
                setError('Failed to save profile');
                return false;
            }
        }
        catch (err) {
            setError('Failed to update profile');
            console.error('Error updating profile:', err);
            return false;
        }
    }, [profile]);
    const setFullProfile = useCallback((newProfile: UserProfileData) => {
        try {
            setError(null);
            const success = saveUserProfile(newProfile);
            if (success) {
                setProfile(newProfile);
                return true;
            }
            else {
                setError('Failed to save profile');
                return false;
            }
        }
        catch (err) {
            setError('Failed to set profile');
            console.error('Error setting profile:', err);
            return false;
        }
    }, []);
    const clearError = useCallback(() => {
        setError(null);
    }, []);
    return {
        profile,
        loading,
        error,
        updateProfile,
        setFullProfile,
        clearError,
    };
}
