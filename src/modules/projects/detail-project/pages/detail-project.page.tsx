import { Button, Container } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetDetailProject } from '../apis/detail-project.api';
import { BaseInformationProjectWidget } from '../widgets';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ListIssuePage } from '@/modules/issues/list-issue';
import { IssuesQueryProvider } from '@/modules/issues/list-issue/contexts';
import { ListLabelPage } from '@/modules/labels';
import { ListStatusPage } from '@/modules/statuses';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailProjectPage() {
  const { projectId } = useParams();
  const { project, isLoading, isError } = useGetDetailProject({ projectId: projectId || '' });

  return (
    <>
      <Head title={project?.name} />
      <Container maxW="container.2xl" centerContent>
        <StateHandler showLoader={isLoading} showError={!!isError}>
          <LayoutBack
            display="flex"
            flexDir="row"
            bgColor="transparent"
            justify="space-between"
            alignItems="center"
            py="14px"
            px={0}
            pb={0}
            title={project?.name}
          >
            <Button>Edit</Button>
          </LayoutBack>
          <CustomTabs
            tabListProps={{
              bg: 'transparent',
            }}
            tabsData={[
              {
                title: 'Overview',
                link: `${APP_PATHS.listProject}/${projectId}`,
                childrenPanel: <BaseInformationProjectWidget project={project} />,
              },
              {
                title: 'Labels',
                childrenPanel: <ListLabelPage />,
              },
              {
                title: 'Status',
                childrenPanel: <ListStatusPage />,
              },
              {
                title: 'Issues',
                childrenPanel: (
                  <IssuesQueryProvider>
                    <ListIssuePage />
                  </IssuesQueryProvider>
                ),
              },
            ]}
          />
        </StateHandler>
      </Container>
    </>
  );
}
