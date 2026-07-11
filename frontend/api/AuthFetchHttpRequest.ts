import type { ApiRequestOptions } from './core/ApiRequestOptions';
import { ApiError } from './core/ApiError';
import { BaseHttpRequest } from './core/BaseHttpRequest';
import type { CancelablePromise } from './core/CancelablePromise';
import { CancelablePromise as CancelablePromiseImpl } from './core/CancelablePromise';
import type { OpenAPIConfig } from './core/OpenAPI';
import { request as __request } from './core/request';
import type { AuthResponse } from './models/AuthResponse';
import {
    dispatchAuthExpired,
    getAccessToken,
    getAccessTokenExpiresAt,
    getRefreshToken,
    setAuthTokens,
    showAuthExpiredToastOnce,
} from '../src/utils/auth/authStorage';
import toast from 'react-hot-toast';

let refreshInFlight: Promise<boolean> | null = null;

const PROACTIVE_REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
const PROACTIVE_REFRESH_COOLDOWN_MS = 30 * 1000;
let proactiveRefreshCooldownUntil = 0;

const shouldSkipAuthHandling = (options: ApiRequestOptions): boolean => {
    const url = options.url;
    return (
        url === '/api/v1/auth/login' ||
        url === '/api/v1/auth/register' ||
        url === '/api/v1/auth/refresh' ||
        url === '/api/v1/auth/logout'
    );
};

const tryRefreshToken = async (config: OpenAPIConfig): Promise<boolean> => {
    if (refreshInFlight) return refreshInFlight;

    refreshInFlight = (async () => {
        const refreshToken = getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${config.BASE}/api/v1/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({ refresh_token: refreshToken }),
            });

            if (!response.ok) {
                return false;
            }

            const data = (await response.json()) as AuthResponse;
            if (!data?.access_token) {
                return false;
            }

            setAuthTokens({
                accessToken: data.access_token,
                refreshToken: data.refresh_token ?? refreshToken,
                expiresInSeconds: data.expires_in,
            });

            return true;
        } catch {
            return false;
        } finally {
            refreshInFlight = null;
        }
    })();

    return refreshInFlight;
};

const shouldProactivelyRefresh = (): boolean => {
    const accessToken = getAccessToken();
    if (!accessToken) return false;
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;
    const expiresAt = getAccessTokenExpiresAt();
    if (!expiresAt) return false;

    const now = Date.now();
    if (now < proactiveRefreshCooldownUntil) return false;

    return expiresAt - now <= PROACTIVE_REFRESH_THRESHOLD_MS;
};

export class AuthFetchHttpRequest extends BaseHttpRequest {
    constructor(config: OpenAPIConfig) {
        super(config);
    }

    public override request<T>(options: ApiRequestOptions): CancelablePromise<T> {
        return new CancelablePromiseImpl(async (resolve, reject) => {
            try {
                if (!shouldSkipAuthHandling(options) && shouldProactivelyRefresh()) {
                    proactiveRefreshCooldownUntil = Date.now() + PROACTIVE_REFRESH_COOLDOWN_MS;
                    // 提前刷新失败时不立刻清理登录态：让本次请求继续走，若确实 401 再按原逻辑处理。
                    await tryRefreshToken(this.config);
                }

                const result = await __request<T>(this.config, options);
                resolve(result);
            } catch (error) {
                const isUnauthorized = error instanceof ApiError && error.status === 401;
                if (!isUnauthorized || shouldSkipAuthHandling(options)) {
                    reject(error);
                    return;
                }

                const refreshed = await tryRefreshToken(this.config);
                if (!refreshed) {
                    dispatchAuthExpired();
                    reject(error);
                    if (showAuthExpiredToastOnce()) {
                        toast.error('登录已过期，请重新登录！');
                    }
                    return;
                }

                try {
                    const retryResult = await __request<T>(this.config, options);
                    resolve(retryResult);
                } catch (retryError) {
                    reject(retryError);
                }
            }
        });
    }
}