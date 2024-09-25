import { Navigate, useLocation } from 'react-router-dom';

import { GlobalLoading } from '@/components/elements';
import { useAuthentication } from '@/modules/profile/hooks';

export function ProtectedRoute({ children }: { children: JSX.Element }) {
  const { isLogged, isLoading } = useAuthentication();

  const location = useLocation();

  if (isLoading) {
    return <GlobalLoading isLoading={isLoading} />;
  }

  if (!isLogged) {
    return <Navigate state={{ from: location }} to="/auth" replace />;
  }

  return children;
}
