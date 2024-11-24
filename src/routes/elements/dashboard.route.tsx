import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { DashboardPage } = lazyImport(() => import('@/modules/dashboard'), 'DashboardPage');

export function dashboardRoutes(): RouteObject {
  return {
    path: '/',
    element: <Outlet />,
    children: [{ index: true, element: <DashboardPage /> }],
  };
}
