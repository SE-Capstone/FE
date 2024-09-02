import { Navigate } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { LoginPage } = lazyImport(() => import('@/modules/auth/login'), 'LoginPage');
const { ForgotPasswordPage } = lazyImport(
  () => import('@/modules/auth/reset-password'),
  'ForgotPasswordPage'
);
const { ResetPasswordPage } = lazyImport(
  () => import('@/modules/auth/reset-password'),
  'ResetPasswordPage'
);

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
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
    ],
  };
}
