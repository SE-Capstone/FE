import { createContext, useEffect, useMemo, useState } from 'react';

import type { ITokenStorage } from '@/libs/helpers';
import type { ICurrentUserResponse } from '@/modules/auth/types';

import { RolesEnum } from '@/configs';
import { clearStoredAuth, getStoredAuth } from '@/libs/helpers';

export interface IAuthState {
  currentUser: ICurrentUserResponse | null;
  isLogged: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  fullName?: string;
  roleName?: string;
}

const initialState: IAuthState = {
  currentUser: null,
  isLogged: false,
  isLoading: true,
  isAdmin: false,
};

export interface IAuthContext {
  currentUser: ICurrentUserResponse | null;
  isLogged: boolean;
  isLoading: boolean;
  isAdmin: boolean;
  fullName?: string;
  roleName?: string;
  handleLogin: (user: ICurrentUserResponse) => void;
  resetAuthContext: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }) {
  const [authState, setAuthState] = useState<IAuthState>(initialState);

  useEffect(() => {
    const storedAuth = getStoredAuth<ITokenStorage>();
    if (storedAuth) {
      setAuthState({
        currentUser: storedAuth.user,
        isLogged: true,
        isLoading: false,
        isAdmin: storedAuth.user.roleName === RolesEnum.Admin,
        fullName: storedAuth.user.fullName,
        roleName: storedAuth.user.roleName,
      });
    }
  }, []);

  const handleLogin = (user: ICurrentUserResponse) => {
    setAuthState({
      currentUser: user,
      isLogged: true,
      isLoading: false,
      isAdmin: user.roleName === RolesEnum.Admin,
      fullName: user.fullName,
      roleName: user.roleName,
    });
  };

  const resetAuthContext = () => {
    clearStoredAuth();
    setAuthState({
      currentUser: null,
      isLogged: false,
      isLoading: false,
      isAdmin: false,
      fullName: '',
      roleName: undefined,
    });
  };

  const contextValue = useMemo(
    () => ({ ...authState, handleLogin, resetAuthContext }),
    [authState]
  );

  return <AuthContext.Provider value={contextValue}> {children} </AuthContext.Provider>;
}

export { AuthContext };
