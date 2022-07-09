export const formatUrlWithQuery = (url: string, params: { [key: string]: string }) => {
  const [base, search] = url.split('?', 2);

  const searchParams = new URLSearchParams(search);
  Object.keys(params).forEach((key) => {
    searchParams.set(key, params[key]);
  });

  return base + '?' + searchParams.toString();
};
