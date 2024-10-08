import { Container, Flex, Heading, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { useProjectsQueryFilterStateContext } from '../contexts';
import { useGetListProjectQuery } from '../hooks/queries';
import { ActionMenuTableProjects, ActionTableProjectsWidget } from '../widgets';

import { CustomLink, Head, StateHandler } from '@/components/elements';
import CardComponent from '@/components/elements/card/card';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListProjectPage() {
  const { permissions } = useAuthentication();
  const { projectsQueryState, resetProjectsQueryState } = useProjectsQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listProject, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListProjectQuery({
      params: projectsQueryState.filters,
    });

  return (
    <>
      <Head title="Projects" />
      <Container maxW="container.2xl" centerContent>
        <ActionTableProjectsWidget />

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
                    <ActionMenuTableProjects project={project} />
                  </Flex>
                </Heading>
                <Text mt={1} fontSize="12px" noOfLines={3}>
                  {project.description}
                </Text>

                <Text mt={5} fontSize="12px" noOfLines={2}>
                  Isvisible: {project.isVisible ? 'Yes' : 'No'}
                  <br />
                  Code: {project.code}
                </Text>
              </>
            )}
          </CardComponent>
        </StateHandler>
      </Container>
    </>
  );
}
