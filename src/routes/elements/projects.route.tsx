import { Outlet, type RouteObject } from 'react-router-dom';

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
const { ProtectedRoute } = lazyImport(() => import('../protected-route'), 'ProtectedRoute');

export function projectsRoutes(): RouteObject {
  return {
    path: '/projects',
    element: (
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    ),
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
        path: ':projectId/edit',
        element: <UpdateProjectPage />,
      },
    ],
  };
}
