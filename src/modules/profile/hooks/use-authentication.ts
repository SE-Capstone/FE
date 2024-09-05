import { useContext } from 'react';

import { AuthContext } from './auth-context';

export const useAuthentication = () => {
  const context = useContext(AuthContext);

  return context;
};
