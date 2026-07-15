import { AuthFetchHttpRequest } from './AuthFetchHttpRequest';
import { medical } from './medical';
import { getAccessToken } from './tokenStorage';

export { getAccessToken, getRefreshToken, setTokenPair, clearTokenPair } from './tokenStorage';

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
