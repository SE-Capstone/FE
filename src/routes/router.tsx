import type { PropsWithChildren } from 'react';

import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';

import { authRoutes, dashboardRoutes, profileRoutes, publicRoutes } from './elements';
import { applicantsRoutes } from './elements/applicants.route';
import { jobsRoutes } from './elements/jobs.route';
import { positionsRoutes } from './elements/positions.route';
import { projectsRoutes } from './elements/projects.route';
import { rolesRoutes } from './elements/roles.route';
import { skillsRoutes } from './elements/skills.route';
import { usersRoutes } from './elements/users.route';

import { AlertDialogConfirmStore } from '@/components/elements/alert-dialog-confirm-store';
import { LayoutApp } from '@/components/layouts';
import { lazyImport } from '@/libs/utils';

const { GlobalLoading } = lazyImport(() => import('@/components/elements'), 'GlobalLoading');

const { ProtectedRoute } = lazyImport(() => import('./protected-route'), 'ProtectedRoute');

const { ErrorPage } = lazyImport(() => import('@/modules/errors/'), 'ErrorPage');
const { Error404Page } = lazyImport(() => import('@/modules/errors/'), 'Error404Page');
const { Error403Page } = lazyImport(() => import('@/modules/errors'), 'Error403Page');
const { SettingsPage } = lazyImport(() => import('@/modules/settings/pages'), 'SettingsPage');

const allRoutes = createBrowserRouter([
  {
    path: '/',
    errorElement: <ErrorPage />,
    element: (
      <ProtectedRoute>
        <LayoutApp />
      </ProtectedRoute>
    ),
    children: [
      { path: 'settings', element: <SettingsPage /> },
      dashboardRoutes(),
      profileRoutes(),
      usersRoutes(),
      rolesRoutes(),
      projectsRoutes(),
      jobsRoutes(),
      skillsRoutes(),
      applicantsRoutes(),
      positionsRoutes(),
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
