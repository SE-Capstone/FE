import { useEffect, useMemo } from 'react';

import { RolesEnum } from '@/configs';
import { clearStoredAuth, getAccessToken } from '@/libs/helpers';
import { useGetCurrentUser } from '@/modules/auth/apis/current-user.api';

export function useAuthentication() {
  const accessToken = getAccessToken();

  const { user, isError, error, ...restGetProfileQuery } = useGetCurrentUser();

  useEffect(() => {
    if (isError) {
      if (error?.code === 401 || error?.statusCode === 401) {
        clearStoredAuth();
      }
    }
  }, [isError, error]);

  const isLogged = !!user && !!accessToken;

  const isAdmin = isLogged && user?.role === RolesEnum.Admin;
  const isStaff = isLogged && user?.role === RolesEnum.Staff;
  const isAgency = isLogged && user?.role === RolesEnum.Agency;

  const isAdminOrStaff = isAdmin || isStaff;

  const role = (user?.role as RolesEnum) || '';

  const currentUserId = user?.id || 0;

  const currentUser = useMemo(() => user, [user]);

  return {
    isLogged,
    isAdmin,
    isStaff,
    isAgency,
    role,
    currentUserId,
    isAdminOrStaff,
    data: user,
    fullName: user?.fullName || '',
    currentUser,
    ...restGetProfileQuery,
  };
}
