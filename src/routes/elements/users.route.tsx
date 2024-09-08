import { Outlet } from 'react-router-dom';

import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { UsersQueryProvider } from '@/modules/users/list-user/contexts';

const { ListUsersPage } = lazyImport(() => import('@/modules/users/list-user'), 'ListUsersPage');
const { DetailUserPage } = lazyImport(
  () => import('@/modules/users/detail-user/pages'),
  'DetailUserPage'
);
const { ProtectedRoute } = lazyImport(() => import('../protected-route'), 'ProtectedRoute');

export function usersRoutes(): RouteObject {
  return {
    path: '/users',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
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
