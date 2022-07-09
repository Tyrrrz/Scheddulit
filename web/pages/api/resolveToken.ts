import { NextApiHandler } from 'next';
import { getAbsoluteUrl, getRedditClientId, getRedditClientSecret } from '../../utils/env';

interface ResolveTokenResponse {
  accessToken: string;
  refreshToken: string;
}

const resolveTokenEndpoint: NextApiHandler<ResolveTokenResponse> = async (req, res) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).end('Method not allowed');
      return;
    }

    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      res.status(400).end('Missing or invalid authentication code');
      return;
    }

    const authResponse = await fetch(`https://www.reddit.com/api/v1/access_token`, {
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
        redirect_uri: getAbsoluteUrl('/signin/callback')
      }).toString()
    });

    if (!authResponse.ok) {
      console.error(await authResponse.text());
      res.status(500).end('Failed to resolve token');
      return;
    }

    const { access_token, refresh_token } = await authResponse.json();

    res.json({
      accessToken: access_token,
      refreshToken: refresh_token
    });
  } catch (err) {
    console.error(err);
    res.status(500).end('Failed to resolve token');
  }
};

export default resolveTokenEndpoint;
