import { decodeJWT } from '../lib/token';
export interface UserInfo {
    email: string;
    username: string;
    createdAt?: string;
    logoUrl?: string | null;
    name?: string | null;
    surname?: string | null;
}
export function isAuthenticated(): boolean {
    const accessToken = localStorage.getItem('accessToken');
    return !!accessToken;
}
export function getCurrentUser(): UserInfo | null {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
        try {
            return JSON.parse(userInfo) as UserInfo;
        }
        catch (error) {
            console.error('Error parsing user info:', error);
        }
    }
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
            const email = decodedToken.email ||
                decodedToken.sub ||
                decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
            const username = decodedToken.username ||
                decodedToken.preferred_username ||
                email?.split('@')[0] ||
                'user';
            if (email) {
                const nextUserInfo = { email, username } satisfies UserInfo;
                setCurrentUser(nextUserInfo);
                return nextUserInfo;
            }
        }
    }
    return null;
}
export function setCurrentUser(userInfo: UserInfo): void {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
}
export function logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userInfo');
    window.location.href = '/login';
}
