import type { RouteObject } from 'react-router-dom';

import KanbanExample from '@/modules/public/pages/kanban-ex.pages';

export function publicRoutes(): RouteObject {
  return {
    path: '/',
    children: [{ path: 'kanban', element: <KanbanExample /> }],
  };
}
