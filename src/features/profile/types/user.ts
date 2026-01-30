export interface UserStats {
    habitsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    totalDays: number;
}
export interface FullUserData {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    bio: string;
    avatarUrl: string;
    joinDate: string;
    status: string;
    role: string;
    stats: UserStats;
}
export interface EditableUserData {
    username: string;
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    bio: string;
    avatarUrl: string;
}
