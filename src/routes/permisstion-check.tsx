import { Navigate } from 'react-router-dom';

import type { PermissionEnum } from '@/configs';

import { useAuthorization } from '@/modules/profile/hooks';

interface PermissionCheckProps {
  permissions: PermissionEnum[];
  children: JSX.Element;
  forbiddenFallback?: React.ReactNode;
}

export function PermissionCheck(props: PermissionCheckProps) {
  const { permissions, children, forbiddenFallback } = props;
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess({ permissions });

  return canAccess ? children : forbiddenFallback || <Navigate to="/unauthorize" replace />;
}
