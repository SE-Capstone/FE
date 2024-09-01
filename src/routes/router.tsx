import type { PropsWithChildren } from 'react';

import { createBrowserRouter, Navigate, Outlet, RouterProvider } from 'react-router-dom';

import { authRoutes, dashboardRoutes, profileRoutes, publicRoutes } from './elements';
import { rolesRoutes } from './elements/roles.route';
import { usersRoutes } from './elements/users.route';
import { APP_PATHS } from './paths/app.paths';

import { AlertDialogConfirmStore } from '@/components/elements/alert-dialog-confirm-store';
import { LayoutApp } from '@/components/layouts';
import { lazyImport } from '@/libs/utils';

const { GlobalLoading } = lazyImport(() => import('@/components/elements'), 'GlobalLoading');

const { ProtectedRoute } = lazyImport(() => import('./protected-route'), 'ProtectedRoute');

const { ErrorPage } = lazyImport(() => import('@/modules/errors/'), 'ErrorPage');
const { Error404Page } = lazyImport(() => import('@/modules/errors/'), 'Error404Page');
const { Error403Page } = lazyImport(() => import('@/modules/errors'), 'Error403Page');

const allRoutes = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        {/* <AuthorizationRoute roles={ROLES_ACCESS}> */}
        <LayoutApp />
        {/* </AuthorizationRoute> */}
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to={APP_PATHS.HOME} /> },
      dashboardRoutes(),
      profileRoutes(),
      usersRoutes(),
      rolesRoutes(),
    ],
  },
  {
    path: '/',
    element: <Outlet />,
    children: [publicRoutes()],
  },
  authRoutes(),
  { path: '/unauthorize', element: <Error403Page /> },
  { path: '*', element: <Error404Page /> },
]);

export const AppRouter = ({ children }: PropsWithChildren) => (
  <>
    <RouterProvider router={allRoutes} fallbackElement={<GlobalLoading isLoading />} />
    {children}
    <AlertDialogConfirmStore />
  </>
);
