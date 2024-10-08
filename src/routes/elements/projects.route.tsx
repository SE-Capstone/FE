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
const { UpdateProjectPage } = lazyImport(
  () => import('@/modules/projects/detail-project/pages'),
  'UpdateProjectPage'
);

export function projectsRoutes(): RouteObject {
  return {
    path: '/projects',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <PermissionCheck permissions={[PermissionEnum.GET_ALL_PROJECT]}>
            <ProjectsQueryProvider>
              <ListProjectPage />
            </ProjectsQueryProvider>
          </PermissionCheck>
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
      {
        path: ':projectId/edit',
        element: (
          <PermissionCheck permissions={[PermissionEnum.UPDATE_PROJECT]}>
            <UpdateProjectPage />
          </PermissionCheck>
        ),
      },
    ],
  };
}
