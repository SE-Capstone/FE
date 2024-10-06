import { Outlet } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

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
          <UsersQueryProvider>
            <ListUserPage />
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
