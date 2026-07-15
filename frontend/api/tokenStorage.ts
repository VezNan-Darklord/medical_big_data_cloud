export type AuthTokenPair = {
  accessToken: string;
  refreshToken: string;
};

export const AUTH_EXPIRED_EVENT = 'auth:expired';
export const AUTH_TOKENS_UPDATED_EVENT = 'auth:tokens-updated';

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';
const LEGACY_ACCESS_TOKEN_STORAGE_KEY = 'token';

const getStorage = (): Storage | null => {
  if (typeof localStorage === 'undefined') {
    return null;
  }
  return localStorage;
};

export const getAccessToken = (): string | null => {
  const storage = getStorage();
  if (!storage) {
    return null;
  }

  const accessToken = storage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  if (accessToken) {
    return accessToken;
  }

  const legacyToken = storage.getItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
  if (legacyToken) {
    storage.setItem(ACCESS_TOKEN_STORAGE_KEY, legacyToken);
  }
  return legacyToken;
};

export const getRefreshToken = (): string | null =>
  getStorage()?.getItem(REFRESH_TOKEN_STORAGE_KEY) ?? null;

export const setTokenPair = ({ accessToken, refreshToken }: AuthTokenPair): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
  storage.setItem(REFRESH_TOKEN_STORAGE_KEY, refreshToken);
  storage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
};

export const clearTokenPair = (): void => {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  storage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
  storage.removeItem(LEGACY_ACCESS_TOKEN_STORAGE_KEY);
};
