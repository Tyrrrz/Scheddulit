import { getRedditClientId, getRedditClientSecret, getSiteUrl } from '../../utils/env';
import { post } from '../../utils/server';

const resolveTokens = async (code: string) => {
  const res = await fetch(`https://www.reddit.com/api/v1/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization':
        'Basic ' +
        Buffer.from(getRedditClientId() + ':' + getRedditClientSecret()).toString('base64')
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: getSiteUrl('/auth/callback')
    }).toString()
  });

  if (!res.ok) {
    console.error('Authorization request failed', res);
    throw new Error('Authorization request failed');
  }

  const { access_token, refresh_token } = await res.json();

  return {
    accessToken: access_token,
    refreshToken: refresh_token
  };
};

export type AuthEndpointResponse = {
  accessToken: string;
  refreshToken: string;
};

const authEndpoint = post<AuthEndpointResponse>(async (req, res) => {
  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).end('Missing authorization code');
    return;
  }

  res.status(200).json(await resolveTokens(code));
});

export default authEndpoint;
