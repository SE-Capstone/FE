import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';

const { DetailIssuePage } = lazyImport(
  () => import('@/modules/issues/detail-issue/pages'),
  'DetailIssuePage'
);

const { UpsertIssuePage } = lazyImport(
  () => import('@/modules/issues/list-issue/pages'),
  'UpsertIssuePage'
);

export function issuesRoutes(): RouteObject {
  return {
    path: '',
    element: <Outlet />,
    children: [
      {
        path: 'create',
        element: <UpsertIssuePage />,
      },
      {
        path: ':issueId',
        element: <DetailIssuePage />,
      },
      {
        path: ':issueId/edit',
        element: <UpsertIssuePage isUpdate />,
      },
    ],
  };
}
