import api from '@/shared/lib/axios';
import type { APIResponse } from './auth.api';
export type SetPasswordRequest = {
    newPassword: string;
    confirmPassword: string;
};
export async function setPassword(req: SetPasswordRequest, token?: string): Promise<void> {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const { data } = await api.post<APIResponse<unknown>>('/Account/set-password', req, config);
    if (!data.isSuccess)
        throw new Error(data.message);
}
export async function sendOtp(): Promise<void> {
    const { data } = await api.post<APIResponse<unknown>>('/Account/send-otp');
    if (!data.isSuccess)
        throw new Error(data.message);
}
export type ForgotPasswordRequest = {
    email: string;
};
export async function forgotPassword(req: ForgotPasswordRequest): Promise<void> {
    try {
        const { data } = await api.post<APIResponse<unknown>>('/Account/forgot-password', req);
        if (!data.isSuccess)
            throw new Error(data.message);
    }
    catch (error: any) {
        const msgFromApi = error?.response?.data?.message;
        if (typeof msgFromApi === 'string' && msgFromApi.trim().length > 0) {
            throw new Error(msgFromApi);
        }
        throw error;
    }
}
export type VerifyForgotPasswordOtpRequest = {
    email: string;
    otp: string;
};
export async function verifyForgotPasswordOtp(req: VerifyForgotPasswordOtpRequest): Promise<void> {
    try {
        const { data } = await api.post<APIResponse<unknown>>('/Account/verify-forgot-otp', req);
        if (!data.isSuccess)
            throw new Error(data.message);
    }
    catch (error: any) {
        const msgFromApi = error?.response?.data?.message;
        if (typeof msgFromApi === 'string' && msgFromApi.trim().length > 0) {
            throw new Error(msgFromApi);
        }
        throw error;
    }
}
export type ChangePasswordWithOtpRequest = {
    otp: string;
    newPassword: string;
    confirmPassword: string;
};
export async function changePasswordWithOtp(req: ChangePasswordWithOtpRequest): Promise<void> {
    const { data } = await api.post<APIResponse<unknown>>('/Account/change-password-with-otp', req);
    if (!data.isSuccess)
        throw new Error(data.message);
}
export type ResetPasswordWithOtpRequest = {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
};
export async function resetPasswordWithOtp(req: ResetPasswordWithOtpRequest): Promise<void> {
    try {
        const { data } = await api.post<APIResponse<unknown>>('/Account/reset-password-with-otp', req);
        if (!data.isSuccess)
            throw new Error(data.message);
    }
    catch (error: any) {
        const msgFromApi = error?.response?.data?.message;
        if (typeof msgFromApi === 'string' && msgFromApi.trim().length > 0) {
            throw new Error(msgFromApi);
        }
        throw error;
    }
}
export type UpdateUsernameRequest = {
    username: string;
};
export async function updateUsername(req: UpdateUsernameRequest): Promise<{
    username: string;
    email: string;
}> {
    const { data } = await api.put<APIResponse<{
        username: string;
        email: string;
    }>>('/Account/username', req);
    if (!data.isSuccess || !data.data)
        throw new Error(data.message);
    return data.data;
}
export type DeleteAccountWithOtpRequest = {
    otp: string;
};
export async function deleteAccountWithOtp(req: DeleteAccountWithOtpRequest): Promise<void> {
    const { data } = await api.post<APIResponse<unknown>>('/Account/delete-with-otp', req);
    if (!data.isSuccess)
        throw new Error(data.message);
}
export type CurrentUserResponse = {
    email: string;
    username: string;
    name?: string | null;
    surname?: string | null;
    createdAt: string;
    logoUrl?: string | null;
};
export async function getMe(): Promise<CurrentUserResponse> {
    const { data } = await api.get<APIResponse<CurrentUserResponse>>('/Account/me');
    if (!data.isSuccess || !data.data)
        throw new Error(data.message);
    return data.data;
}
export type UpdateProfileRequest = {
    name?: string | null;
    surname?: string | null;
};
export async function updateProfile(req: UpdateProfileRequest): Promise<CurrentUserResponse> {
    const { data } = await api.put<APIResponse<CurrentUserResponse>>('/Account/profile', req);
    if (!data.isSuccess || !data.data)
        throw new Error(data.message);
    return data.data;
}
export async function uploadLogo(file: File): Promise<{
    logoUrl: string;
}> {
    const form = new FormData();
    form.append('file', file);
    const { data } = await api.post<APIResponse<{
        logoUrl: string;
    }>>('/Account/logo', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!data.isSuccess || !data.data)
        throw new Error(data.message);
    return data.data;
}
export async function deleteLogo(): Promise<void> {
    const { data } = await api.delete<APIResponse<unknown>>('/Account/logo');
    if (!data.isSuccess)
        throw new Error(data.message);
}
