import { Outlet } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { DetailUserPage } from '@/modules/users/detail-user/pages';
import { UsersQueryProvider } from '@/modules/users/list-user/contexts';

const { ListUsersPage } = lazyImport(() => import('@/modules/users/list-user'), 'ListUsersPage');

export function usersRoutes(): RouteObject {
  return {
    path: '/users',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <UsersQueryProvider>
            <ListUsersPage />
          </UsersQueryProvider>
        ),
      },
      {
        path: ':userId',
        element: <DetailUserPage />,
      },
    ],
  };
}
