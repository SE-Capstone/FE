import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Grid,
  GridItem,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Spacer,
  Text,
} from '@chakra-ui/react';
import { FiFilter } from 'react-icons/fi';

import { AddNewUserWidget } from './add-new-user.widget';
import { useUsersQueryFilterStateContext } from '../contexts';

import type { IRole } from '@/modules/roles/list-role/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { GENDER_OPTIONS, PermissionEnum, USER_STATUS_OPTIONS } from '@/configs';
import { cleanPhoneNumber, phoneNumberAutoFormat } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetRoles } from '@/modules/roles/list-role/apis/get-roles.api';

export function ActionTableUsersWidget() {
  const { usersQueryState, setUsersQueryFilterState } = useUsersQueryFilterStateContext();
  const { permissions } = useAuthentication();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);

  const { roles: listRole } = useGetRoles({});

  useEffect(() => {
    if (JSON.stringify(roles) !== JSON.stringify(listRole)) {
      setRoles(listRole);
    }
  }, [listRole, roles]);

  const filterMapping = {
    fullName: 'fullName',
    roleId: 'roleId',
    phone: 'phone',
    email: 'email',
    status: 'status',
    gender: 'gender',
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.includes(filter);
      const updatedFilters = isSelected ? prev.filter((f) => f !== filter) : [...prev, filter];

      if (isSelected) {
        setUsersQueryFilterState({ [filterMapping[filter]]: undefined });
      }

      return updatedFilters;
    });
  };

  const listFilterOptions = useMemo(
    () => [
      {
        value: 'fullName',
        label: 'Full name',
        default: true,
      },
      {
        value: 'roleId',
        label: 'Role',
      },
      {
        value: 'phone',
        label: 'Phone',
      },
      {
        value: 'email',
        label: 'Email',
      },
      {
        value: 'status',
        label: 'Status',
      },
      {
        value: 'gender',
        label: 'Gender',
      },
    ],
    []
  );

  useEffect(() => {
    const defaults = listFilterOptions
      .filter((option) => option.default)
      .map((option) => option.value);
    setSelectedFilters(defaults);
  }, [listFilterOptions]);

  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Grid
          w={{
            base: '80%',
            lg: '70%',
            xl: '60%',
          }}
          alignItems="center"
          gap={2}
          templateColumns={{
            base: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
          }}
        >
          {selectedFilters.includes('fullName') && (
            <GridItem colSpan={1}>
              <SearchInput
                placeholder="Enter name..."
                initValue={usersQueryState.filters.fullName || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({ fullName: keyword });
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('email') && (
            <GridItem>
              <SearchInput
                placeholder="Enter email..."
                initValue={usersQueryState.filters.email || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({ email: keyword });
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('phone') && (
            <GridItem>
              <SearchInput
                placeholder="Enter phone..."
                maxLength={12}
                type="number"
                initValue={usersQueryState.filters.phone || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({
                    phone: cleanPhoneNumber(phoneNumberAutoFormat(keyword || '')),
                  });
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('gender') && (
            <GridItem>
              <CustomChakraReactSelect
                isSearchable
                size="sm"
                placeholder="Filter by gender"
                options={GENDER_OPTIONS}
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    gender: opt?.value ? opt.value : undefined,
                  });
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('status') && (
            <GridItem>
              <CustomChakraReactSelect
                isSearchable
                size="sm"
                placeholder="Filter by status"
                options={USER_STATUS_OPTIONS}
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    status: opt?.value ? opt.value : undefined,
                  });
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('roleId') && (
            <GridItem>
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
            </GridItem>
          )}
        </Grid>
        <Spacer />

        <Menu closeOnSelect={false}>
          <MenuButton as={IconButton} aria-label="Options" icon={<FiFilter />} variant="outline" />
          <MenuList>
            {listFilterOptions.map((option) => (
              <MenuItem key={option.value}>
                <Checkbox
                  w="full"
                  isChecked={selectedFilters.includes(option.value)}
                  onChange={() => handleFilterChange(option.value)}
                >
                  <Text>{option.label}</Text>
                </Checkbox>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
        {permissions[PermissionEnum.ADD_USER] && (
          <AddNewUserWidget roles={listRole}>
            <Button leftIcon={<>+</>}>Create</Button>
          </AddNewUserWidget>
        )}
      </HStack>
    </Box>
  );
}
