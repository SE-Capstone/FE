import { useCallback } from 'react';

import { useAuthentication } from './use-authentication';

import type { RolesEnum } from '@/configs';

export function useAuthorization() {
  const { currentUser, isAdmin, isLogged } = useAuthentication();

  const checkAccess = useCallback(
    function ({ accessRoles }: { accessRoles: RolesEnum[] }) {
      if (!isLogged) return false;

      if (isAdmin) return true;

      return accessRoles.includes(currentUser?.roleName as RolesEnum);
    },
    [currentUser?.roleName, isAdmin, isLogged]
  );

  return {
    checkAccess,
  };
}
