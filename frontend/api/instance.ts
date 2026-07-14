import { AuthFetchHttpRequest } from './AuthFetchHttpRequest';
import { medical } from './medical';

const TOKEN_STORAGE_KEY = 'token';

export const getAccessToken = () => {
  if (typeof localStorage === 'undefined') return null;
  return localStorage.getItem(TOKEN_STORAGE_KEY);
};
export const setAccessToken = (token: string) => localStorage.setItem(TOKEN_STORAGE_KEY, token);
export const clearAccessToken = () => localStorage.removeItem(TOKEN_STORAGE_KEY);

let medicalInstance = new medical();

if (typeof window !== 'undefined') {
  medicalInstance = new medical(
    {
      BASE: '/api/v1',
      WITH_CREDENTIALS: false,
      CREDENTIALS: 'include',
      TOKEN: async () => getAccessToken() ?? '',
    },
    AuthFetchHttpRequest,
  );
}

export default medicalInstance;
