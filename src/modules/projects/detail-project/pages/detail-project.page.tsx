import { useEffect, useState } from 'react';

import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetDetailProject } from '../apis/detail-project.api';
import { BaseInformationProjectWidget } from '../widgets';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { PermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { Error403Page } from '@/modules/errors';
import { ListIssuePage } from '@/modules/issues/list-issue';
import { IssuesQueryProvider } from '@/modules/issues/list-issue/contexts';
import KanbanWidget from '@/modules/issues/list-issue/widgets/kanban/kanban.widget';
import { ListLabelPage } from '@/modules/labels';
import { ListPhasePage } from '@/modules/phases';
import { useAuthentication } from '@/modules/profile/hooks';
import { ListStatusPage } from '@/modules/statuses';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailProjectPage() {
  const { t, i18n } = useTranslation();
  const [searchParams, _] = useSearchParams();
  const { permissions } = useAuthentication();
  const { project: projectContext } = useProjectContext();
  const { projectId } = useParams();
  const [activeTabIndex, setActiveTabIndex] = useState<number>(() =>
    parseInt(localStorage.getItem('activeTabIndex') || '0', 10)
  );

  const getTab = () => {
    const tab = searchParams.get('tab');
    switch (tab) {
      case 'overview':
        setActiveTabIndex(0);
        break;
      case 'label':
        setActiveTabIndex(1);
        break;
      case 'status':
        setActiveTabIndex(2);
        break;
      case 'phase':
        setActiveTabIndex(3);
        break;
      case 'kanban':
        setActiveTabIndex(4);
        break;
      case 'issue':
        setActiveTabIndex(5);
        break;
      default:
        setActiveTabIndex(0);
        break;
    }
  };

  const { project, isLoading, isError } = useGetDetailProject({ projectId: projectId || '' });

  const handleTabChange = (index: number) => {
    setActiveTabIndex(index);
  };

  useEffect(() => {
    getTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                childrenPanel: <KanbanWidget />,
              },
              {
                title: i18n.language === 'vi' ? t('common.issue') : t('common.issues'),
                childrenPanel: (
                  <IssuesQueryProvider>
                    <ListIssuePage />
                  </IssuesQueryProvider>
                ),
              },
            ].filter(Boolean)}
            onTabChange={handleTabChange}
          />
        </StateHandler>
      </Container>
    </>
  );
}
