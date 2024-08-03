import type { RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { SupportPage } = lazyImport(() => import('@/modules/public/pages'), 'SupportPage');
const { PolicyPage } = lazyImport(() => import('@/modules/public/pages'), 'PolicyPage');
const { ClearDataPersonPage } = lazyImport(
  () => import('@/modules/public/pages'),
  'ClearDataPersonPage'
);

export function publicRoutes(): RouteObject {
  return {
    path: 'public',
    children: [
      { path: 'support', element: <SupportPage /> },
      { path: 'policy', element: <PolicyPage /> },
      {
        path: 'clear-data-person',
        element: <ClearDataPersonPage />,
      },
    ],
  };
}
