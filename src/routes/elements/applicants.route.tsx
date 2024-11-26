import { Outlet, type RouteObject } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
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
          <PermissionCheck permissions={[PermissionEnum.GET_APPLICANT]}>
            <ApplicantsQueryProvider>
              <ListApplicantPage />
            </ApplicantsQueryProvider>
          </PermissionCheck>
        ),
      },
    ],
  };
}
