import axios from 'axios';
import { globalLoadingStart, globalLoadingStop } from '@/shared/lib/globalLoading';

const rawApiOrigin = (import.meta as any)?.env?.VITE_API_BASE_URL as string | undefined;
const apiOrigin = typeof rawApiOrigin === 'string' ? rawApiOrigin.trim() : '';
const normalizedOrigin = apiOrigin.replace(/\/+$/, '').replace(/\/api$/i, '');
const apiBaseURL = normalizedOrigin ? `${normalizedOrigin}/api` : '/api';
const api = axios.create({
    baseURL: apiBaseURL,
    timeout: 60000,
});
api.interceptors.request.use((config) => {
    const cfgAny = config as any;
    const method = String(config.method ?? 'get').toLowerCase();
    const url = String(config.url ?? '').toLowerCase();
    const isMutation = method === 'post' || method === 'put' || method === 'patch' || method === 'delete';
    const isAiEndpoint = url.includes('/habitai/');
    const isRefreshEndpoint = url.includes('/auth/refresh');
    const shouldShowGlobalLoading = isMutation && !isAiEndpoint && !isRefreshEndpoint;
    if (shouldShowGlobalLoading && !cfgAny.skipGlobalLoading && !cfgAny.__globalLoadingActive) {
        cfgAny.__globalLoadingActive = true;
        globalLoadingStart();
    }
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers = config.headers ?? {};
        (config.headers as Record<string, string>).Authorization = `Bearer ${token}`;
    }
    return config;
});
type APIResponse<T> = {
    isSuccess: boolean;
    message: string;
    statusCode: number;
    data: T | null;
};
type RefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
};
let refreshPromise: Promise<RefreshTokenResponse> | null = null;
async function refreshAccessToken(): Promise<RefreshTokenResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.error('[Token Refresh] No refresh token found');
        throw new Error('No refresh token');
    }
    try {
        const currentAccessToken = localStorage.getItem('accessToken');
        const headers: Record<string, string> = {};
        if (currentAccessToken) {
            headers.Authorization = `Bearer ${currentAccessToken}`;
        }
        const { data } = await api.post<APIResponse<RefreshTokenResponse>>('/Auth/Refresh', { refreshToken }, {
            timeout: 10000,
            headers
        });
        if (!data.isSuccess || !data.data) {
            console.error('[Token Refresh] Refresh failed:', data.message);
            throw new Error(data.message || 'Failed to refresh token');
        }
        console.log('[Token Refresh] Successfully refreshed tokens');
        return data.data;
    }
    catch (error: any) {
        console.error('[Token Refresh] Error:', error?.response?.data || error?.message);
        throw error;
    }
}
api.interceptors.response.use((response) => {
    const cfgAny = response?.config as any;
    if (cfgAny?.__globalLoadingActive) {
        cfgAny.__globalLoadingActive = false;
        globalLoadingStop();
    }
    return response;
}, async (error) => {
    const status = error?.response?.status;
    const originalRequest = error?.config as (typeof error.config & {
        _retry?: boolean;
    }) | undefined;
    const url: string | undefined = originalRequest?.url;
    const isRefreshEndpoint = url && url.toLowerCase().includes('/auth/refresh');
    const willAttemptRefresh = status === 401 && originalRequest && !originalRequest._retry && !isRefreshEndpoint;
    if (!willAttemptRefresh) {
        const cfgAny = originalRequest as any;
        if (cfgAny?.__globalLoadingActive) {
            cfgAny.__globalLoadingActive = false;
            globalLoadingStop();
        }
    }
    if (status !== 401 || !originalRequest) {
        return Promise.reject(error);
    }
    if (originalRequest._retry || isRefreshEndpoint) {
        console.warn('[Token Refresh] Cannot refresh - already retried or is refresh endpoint');
        return Promise.reject(error);
    }
    originalRequest._retry = true;
    console.log('[Token Refresh] Attempting to refresh access token...');
    try {
        refreshPromise ??= refreshAccessToken();
        const tokens = await refreshPromise;
        if (tokens.accessToken) {
            localStorage.setItem('accessToken', tokens.accessToken);
        }
        if (tokens.refreshToken) {
            localStorage.setItem('refreshToken', tokens.refreshToken);
        }
        else {
            console.warn('[Token Refresh] No refresh token in response, keeping existing one');
        }
        console.log('[Token Refresh] Tokens updated, retrying original request');
        originalRequest.headers = originalRequest.headers ?? {};
        (originalRequest.headers as Record<string, string>).Authorization = `Bearer ${tokens.accessToken}`;
        return api(originalRequest);
    }
    catch (refreshError: any) {
        console.error('[Token Refresh] Failed to refresh token:', refreshError?.message);
        const cfgAny = originalRequest as any;
        if (cfgAny?.__globalLoadingActive) {
            cfgAny.__globalLoadingActive = false;
            globalLoadingStop();
        }
        const errorMessage = refreshError?.response?.data?.message || refreshError?.message || '';
        const isInvalidToken = errorMessage.toLowerCase().includes('invalid') ||
            refreshError?.response?.status === 401;
        if (isInvalidToken) {
            console.warn('[Token Refresh] Invalid refresh token detected, but keeping user logged in');
        }
        return Promise.reject(refreshError);
    }
    finally {
        refreshPromise = null;
    }
});
export default api;
