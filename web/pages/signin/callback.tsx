import { NextPage } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import useLocalState from '../../components/useLocalState';

const SignInCallbackPage: NextPage = () => {
  const {
    query: { code, error }
  } = useRouter();

  const [token, setToken] = useLocalState('reddit-token', '');

  useEffect(() => {
    if (error) {
      return;
    }

    if (!code) {
      return;
    }

    fetch('/api/resolveToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ code })
    })
      .then((res) => res.json())
      .then(({ accessToken }) => setToken(accessToken));
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
    return <div>Token: {token}</div>;
  }

  // Authentication in progress
  return <div>Authenticating...</div>;
};

export default SignInCallbackPage;
