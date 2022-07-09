import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useLocalState from '../../components/useLocalState';

const SignInCallbackPage: NextPage = () => {
  const router = useRouter();
  const [token, setToken] = useLocalState('reddit-token', '');

  const { code, error } = router.query;

  useEffect(() => {
    if (code && !error) {
      setToken(code as string);
    }
  }, [setToken, code, error]);

  // Invalid callback parameters
  if (!code && !error) {
    return <div>Invalid query parameters</div>;
  }

  // Authentication failed
  if (error) {
    return <div>Error: {error}</div>;
  }

  // Authentication completed
  if (token) {
    return <div>Code: {token}</div>;
  }

  // Authentication in progress
  return <div>Authenticating...</div>;
};

export default SignInCallbackPage;
