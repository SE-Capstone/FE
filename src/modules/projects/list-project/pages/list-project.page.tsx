import { useEffect, useState } from 'react';

import { Box, Container, Flex, Heading, Text } from '@chakra-ui/react';
import { MdCheck, MdClose } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

import { useProjectsQueryFilterStateContext } from '../contexts';
import { useGetListProjectQuery } from '../hooks/queries';
import { ActionMenuTableProjects, ActionTableProjectsWidget } from '../widgets';

import type { IUser } from '@/modules/users/list-user/types';

import { CustomLink, Head, StateHandler } from '@/components/elements';
import CardComponent from '@/components/elements/card/card';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetUsersByPermission } from '@/modules/users/list-user/apis/get-user-by-permission.api';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListProjectPage() {
  const { permissions } = useAuthentication();
  const { projectsQueryState, resetProjectsQueryState } = useProjectsQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listProject, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListProjectQuery({
      params: projectsQueryState.filters,
    });

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
      <Head title="Projects" />
      <Container maxW="container.2xl" centerContent>
        <ActionTableProjectsWidget teamLeads={teamLeads} />

        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetProjectsQueryState}
        >
          <CardComponent
            data={listProject}
            isLoading={isLoading || isRefetching}
            isError={!!isError}
            currentPage={meta.pageIndex}
            perPage={meta.pageSize}
            totalCount={meta.totalCount}
            onPageChange={handlePaginate}
          >
            {(project) => (
              <>
                <Heading as="h2" color="primary" size="md" noOfLines={2}>
                  <Flex>
                    <Flex flex="1" gap="4" alignItems="center" flexWrap="wrap">
                      <CustomLink
                        to={
                          pathname.includes(APP_PATHS.listProject) &&
                          permissions[PermissionEnum.GET_DETAIL_PROJECT]
                            ? String(project.id)
                            : '#'
                        }
                      >
                        {project.name || ''}
                      </CustomLink>
                    </Flex>
                    <ActionMenuTableProjects project={project} teamLeads={teamLeads} />
                  </Flex>
                </Heading>
                <Text mt={1} fontSize="12px" noOfLines={3}>
                  {project.description}
                </Text>

                <Box mt={5} fontSize="12px" noOfLines={2}>
                  {permissions[PermissionEnum.GET_ALL_PROJECT] && (
                    <Flex alignItems="center">
                      <Text fontSize="13px" mr={1}>
                        Visible:
                      </Text>
                      {project.isVisible ? (
                        <MdCheck size="12px" color="green" />
                      ) : (
                        <MdClose size="12px" color="red" />
                      )}
                    </Flex>
                  )}
                  <Text fontSize="14px">Code: {project.code}</Text>
                </Box>
              </>
            )}
          </CardComponent>
        </StateHandler>
      </Container>
    </>
  );
}
