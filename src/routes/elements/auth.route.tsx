import { Navigate } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { LoginPage } = lazyImport(() => import('@/modules/auth/login'), 'LoginPage');

const { PublicRoute } = lazyImport(() => import('../public-route'), 'PublicRoute');

export function authRoutes(): RouteObject {
  return {
    path: '/auth',
    element: <PublicRoute />,
    children: [
      { index: true, element: <Navigate to="login" /> },
      {
        path: 'login',
        element: <LoginPage />,
      },
    ],
  };
}
