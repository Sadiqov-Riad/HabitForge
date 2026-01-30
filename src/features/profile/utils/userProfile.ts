import type { UserProfileData } from '@/features/profile/components/edit-profile-form';
const USER_PROFILE_KEY = 'habitforge_user_profile';
export function loadUserProfile(): UserProfileData | null {
    try {
        const saved = localStorage.getItem(USER_PROFILE_KEY);
        if (!saved)
            return null;
        return JSON.parse(saved) as UserProfileData;
    }
    catch (error) {
        console.error('Error loading user profile:', error);
        return null;
    }
}
export function saveUserProfile(profile: UserProfileData): boolean {
    try {
        localStorage.setItem(USER_PROFILE_KEY, JSON.stringify(profile));
        return true;
    }
    catch (error) {
        console.error('Error saving user profile:', error);
        return false;
    }
}
export function clearUserProfile(): boolean {
    try {
        localStorage.removeItem(USER_PROFILE_KEY);
        return true;
    }
    catch (error) {
        console.error('Error clearing user profile:', error);
        return false;
    }
}
