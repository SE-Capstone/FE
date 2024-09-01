import { Outlet } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { ListRolesPage } = lazyImport(() => import('@/modules/roles/list-role'), 'ListRolesPage');

export function rolesRoutes(): RouteObject {
  return {
    path: '/roles',
    element: <Outlet />,
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
