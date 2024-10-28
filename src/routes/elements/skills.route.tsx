import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { SkillsQueryProvider } from '@/modules/skills/contexts';

const { SkillsPage } = lazyImport(() => import('@/modules/skills/pages'), 'SkillsPage');

export function skillsRoutes(): RouteObject {
  return {
    path: '/skills',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <SkillsQueryProvider>
            <SkillsPage />
          </SkillsQueryProvider>
        ),
      },
    ],
  };
}
