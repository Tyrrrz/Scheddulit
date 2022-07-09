import { NextPage } from 'next';
import { useMemo } from 'react';
import { getAbsoluteUrl, getRedditClientId } from '../../utils/env';
import { formatUrlWithQuery } from '../../utils/url';

const SignInPage: NextPage = () => {
  const authPromptUrl = useMemo(() => {
    const clientId = getRedditClientId();
    if (!clientId) {
      throw new Error('Missing Reddit client ID');
    }

    return formatUrlWithQuery('https://reddit.com/api/v1/authorize', {
      client_id: clientId,
      response_type: 'code',
      redirect_uri: getAbsoluteUrl('/signin/callback'),
      state: Math.random().toString().substring(2),
      duration: 'permanent',
      scope: ['identity', 'submit'].join(' ')
    });
  }, []);

  return (
    <div>
      <a href={authPromptUrl}>Authenticate</a>
    </div>
  );
};

export default SignInPage;
