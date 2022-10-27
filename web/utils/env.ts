export const getEnvironment = () => {
  return process.env.NODE_ENV;
};

export const isProduction = () => {
  return getEnvironment() === 'production';
};

export const getBuildId = () => {
  const value = process.env.BUILD_ID;
  if (!value) {
    throw new Error(`Environment variable 'BUILD_ID' is not defined`);
  }

  return value;
};

export const getSiteUrl = (path?: string) => {
  const value = process.env.SITE_URL;
  if (!value) {
    throw new Error(`Environment variable 'SITE_URL' is not defined`);
  }

  if (path) {
    return new URL(path, value).toString();
  }

  return value;
};

export const getRedditClientId = () => {
  const value = process.env.REDDIT_CLIENT_ID;
  if (!value) {
    throw new Error(`Environment variable 'REDDIT_CLIENT_ID' is not defined`);
  }

  return value;
};

export const getRedditClientSecret = () => {
  const value = process.env.REDDIT_CLIENT_SECRET;
  if (!value) {
    throw new Error(`Environment variable 'REDDIT_CLIENT_SECRET' is not defined`);
  }

  return value;
};
