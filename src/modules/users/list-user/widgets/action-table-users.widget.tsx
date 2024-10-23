import { useEffect, useState } from 'react';

import { Box, Button, HStack, Spacer, Stack } from '@chakra-ui/react';

import { AddNewUserWidget } from './add-new-user.widget';
import { useUsersQueryFilterStateContext } from '../contexts';

import type { IRole } from '@/modules/roles/list-role/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetRoles } from '@/modules/roles/list-role/apis/get-roles.api';

export function ActionTableUsersWidget() {
  const { usersQueryState, setUsersQueryFilterState } = useUsersQueryFilterStateContext();
  const { permissions } = useAuthentication();

  const [roles, setRoles] = useState<IRole[]>([]);

  const { roles: listRole } = useGetRoles({});

  useEffect(() => {
    if (JSON.stringify(roles) !== JSON.stringify(listRole)) {
      setRoles(listRole);
    }
  }, [listRole, roles]);

  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Stack flexBasis="50%">
          <SearchInput
            placeholder="Enter value..."
            initValue={usersQueryState.filters.fullName || ''}
            onHandleSearch={(keyword) => {
              setUsersQueryFilterState({ fullName: keyword });
            }}
          />
        </Stack>
        <Box flexBasis="30%">
          <CustomChakraReactSelect
            isSearchable
            size="sm"
            placeholder="Filter by role"
            options={roles.map((role) => ({
              label: role.name,
              value: role.id,
            }))}
            onChange={(opt) => {
              setUsersQueryFilterState({
                roleId: opt?.value ? opt.value : undefined,
              });
            }}
          />
        </Box>
        <Spacer />

        {permissions[PermissionEnum.ADD_USER] && (
          <AddNewUserWidget roles={listRole}>
            <Button leftIcon={<>+</>}>Create</Button>
          </AddNewUserWidget>
        )}
      </HStack>
    </Box>
  );
}
