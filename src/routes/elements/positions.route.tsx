import { Outlet, type RouteObject } from 'react-router-dom';

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
          <PositionsQueryProvider>
            <ListPositionPage />
          </PositionsQueryProvider>
        ),
      },
    ],
  };
}
