import { Navigate } from 'react-router-dom';

import { APP_PATHS } from './paths/app.paths';

import type { RolesEnum } from '@/configs';

import { useAuthorization } from '@/modules/profile/hooks';

interface AuthorizationRouteProps {
  roles: RolesEnum[];
  children: JSX.Element;
}

export function AuthorizationRoute(props: AuthorizationRouteProps) {
  const { roles, children } = props;
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess({ accessRoles: roles });

  return canAccess ? children : <Navigate to={APP_PATHS.login} />;
}
