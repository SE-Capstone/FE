import type { RouteObject } from 'react-router-dom';

import KanbanExample from '@/modules/public/pages/kanban-ex.pages';
import RichTextExample from '@/modules/public/pages/rich-text-ex.pages';
import TransferListExample from '@/modules/public/pages/transfer-list.pages';

export function publicRoutes(): RouteObject {
  return {
    path: '/',
    children: [
      { path: 'kanban', element: <KanbanExample /> },
      { path: 'richtext', element: <RichTextExample /> },
      { path: 'transfer', element: <TransferListExample /> },
    ],
  };
}
