import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
import { SkillsQueryProvider } from '@/modules/skills/contexts';

const { ListSkillPage } = lazyImport(() => import('@/modules/skills/pages'), 'ListSkillPage');

export function skillsRoutes(): RouteObject {
  return {
    path: '/skills',
    element: <Outlet />,
    children: [
      {
        index: true,
        element: (
          <SkillsQueryProvider>
            <ListSkillPage />
          </SkillsQueryProvider>
        ),
      },
    ],
  };
}
