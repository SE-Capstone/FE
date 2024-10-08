import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { JobsQueryProvider } from '@/modules/jobs/contexts';

const { ListJobPage } = lazyImport(() => import('@/modules/jobs/pages'), 'ListJobPage');

export function jobsRoutes(): RouteObject {
  return {
    path: '/jobs',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <JobsQueryProvider>
            <ListJobPage />
          </JobsQueryProvider>
        ),
      },
    ],
  };
}
