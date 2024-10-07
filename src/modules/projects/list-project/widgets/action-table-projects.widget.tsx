import { useEffect, useState } from 'react';

import { Box, Button, Grid, GridItem, HStack, Spacer } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { AddNewProjectWidget } from './add-new-project.widget';
import { useProjectsQueryFilterStateContext } from '../contexts';

import type { IUser } from '@/modules/users/list-user/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { PermissionEnum, PROJECT_STATUS_OPTIONS, PROJECT_VISIBILITY_OPTIONS } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetUsersByPermission } from '@/modules/users/list-user/apis/get-user-by-permission.api';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableProjectsWidget() {
  const { permissions } = useAuthentication();
  const { projectsQueryState, setProjectsQueryFilterState } = useProjectsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterProject = pathname.includes(APP_PATHS.listProject);
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
    <Box p={5} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Grid
          w={{
            base: '80%',
            lg: '70%',
            xl: '60%',
          }}
          gap={2}
        >
          <GridItem colSpan={2}>
            <SearchInput
              placeholder="Enter name/code..."
              initValue={projectsQueryState.filters.search || ''}
              onHandleSearch={(keyword) => {
                setProjectsQueryFilterState({ search: keyword });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              placeholder="Choose status"
              options={PROJECT_STATUS_OPTIONS}
              onChange={(opt) => {
                setProjectsQueryFilterState({
                  status: opt?.value ? opt.value : undefined,
                });
              }}
            />
          </GridItem>
          <GridItem
            colSpan={{
              base: 2,
              md: 1,
            }}
          >
            <CustomChakraReactSelect
              isSearchable={false}
              placeholder="Choose visible status"
              options={PROJECT_VISIBILITY_OPTIONS}
              onChange={(opt) => {
                setProjectsQueryFilterState({
                  isVisible: opt?.value ? opt.value === 'true' : undefined,
                });
              }}
            />
          </GridItem>
        </Grid>
        {isShowFilterProject && permissions[PermissionEnum.ADD_PROJECT] && (
          <>
            <Spacer />
            <AddNewProjectWidget teamLeads={teamLeads}>
              <Button leftIcon={<>+</>}>Create</Button>
            </AddNewProjectWidget>
          </>
        )}
      </HStack>
    </Box>
  );
}
