import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { ProfilePage } = lazyImport(() => import('@/modules/profile'), 'ProfilePage');

const { EditProfilePage } = lazyImport(() => import('@/modules/profile'), 'EditProfilePage');

export function profileRoutes(): RouteObject {
  return {
    path: 'profile',
    element: <Outlet />,
    children: [
      { index: true, element: <ProfilePage /> },
      { path: 'edit', element: <EditProfilePage /> },
    ],
  };
}
