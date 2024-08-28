import { useEffect, useState } from 'react';

import { Box, Button, HStack, Spacer, Stack } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { AddNewUserWidget } from './add-new-user.widget';
import { useGetRoles } from '../apis/get-roles.api';
import { useUsersQueryFilterStateContext } from '../contexts';

import type { IRole } from '../apis/get-roles.api';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
// import { ModalAddShopStaffWidget } from '@/modules/shop-profiles/widgets/modal-add-shop-staff.widget';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableUsersWidget() {
  const { usersQueryState, setUsersQueryFilterState } = useUsersQueryFilterStateContext();
  const { pathname } = useLocation();

  const isShowFilterUser = pathname.includes(APP_PATHS.listUsers);
  const [roles, setRoles] = useState<IRole[]>([]);

  const { roles: listRole } = useGetRoles({});

  useEffect(() => {
    setRoles(listRole);
  }, [listRole]);

  return (
    <Box p={5} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Stack flexBasis="50%">
          <SearchInput
            placeholder="Enter value..."
            initValue={usersQueryState.filters.phone || ''}
            onHandleSearch={(keyword) => {
              setUsersQueryFilterState({ phone: keyword });
            }}
          />
        </Stack>
        {isShowFilterUser && (
          <>
            <Box flexBasis="30%">
              <CustomChakraReactSelect
                isSearchable
                placeholder="Filter by role"
                options={roles.map((role) => ({
                  label: role.name,
                  value: role.id,
                }))}
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    role: opt?.value ? opt.value : undefined,
                  });
                }}
              />
            </Box>
            <Spacer />
            <AddNewUserWidget>
              <Button leftIcon={<>+</>}>Tạo mới</Button>
            </AddNewUserWidget>
          </>
        )}
        {/* {isShopFilterShopStaff && shopId && <ModalAddShopStaffWidget shopId={shopId} />} */}
      </HStack>
    </Box>
  );
}
