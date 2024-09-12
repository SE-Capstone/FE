import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { APP_PATHS } from './paths/app.paths';

import { GlobalLoading } from '@/components/elements';
import { useAuthentication } from '@/modules/profile/hooks';

export function PublicRoute() {
  const { isLogged, isLoading } = useAuthentication();

  const location = useLocation();
  const from = location.state?.from?.pathname;

  if (isLogged && location.pathname.startsWith('/auth')) {
    return <Navigate to={APP_PATHS.HOME} replace />;
  }

  if (isLogged) {
    return <Navigate to={from} replace />;
  }

  if (isLogged && isLoading) {
    return <GlobalLoading isLoading={isLoading} />;
  }

  return <Outlet />;
}
