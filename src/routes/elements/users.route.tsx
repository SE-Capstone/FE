import { Outlet } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import type { RouteObject } from 'react-router-dom';

import { PermissionEnum } from '@/configs';
import { lazyImport } from '@/libs/utils';
import { UsersQueryProvider } from '@/modules/users/list-user/contexts';

const { ListUserPage } = lazyImport(() => import('@/modules/users/list-user'), 'ListUserPage');
const { DetailUserPage } = lazyImport(
  () => import('@/modules/users/detail-user/pages'),
  'DetailUserPage'
);

export function usersRoutes(): RouteObject {
  return {
    path: '/users',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <PermissionCheck permissions={[PermissionEnum.GET_LIST_USER]}>
            <UsersQueryProvider>
              <ListUserPage />
            </UsersQueryProvider>
          </PermissionCheck>
        ),
      },
      {
        path: ':userId',
        element: (
          // Todo: fix
          <PermissionCheck permissions={[PermissionEnum.GET_LIST_USER]}>
            <DetailUserPage />
          </PermissionCheck>
        ),
      },
    ],
  };
}
