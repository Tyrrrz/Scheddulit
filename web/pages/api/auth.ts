import { NextApiHandler } from 'next';
import { getAbsoluteUrl, getRedditClientId, getRedditClientSecret } from '../../utils/env';

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
      redirect_uri: getAbsoluteUrl('/auth/callback')
    }).toString()
  });

  if (!res.ok) {
    throw new Error(`Authentication request failed. Error: ${res.status}.`);
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

const authEndpoint: NextApiHandler<AuthEndpointResponse> = async (req, res) => {
  if (req.method !== 'POST') {
    res.status(405).end('Method not allowed');
    return;
  }

  const { code } = req.body;
  if (!code || typeof code !== 'string') {
    res.status(400).end('Invalid request: missing code');
    return;
  }

  try {
    res.status(200).json(await resolveTokens(code));
  } catch (err) {
    console.error(err);
    res.status(500).end('Failed to authenticate');
  }
};

export default authEndpoint;
