import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { ListRolesPage } = lazyImport(() => import('@/modules/roles/list-role'), 'ListRolesPage');
const { DetailRolePage } = lazyImport(
  () => import('@/modules/roles/detail-role/pages'),
  'DetailRolePage'
);
const { CreateRolePage } = lazyImport(
  () => import('@/modules/roles/list-role/pages/create-role.page'),
  'CreateRolePage'
);

export function rolesRoutes(): RouteObject {
  return {
    path: '/roles',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: <ListRolesPage />,
      },
      {
        path: ':roleId',
        element: <DetailRolePage />,
      },
      {
        path: 'create',
        element: <CreateRolePage />,
      },
    ],
  };
}
