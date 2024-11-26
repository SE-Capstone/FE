import { useMemo } from 'react';

import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetDetailProject } from '../apis/detail-project.api';
import { BaseInformationProjectWidget } from '../widgets';
import { ProjectStatisticPage } from './project-statistic.page';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { PermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { Error403Page } from '@/modules/errors';
import { ListIssuePage } from '@/modules/issues/list-issue';
import { IssuesQueryProvider } from '@/modules/issues/list-issue/contexts';
import { KanbanQueryProvider } from '@/modules/issues/list-issue/contexts/kanban-query-filters.contexts';
import KanbanWidget from '@/modules/issues/list-issue/widgets/kanban/kanban.widget';
import { ListLabelPage } from '@/modules/labels';
import { ListPhasePage } from '@/modules/phases';
import { useAuthentication } from '@/modules/profile/hooks';
import { ListStatusPage } from '@/modules/statuses';
import { APP_PATHS } from '@/routes/paths/app.paths';

const tabMapping = {
  overview: 0,
  label: 1,
  status: 2,
  phase: 3,
  kanban: 4,
  issue: 5,
  statistic: 6,
};

export function DetailProjectPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, _] = useSearchParams();
  const { permissions } = useAuthentication();
  const { project: projectContext } = useProjectContext();
  const { projectId } = useParams();
  const activeTabIndex = useMemo(() => {
    const tab = searchParams.get('tab') || 'overview';
    return tabMapping[tab] ?? 0;
  }, [searchParams]);

  const { project, isLoading, isError } = useGetDetailProject({ projectId: projectId || '' });

  if (!permissions[PermissionEnum.READ_ALL_PROJECTS] && !projectContext?.isVisible) {
    if (!projectContext) {
      // eslint-disable-next-line react/jsx-no-useless-fragment
      return <></>;
    }
    return <Error403Page />;
  }

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
            path={APP_PATHS.listProject}
            title={project?.name}
          >
            {/* eslint-disable-next-line react/jsx-no-useless-fragment */}
            <></>
          </LayoutBack>
          <CustomTabs
            tabListProps={{
              bg: 'transparent',
            }}
            isSelected={activeTabIndex}
            tabsData={[
              {
                title: t('fields.overview'),
                link: `${APP_PATHS.listProject}/${projectId}`,
                childrenPanel: (
                  <BaseInformationProjectWidget project={project} permissions={permissions} />
                ),
              },
              {
                title: i18n.language === 'vi' ? t('common.label') : t('common.labels'),
                childrenPanel: <ListLabelPage />,
              },
              {
                title: i18n.language === 'vi' ? t('common.status') : t('common.statuses'),
                childrenPanel: <ListStatusPage />,
              },
              {
                title: i18n.language === 'vi' ? t('common.phase') : t('common.phases'),
                childrenPanel: <ListPhasePage />,
              },
              {
                title: t('common.kanban'),
                childrenPanel: (
                  <KanbanQueryProvider>
                    <KanbanWidget />
                  </KanbanQueryProvider>
                ),
              },
              {
                title: i18n.language === 'vi' ? t('common.issue') : t('common.issues'),
                childrenPanel: (
                  <IssuesQueryProvider>
                    <ListIssuePage />
                  </IssuesQueryProvider>
                ),
              },
              {
                title: t('common.statistic'),
                childrenPanel: <ProjectStatisticPage project={project} />,
              },
            ].filter(Boolean)}
            onTabChange={() => {}}
          />
        </StateHandler>
      </Container>
    </>
  );
}
