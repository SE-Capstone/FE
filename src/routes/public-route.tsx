import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { GlobalLoading } from '@/components/elements';
import { useAuthentication } from '@/modules/profile/hooks';

export function PublicRoute() {
  const { isLogged, isLoading } = useAuthentication();

  const location = useLocation();
  // const from = location.state?.from?.pathname || APP_PATHS.listShopProfiles;
  const from = location.state?.from?.pathname;

  if (isLogged) {
    return <Navigate to={from} replace />;
  }

  if (isLoading) {
    return <GlobalLoading isLoading={isLoading} />;
  }

  return <Outlet />;
}
