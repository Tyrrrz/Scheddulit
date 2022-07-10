import { AuthEndpointResponse } from '../pages/api/auth';
import useLocalState from './useLocalState';

const useApi = () => {
  const [token, setToken] = useLocalState('token', '');

  const post = async (url: string, body: object) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });

    if (!res.ok) {
      throw new Error(`Request 'POST ${url}' failed. Error: ${res.status}.`);
    }

    return await res.json();
  };

  const auth = async (code: string) => {
    const { accessToken }: AuthEndpointResponse = await post('/api/auth', { code });
    setToken(accessToken);
  };

  return {
    token,
    auth
  };
};

export default useApi;
