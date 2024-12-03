import { useEffect, useMemo, useState, useCallback } from 'react';

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
import { useTranslation } from 'react-i18next';
import { FiFilter } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

import { AddNewUserWidget } from './add-new-user.widget';
import { useUsersQueryFilterStateContext } from '../contexts';

import type { IRole } from '@/modules/roles/list-role/types';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { GENDER_OPTIONS, PermissionEnum, USER_STATUS_OPTIONS } from '@/configs';
import { cleanPhoneNumber, phoneNumberAutoFormat } from '@/libs/helpers';
import { BadgeIssue } from '@/modules/issues/list-issue/components';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetRoles } from '@/modules/roles/list-role/apis/get-roles.api';

export function ActionTableUsersWidget() {
  const { t } = useTranslation();
  const { usersQueryState, setUsersQueryFilterState } = useUsersQueryFilterStateContext();
  const { permissions } = useAuthentication();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [roles, setRoles] = useState<IRole[]>([]);
  const [defaultRole, setDefaultRole] = useState<IRole | undefined>(undefined);

  const { roles: listRole } = useGetRoles({
    enabled: !!permissions[PermissionEnum.READ_LIST_ROLE],
  });

  useEffect(() => {
    if (JSON.stringify(roles) !== JSON.stringify(listRole)) {
      setRoles(listRole);
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('roleId')) {
      const role = listRole.find((r) => r.id === params.get('roleId'));
      setDefaultRole(role);
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

  const updateQueryParams = useCallback(
    (key: string, value?: string) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        return params;
      });
    },
    [setSearchParams]
  );

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
        label: t('fields.fullName'),
        default: true,
      },
      {
        value: 'roleId',
        label: t('fields.role'),
        default: searchParams.has('roleId'),
      },
      {
        value: 'phone',
        label: t('fields.phone'),
        default: searchParams.has('phone'),
      },
      {
        value: 'email',
        label: t('fields.email'),
        default: searchParams.has('email'),
      },
      {
        value: 'status',
        label: t('fields.status'),
        default: searchParams.has('status'),
      },
      {
        value: 'gender',
        label: t('fields.gender'),
        default: searchParams.has('gender'),
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  useEffect(() => {
    const defaults = listFilterOptions
      .filter((option) => option.default)
      .map((option) => option.value);

    setSelectedFilters(defaults);
  }, [listFilterOptions]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUsersQueryFilterState({
      ...(params.get('fullName') && { fullName: params.get('fullName') || '' }),
      ...(params.get('roleId') && { roleId: params.get('roleId') || '' }),
      ...(params.get('phone') && { phone: params.get('phone') || '' }),
      ...(params.get('email') && { email: params.get('email') || '' }),
      ...(params.get('status') && { status: Number(params.get('status')) }),
      ...(params.get('gender') && { gender: Number(params.get('gender')) }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                placeholder={`${t('common.enter')} ${t('fields.fullName').toLowerCase()}...`}
                initValue={usersQueryState.filters.fullName || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({ fullName: keyword });
                  updateQueryParams('fullName', keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('email') && (
            <GridItem>
              <SearchInput
                placeholder={`${t('common.enter')} email...`}
                initValue={usersQueryState.filters.email || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({ email: keyword });
                  updateQueryParams('email', keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('phone') && (
            <GridItem>
              <SearchInput
                placeholder={`${t('common.enter')} ${t('fields.phone').toLowerCase()}...`}
                maxLength={12}
                type="number"
                initValue={usersQueryState.filters.phone || ''}
                onHandleSearch={(keyword) => {
                  setUsersQueryFilterState({
                    phone: cleanPhoneNumber(phoneNumberAutoFormat(keyword || '')),
                  });
                  updateQueryParams(
                    'phone',
                    cleanPhoneNumber(phoneNumberAutoFormat(keyword || ''))
                  );
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('gender') && (
            <GridItem>
              <CustomChakraReactSelect
                isSearchable
                size="sm"
                placeholder={`${t('common.filterBy')} ${t('fields.gender').toLowerCase()}`}
                options={GENDER_OPTIONS}
                defaultValue={
                  searchParams.get('gender')
                    ? {
                        label:
                          searchParams.get('gender') === '1'
                            ? 'Male'
                            : searchParams.get('gender') === '2'
                            ? 'Female'
                            : 'Others' || '',
                        value: Number(searchParams.get('gender')) as any,
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    gender: opt?.value ? opt.value : undefined,
                  });
                  updateQueryParams('gender', opt?.value as any);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('status') && (
            <GridItem>
              <CustomChakraReactSelect
                isSearchable
                size="sm"
                placeholder={`${t('common.filterBy')} ${t('fields.status').toLowerCase()}`}
                options={USER_STATUS_OPTIONS}
                defaultValue={
                  searchParams.get('status')
                    ? {
                        label: searchParams.get('status') === '1' ? 'Active' : 'Inactive' || '',
                        value: Number(searchParams.get('status')) as any,
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    status: opt?.value ? opt.value : undefined,
                  });
                  updateQueryParams('status', opt?.value as any);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('roleId') && (
            <GridItem>
              <CustomChakraReactSelect
                key={defaultRole?.id}
                isSearchable
                size="sm"
                placeholder={`${t('common.filterBy')} ${t('fields.role').toLowerCase()}`}
                options={roles.map((role) => ({
                  label: <BadgeIssue content={role.name} colorScheme={role.color} />,
                  value: role.id,
                }))}
                defaultValue={
                  searchParams.get('roleId') && defaultRole
                    ? {
                        label: (
                          <BadgeIssue content={defaultRole.name} colorScheme={defaultRole.color} />
                        ),
                        value: searchParams.get('roleId') || '',
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setUsersQueryFilterState({
                    roleId: opt?.value ? opt.value : undefined,
                  });
                  updateQueryParams('roleId', opt?.value as any);
                }}
              />
            </GridItem>
          )}
        </Grid>
        <Spacer />

        <Menu closeOnSelect={false}>
          <MenuButton as={IconButton} aria-label="Options" icon={<FiFilter />} variant="outline" />
          <MenuList borderColor="#E2E8F0">
            {listFilterOptions.map((option) => (
              <MenuItem key={option.value}>
                <Checkbox
                  w="full"
                  borderColor="gray.300"
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
            <Button leftIcon={<>+</>}>{t('common.create')}</Button>
          </AddNewUserWidget>
        )}
      </HStack>
    </Box>
  );
}
