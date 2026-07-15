import { message } from 'antd';
import type { ApiRequestOptions } from './core/ApiRequestOptions';
import { ApiError } from './core/ApiError';
import { BaseHttpRequest } from './core/BaseHttpRequest';
import type { CancelablePromise } from './core/CancelablePromise';
import { CancelablePromise as CancelablePromiseImpl } from './core/CancelablePromise';
import type { OpenAPIConfig } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { ApiLogin } from './models/ApiLogin';
import {
    AUTH_EXPIRED_EVENT,
    AUTH_TOKENS_UPDATED_EVENT,
    clearTokenPair,
    getRefreshToken,
    setTokenPair,
} from './tokenStorage';

const EXPIRY_NOTICE_COOLDOWN_MS = 5000;
let lastExpiredNoticeAt = 0;
let refreshRequest: Promise<boolean> | null = null;

const shouldSkipAuthHandling = (options: ApiRequestOptions): boolean => {
    const url = options.url;
    return url.startsWith('/auth/login')
        || url.startsWith('/auth/register')
        || url.startsWith('/auth/refresh');
};

const notifyAuthExpired = () => {
    const now = Date.now();
    if (now - lastExpiredNoticeAt < EXPIRY_NOTICE_COOLDOWN_MS) {
        return;
    }
    lastExpiredNoticeAt = now;
    message.error('登录状态已过期，请重新登录');
};

const expireAuthentication = () => {
    clearTokenPair();
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent(AUTH_EXPIRED_EVENT));
    }
    notifyAuthExpired();
};

const requestTokenRefresh = (config: OpenAPIConfig): Promise<boolean> => {
    if (refreshRequest) {
        return refreshRequest;
    }

    refreshRequest = (async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
            return false;
        }

        try {
            const response = await __request<ApiLogin>(
                { ...config, TOKEN: undefined },
                {
                    method: 'POST',
                    url: '/auth/refresh',
                    body: { refreshToken },
                    mediaType: 'application/json',
                    errors: {
                        400: 'Invalid refresh token request',
                        401: 'Refresh token is invalid or expired',
                    },
                },
            );
            const tokens = response.data;
            if (!tokens?.accessToken || !tokens.refreshToken) {
                return false;
            }

            setTokenPair({
                accessToken: tokens.accessToken,
                refreshToken: tokens.refreshToken,
            });
            if (typeof window !== 'undefined') {
                window.dispatchEvent(new CustomEvent(AUTH_TOKENS_UPDATED_EVENT));
            }
            return true;
        } catch {
            return false;
        }
    })().finally(() => {
        refreshRequest = null;
    });

    return refreshRequest;
};

export class AuthFetchHttpRequest extends BaseHttpRequest {
    constructor(config: OpenAPIConfig) {
        super(config);
    }

    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        return new CancelablePromiseImpl(async (resolve, reject) => {
            try {
                resolve(await __request<T>(this.config, options));
            } catch (error) {
                if (!(error instanceof ApiError) || error.status !== 401 || shouldSkipAuthHandling(options)) {
                    reject(error);
                    return;
                }

                const refreshed = await requestTokenRefresh(this.config);
                if (!refreshed) {
                    expireAuthentication();
                    reject(error);
                    return;
                }

                try {
                    resolve(await __request<T>(this.config, options));
                } catch (retryError) {
                    if (retryError instanceof ApiError && retryError.status === 401) {
                        expireAuthentication();
                    }
                    reject(retryError);
                }
            }
        });
    }
}
