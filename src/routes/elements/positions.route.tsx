import { Outlet, type RouteObject } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
import { lazyImport } from '@/libs/utils';
import { PositionsQueryProvider } from '@/modules/positions/contexts';

const { ListPositionPage } = lazyImport(
  () => import('@/modules/positions/pages'),
  'ListPositionPage'
);

export function positionsRoutes(): RouteObject {
  return {
    path: '/positions',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <PermissionCheck permissions={[PermissionEnum.GET_POSITION]}>
            <PositionsQueryProvider>
              <ListPositionPage />
            </PositionsQueryProvider>
          </PermissionCheck>
        ),
      },
    ],
  };
}
