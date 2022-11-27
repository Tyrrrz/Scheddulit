import { getRedditClientId, getRedditClientSecret } from '~/utils/env';
import { formatUrlWithQuery } from '~/utils/url';

export const getOAuthUrl = (options: {
  state: string;
  callbackUrl: string;
  lifetime?: 'permanent' | 'temporary';
  scopes?: string[];
}) => {
  return formatUrlWithQuery('https://www.reddit.com/api/v1/authorize', {
    client_id: getRedditClientId(),
    response_type: 'code',
    redirect_uri: options.callbackUrl,
    state: options.state,
    duration: options.lifetime || 'permanent',
    scope: (options.scopes || ['identity']).join(' ')
  });
};

export const finishOAuth = async (options: { code: string; callbackUrl: string }) => {
  const url = `https://www.reddit.com/api/v1/access_token`;

  const promptToken = Buffer.from(getRedditClientId() + ':' + getRedditClientSecret()).toString(
    'base64'
  );

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Basic ${promptToken}`
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code: options.code,
      redirect_uri: options.callbackUrl
    }).toString()
  });

  if (!response.ok) {
    throw new Error(
      `Request 'POST ${url}' failed. Status: ${response.status}. Body: '${await response.text()}'.`
    );
  }

  type ResponseBody = {
    access_token: string;
    refresh_token: string;
  };

  const { access_token, refresh_token }: ResponseBody = await response.json();

  return {
    accessToken: access_token,
    refreshToken: refresh_token
  };
};
