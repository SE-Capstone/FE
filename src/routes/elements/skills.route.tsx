import { Outlet, type RouteObject } from 'react-router-dom';

import { PermissionCheck } from '../permisstion-check';

import { PermissionEnum } from '@/configs';
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
          <PermissionCheck permissions={[PermissionEnum.GET_SKILL, PermissionEnum.GET_SKILL_USER]}>
            <SkillsQueryProvider>
              <SkillsPage />
            </SkillsQueryProvider>
          </PermissionCheck>
        ),
      },
    ],
  };
}
