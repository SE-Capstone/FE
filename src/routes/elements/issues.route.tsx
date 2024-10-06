import { Outlet, type RouteObject } from 'react-router-dom';

import { lazyImport } from '@/libs/utils';
// import { IssuesQueryProvider } from '@/modules/issues/list-issue/contexts';

// const { ListIssuesPage } = lazyImport(
//   () => import('@/modules/issues/list-issue'),
//   'ListIssuesPage'
// );
const { DetailIssuePage } = lazyImport(
  () => import('@/modules/issues/detail-issue/pages'),
  'DetailIssuePage'
);

export function issuesRoutes(): RouteObject {
  return {
    path: '',
    element: <Outlet />,
    children: [
      // {
      //   index: true,
      //   element: (
      //     <IssuesQueryProvider>
      //       <ListIssuesPage />
      //     </IssuesQueryProvider>
      //   ),
      // },
      {
        path: ':issueId',
        element: <DetailIssuePage />,
      },
    ],
  };
}
