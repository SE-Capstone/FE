import { Outlet, type RouteObject } from 'react-router-dom';

import { issuesRoutes } from './issues.route';

import { lazyImport } from '@/libs/utils';
import { ProjectsQueryProvider } from '@/modules/projects/list-project/contexts';

const { ListProjectsPage } = lazyImport(
  () => import('@/modules/projects/list-project'),
  'ListProjectsPage'
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
          <ProjectsQueryProvider>
            <ListProjectsPage />
          </ProjectsQueryProvider>
        ),
      },
      {
        path: ':projectId',
        element: <DetailProjectPage />,
      },
      {
        path: ':projectId/issues',
        element: <Outlet />,
        children: [issuesRoutes()],
      },
      {
        path: ':projectId/edit',
        element: <UpdateProjectPage />,
      },
    ],
  };
}
