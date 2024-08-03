import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { DashboardPage } = lazyImport(() => import('@/modules/dashboard'), 'DashboardPage');

export function dashboardRoutes(): RouteObject {
  return {
    path: '/',
    element: <DashboardPage />,
  };
}
