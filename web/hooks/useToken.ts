import usePersistedState from '~/hooks/usePersistedState';

const useToken = () => {
  return usePersistedState('local', 'token', '');
};

export default useToken;
