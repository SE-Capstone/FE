import { Outlet, type RouteObject } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
import { lazyImport } from '@/libs/utils';
import { RolesQueryProvider } from '@/modules/roles/list-role/contexts';

const { ListRolePage } = lazyImport(() => import('@/modules/roles/list-role'), 'ListRolePage');
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
            <RolesQueryProvider>
              <ListRolePage />
            </RolesQueryProvider>
          </PermissionCheck>
        ),
      },
      {
        path: ':roleId',
        element: (
          <PermissionCheck permissions={[PermissionEnum.READ_DETAIL_ROLE]}>
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
