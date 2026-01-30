import api from '@/shared/lib/axios';
export type APIResponse<T> = {
    isSuccess: boolean;
    message: string;
    statusCode: number;
    data: T | null;
};
export type LoginRequest = {
    email: string;
    password: string;
};
export type RegisterRequest = {
    username: string;
    email: string;
    name: string;
    surname: string;
    password: string;
    confirmPassword: string;
};
export type VerifyOtpRequest = {
    userId: string;
    otp: string;
};
export type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
    email: string;
    username: string;
};
export type GoogleAuthUrlResponseDTO = {
    authUrl: string;
};
export async function login(req: LoginRequest): Promise<RefreshTokenResponse> {
    const { data } = await api.post<APIResponse<RefreshTokenResponse>>('/Auth/Login', req);
    if (!data.isSuccess || !data.data)
        throw new Error(data.message);
    return data.data;
}
export async function register(req: RegisterRequest): Promise<{
    id: string;
    email: string;
    username: string;
}> {
    try {
        const { data } = await api.post<APIResponse<{
            id: string;
            email: string;
            username: string;
        }>>('/Account/Register', req);
        if (!data.isSuccess || !data.data)
            throw new Error(data.message);
        return data.data;
    }
    catch (error: any) {
        const msgFromApi = error?.response?.data?.message;
        if (typeof msgFromApi === 'string' && msgFromApi.trim().length > 0) {
            throw new Error(msgFromApi);
        }
        throw error;
    }
}
export async function verifyOtp(req: VerifyOtpRequest): Promise<void> {
    const { data } = await api.post<APIResponse<unknown>>('/Account/verify-otp', req);
    if (!data.isSuccess)
        throw new Error(data.message);
}
export async function getGoogleAuthUrl(): Promise<string> {
    const { data } = await api.get<GoogleAuthUrlResponseDTO>('/oauth/google-auth-url');
    return data.authUrl;
}
