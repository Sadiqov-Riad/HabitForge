import { setCurrentUser } from '../model/auth';
export type DecodedToken = {
    email?: string;
    sub?: string;
    username?: string;
    preferred_username?: string;
    'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'?: string;
    [key: string]: unknown;
};
export function decodeJWT(token: string): DecodedToken | null {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64)
            .split('')
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''));
        return JSON.parse(jsonPayload) as DecodedToken;
    }
    catch (error) {
        console.error('Error decoding JWT:', error);
        return null;
    }
}
export function captureTokensFromUrl(): void {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('accessToken');
    const refreshToken = params.get('refreshToken');
    if (accessToken && refreshToken) {
        const isNewUserString = params.get('isNewUser');
        const isNewUser = isNewUserString === 'true';
        console.log('Capture Tokens:', { accessToken, isNewUserString, isNewUser });
        const decodedToken = decodeJWT(accessToken);
        if (decodedToken) {
            const email = decodedToken.email ||
                decodedToken.sub ||
                decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'];
            const username = decodedToken.username ||
                decodedToken.preferred_username ||
                email?.split('@')[0] ||
                'user';
            if (isNewUser) {
                sessionStorage.setItem('tempAccessToken', accessToken);
                sessionStorage.setItem('tempRefreshToken', refreshToken);
            }
            else {
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('refreshToken', refreshToken);
                if (email) {
                    setCurrentUser({ email, username });
                }
            }
        }
        window.history.replaceState({}, document.title, window.location.pathname);
        if (isNewUser) {
            console.log('Redirecting to /set-password');
            window.location.href = '/set-password';
        }
        else {
            console.log('Redirecting to /');
            window.location.href = '/';
        }
    }
}
