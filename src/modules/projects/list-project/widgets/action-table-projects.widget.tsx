import { useEffect, useState } from 'react';

import { Box, Button, HStack, Spacer, Stack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { AddNewProjectWidget } from './add-new-project.widget';
import { useProjectsQueryFilterStateContext } from '../contexts';

import type { IUser } from '@/modules/users/list-user/types';

import { CustomChakraReactSelect } from '@/components/elements';
import { PermissionEnum, PROJECT_STATUS_OPTIONS, PROJECT_VISIBILITY_OPTIONS } from '@/configs';
import { useGetUsersByPermission } from '@/modules/users/list-user/apis/get-user-by-permission.api';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableProjectsWidget() {
  const { setProjectsQueryFilterState } = useProjectsQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterProject = pathname.includes(APP_PATHS.listProject);
  const [teamLeads, setTeamLeads] = useState<IUser[]>([]);

  const { users } = useGetUsersByPermission({
    permissionName: PermissionEnum.IS_PROJECT_LEAD,
  });

  useEffect(() => {
    setTeamLeads(users);
  }, [users]);

  return (
    <Box p={5} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Stack
          flexBasis={{
            base: '100%',
            md: '90%',
            lg: '70%',
            xl: '50%',
          }}
          direction="row"
        >
          <Box flexBasis="60%">
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
          </Box>
          <Box flexBasis="40%">
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
          </Box>
        </Stack>
        {isShowFilterProject && (
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
