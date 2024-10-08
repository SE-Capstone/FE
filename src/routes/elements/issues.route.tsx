import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { DetailIssuePage } = lazyImport(
  () => import('@/modules/issues/detail-issue/pages'),
  'DetailIssuePage'
);

export function issuesRoutes(): RouteObject {
  return {
    path: '',
    element: <Outlet />,
    children: [
      {
        path: ':issueId',
        element: <DetailIssuePage />,
      },
    ],
  };
}
