import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { ApplicantsQueryProvider } from '@/modules/applicants/contexts';

const { ListApplicantPage } = lazyImport(
  () => import('@/modules/applicants/pages'),
  'ListApplicantPage'
);

export function applicantsRoutes(): RouteObject {
  return {
    path: '/applicants',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <ApplicantsQueryProvider>
            <ListApplicantPage />
          </ApplicantsQueryProvider>
        ),
      },
    ],
  };
}
