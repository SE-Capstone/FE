import { Outlet, type RouteObject } from 'react-router-dom';

import { issuesRoutes } from './issues.route';
import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
import { lazyImport } from '@/libs/utils';
import { ProjectsQueryProvider } from '@/modules/projects/list-project/contexts';

const { ListProjectPage } = lazyImport(
  () => import('@/modules/projects/list-project'),
  'ListProjectPage'
);
const { DetailProjectPage } = lazyImport(
  () => import('@/modules/projects/detail-project/pages'),
  'DetailProjectPage'
);

export function projectsRoutes(): RouteObject {
  return {
    path: '/projects',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <ProjectsQueryProvider>
            <ListProjectPage />
          </ProjectsQueryProvider>
        ),
      },
      {
        path: ':projectId',
        element: (
          <PermissionCheck permissions={[PermissionEnum.GET_DETAIL_PROJECT]}>
            <DetailProjectPage />
          </PermissionCheck>
        ),
      },
      {
        path: ':projectId/issues',
        element: <Outlet />,
        children: [issuesRoutes()],
      },
    ],
  };
}
