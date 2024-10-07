import { Navigate } from 'react-router-dom';

import { APP_PATHS } from './paths/app.paths';

import type { PermissionEnum } from '@/configs';

import { useAuthorization } from '@/modules/profile/hooks';

interface AuthorizationRouteProps {
  permissions: PermissionEnum[];
  children: JSX.Element;
}

export function AuthorizationRoute(props: AuthorizationRouteProps) {
  const { permissions, children } = props;
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess({ permissions });

  return canAccess ? children : <Navigate to={APP_PATHS.login} />;
}
