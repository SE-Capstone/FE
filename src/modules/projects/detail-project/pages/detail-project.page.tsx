import { useEffect, useState } from 'react';

import { Button, Container, useDisclosure } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { UpsertProjectWidget } from '../../list-project/widgets';
import { useGetDetailProject } from '../apis/detail-project.api';
import { BaseInformationProjectWidget } from '../widgets';

import type { IUser } from '@/modules/users/list-user/types';

import { CustomTabs, Head, StateHandler } from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { PermissionEnum } from '@/configs';
import { ListIssuePage } from '@/modules/issues/list-issue';
import { IssuesQueryProvider } from '@/modules/issues/list-issue/contexts';
import KanbanWidget from '@/modules/issues/list-issue/widgets/kanban/kanban.widget';
import { ListLabelPage } from '@/modules/labels';
import { useAuthentication } from '@/modules/profile/hooks';
import { ListStatusPage } from '@/modules/statuses';
import { useGetUsersByPermission } from '@/modules/users/list-user/apis/get-user-by-permission.api';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function DetailProjectPage() {
  const disclosureModal = useDisclosure();
  const { permissions } = useAuthentication();
  const { projectId } = useParams();

  const { project, isLoading, isError } = useGetDetailProject({ projectId: projectId || '' });

  const [teamLeads, setTeamLeads] = useState<IUser[]>([]);

  const { users } = useGetUsersByPermission({
    permissionName: PermissionEnum.IS_PROJECT_LEAD,
  });

  useEffect(() => {
    if (JSON.stringify(users) !== JSON.stringify(teamLeads)) {
      setTeamLeads(users);
    }
  }, [users, teamLeads]);

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
            {permissions[PermissionEnum.UPDATE_PROJECT] && (
              <>
                <Button onClick={disclosureModal.onOpen}>Edit</Button>
                <UpsertProjectWidget
                  project={project}
                  teamLeads={teamLeads}
                  isUpdate
                  isOpen={disclosureModal.isOpen}
                  onClose={disclosureModal.onClose}
                />
              </>
            )}
          </LayoutBack>
          <CustomTabs
            tabListProps={{
              bg: 'transparent',
            }}
            tabsData={[
              {
                title: 'Overview',
                link: `${APP_PATHS.listProject}/${projectId}`,
                childrenPanel: (
                  <BaseInformationProjectWidget project={project} permissions={permissions} />
                ),
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
                title: 'Kanban',
                childrenPanel: <KanbanWidget />,
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
