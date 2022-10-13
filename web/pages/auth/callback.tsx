import useApi from '@/hooks/useApi';
import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { FC, useEffect, useState } from 'react';

const Authentication: FC<{ code: string }> = ({ code }) => {
  const api = useApi();
  const [state, setState] = useState<'busy' | 'ok' | 'error'>('busy');
  const [error, setError] = useState();

  useEffect(() => {
    if (!code) {
      return;
    }

    api
      .auth(code)
      .then(() => setState('ok'))
      .catch((e) => {
        setState('error');
        setError(e);
      });
  }, [code, api, setState]);

  if (state === 'busy') {
    return <div>Authenticating...</div>;
  }

  if (state === 'error') {
    return <div>Authentication error: {error}</div>;
  }

  return <div>Authenticated: {api.token}</div>;
};

const SignInCallbackPage: NextPage = () => {
  const {
    query: { code, error }
  } = useRouter();

  // Error from the authentication flow
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Broken authentication flow
  if (!code) {
    return <div>Invalid query parameters</div>;
  }

  return <Authentication code={typeof code === 'string' ? code : code[0]} />;
};

export default SignInCallbackPage;
