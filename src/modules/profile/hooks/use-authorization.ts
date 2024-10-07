import { useCallback } from 'react';

import { useAuthentication } from './use-authentication';

import type { PermissionEnum } from '@/configs';

export function useAuthorization() {
  const { permissions: permissionsStore, isLogged, isAdmin } = useAuthentication();

  const checkAccess = useCallback(
    function ({ permissions }: { permissions: PermissionEnum[] }) {
      if (!isLogged) return false;

      if (isAdmin) return true;

      return permissions.some((p) => permissionsStore[p]);
    },
    [isAdmin, isLogged, permissionsStore]
  );

  return {
    checkAccess,
  };
}
