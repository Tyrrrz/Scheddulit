import useToken from '~/hooks/useToken';
import { finishOAuth, getOAuthUrl } from '~/lib/reddit/auth';
import { getSiteUrl } from '~/utils/env';
import { GetServerSideProps, NextPage } from 'next';
import { useEffect } from 'react';

type AuthPageParams = {
  code?: string;
  error?: string;
};

type AuthPageProps = {
  token?: string;
};

const selfUrl = getSiteUrl('/auth');

const AuthPage: NextPage<AuthPageProps> = ({ token }) => {
  const [, setToken] = useToken();

  useEffect(() => {
    // Auth callback succeeded
    if (token) {
      setToken(token);
    }
    // Initial request
    else {
      location.href = getOAuthUrl({
        state: '_',
        callbackUrl: selfUrl,
        lifetime: 'permanent',
        scopes: ['identity', 'submit']
      });
    }
  }, [token, setToken]);

  // TODO: redirect to dashboard instead
  if (token) {
    return <div>Token: {token}</div>;
  }

  return <div>Redirecting...</div>;
};

export const getServerSideProps: GetServerSideProps<AuthPageProps> = async ({ query }) => {
  const { code, error } = query as AuthPageParams;

  // Auth callback failed
  if (error) {
    throw new Error(`Auth redirect error: ${error}`);
  }

  // Auth callback succeeded
  if (code) {
    const { accessToken } = await finishOAuth({ code, callbackUrl: selfUrl });

    return {
      props: {
        token: accessToken
      }
    };
  }

  // Initial request
  return {
    props: {}
  };
};

export default AuthPage;
