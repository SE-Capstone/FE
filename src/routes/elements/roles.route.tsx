import { Outlet, type RouteObject } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
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
        element: (
          <PermissionCheck permissions={[PermissionEnum.READ_LIST_ROLE]}>
            <ListRolesPage />
          </PermissionCheck>
        ),
      },
      {
        path: ':roleId',
        element: (
          <PermissionCheck permissions={[PermissionEnum.GET_ROLE_DETAIL]}>
            <DetailRolePage />
          </PermissionCheck>
        ),
      },
      {
        path: 'create',
        element: (
          <PermissionCheck permissions={[PermissionEnum.ADD_ROLE]}>
            <CreateRolePage />
          </PermissionCheck>
        ),
      },
    ],
  };
}
