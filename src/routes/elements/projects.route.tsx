import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { ProjectsQueryProvider } from '@/modules/projects/list-project/contexts';

const { ListProjectsPage } = lazyImport(
  () => import('@/modules/projects/list-project'),
  'ListProjectsPage'
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
    ],
  };
}
