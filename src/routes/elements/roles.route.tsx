import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { ListRolesPage } = lazyImport(() => import('@/modules/roles/list-role'), 'ListRolesPage');
const { ProtectedRoute } = lazyImport(() => import('../protected-route'), 'ProtectedRoute');

export function rolesRoutes(): RouteObject {
  return {
    path: '/roles',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ListRolesPage />,
      },
      // {
      //   path: ':roleId',
      //   element: <DetailRolePage />,
      // },
    ],
  };
}
