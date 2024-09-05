import { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';

import type { ICurrentUserResponse } from '@/modules/auth/types';

import { RolesEnum } from '@/configs';
import { getAccessToken, clearStoredAuth } from '@/libs/helpers';
import { useGetCurrentUser } from '@/modules/auth/apis/current-user.api';

type AuthContextType = {
  isLogged: boolean;
  isAdmin: boolean;
  role: string | null;
  fullName: string;
  currentUser: ICurrentUserResponse | null;
  isLoading: boolean;
  isError: boolean;
  resetAuthContext?: () => void;
  handleInitializeLogin?: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isLogged: false,
  isAdmin: false,
  role: null,
  currentUser: null,
  fullName: '',
  isLoading: false,
  isError: false,
});

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState<AuthContextType>({
    isLogged: false,
    isAdmin: false,
    role: null,
    currentUser: null,
    fullName: '',
    isLoading: false,
    isError: false,
  });

  const accessToken = getAccessToken();
  const { user, isError, error } = useGetCurrentUser();

  const resetAuthContext = useCallback(() => {
    clearStoredAuth();
    setAuthState({
      isLogged: false,
      isAdmin: false,
      role: null,
      currentUser: null,
      fullName: '',
      isError: false,
      isLoading: false,
    });
  }, []);

  const handleInitializeLogin = useCallback(() => {
    setAuthState({
      isLogged: true,
      isAdmin: false,
      role: user?.roleName || null,
      currentUser: user || null,
      fullName: user?.fullName || '',
      isError: false,
      isLoading: false,
    });
  }, []);

  useEffect(() => {
    if (accessToken) {
      if (user) {
        const isAdmin = user?.roleName === RolesEnum.Admin;

        // eslint-disable-next-line no-console
        console.log('Logged in Auth context');
        // eslint-disable-next-line no-console
        console.log({
          isLogged: true,
          isAdmin,
          role: user?.roleName,
          currentUser: user,
          fullName: user?.fullName || '',
          isError: false,
          isLoading: false,
        });

        setAuthState({
          isLogged: true,
          isAdmin,
          role: user?.roleName,
          currentUser: user,
          fullName: user?.fullName || '',
          isError: false,
          isLoading: false,
        });
      } else if (isError && (error?.code === 401 || error?.statusCode === 401)) {
        resetAuthContext();
      }
    }
  }, [user, isError, error, accessToken, resetAuthContext]);

  const contextValue = useMemo(
    () => ({
      ...authState,
      resetAuthContext,
      handleInitializeLogin,
    }),
    [authState, resetAuthContext, handleInitializeLogin]
  );

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
}

export { AuthContext };
