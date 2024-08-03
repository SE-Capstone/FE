import type { RolesEnum } from '@/configs';

import { useAuthorization } from '@/modules/profile/hooks';

interface PermissionCheckProps {
  roles: RolesEnum[];
  children: JSX.Element;
  forbiddenFallback?: React.ReactNode;
}

export function PermissionCheck(props: PermissionCheckProps) {
  const { roles, children, forbiddenFallback } = props;
  const { checkAccess } = useAuthorization();

  const canAccess = checkAccess({ accessRoles: roles });

  return canAccess ? children : forbiddenFallback;
}
