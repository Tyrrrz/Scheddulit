export const getMe = async (accessToken: string) => {
  const url = 'https://oauth.reddit.com/api/v1/me';

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'User-Agent': 'Scheddulit'
    }
  });

  if (!response.ok) {
    throw new Error(
      `Request 'GET ${url}' failed. Status: ${response.status}. Body: '${await response.text()}'.`
    );
  }

  type ResponseBody = {
    id: string;
    name: string;
  };

  const { id, name }: ResponseBody = await response.json();

  return {
    id,
    name
  };
};
