import { useCallback, useEffect, useMemo, useState } from 'react';

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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiFilter } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';

import { UpsertProjectWidget } from './upsert-project.widget';
import { BadgeStatus } from '../../detail-project/components';
import { useProjectsQueryFilterStateContext } from '../contexts';

import { CustomChakraReactSelect, SearchInput } from '@/components/elements';
import { PermissionEnum, PROJECT_STATUS_OPTIONS, PROJECT_VISIBILITY_OPTIONS } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTableProjectsWidget() {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const disclosureModal = useDisclosure();
  const { projectsQueryState, setProjectsQueryFilterState } = useProjectsQueryFilterStateContext();

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const filterMapping = {
    search: 'search',
    isVisible: 'isVisible',
    status: 'status',
    startDate: 'startDate',
    endDate: 'endDate',
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.includes(filter);
      const updatedFilters = isSelected ? prev.filter((f) => f !== filter) : [...prev, filter];

      if (isSelected) {
        setProjectsQueryFilterState({ [filterMapping[filter]]: undefined });
      }

      return updatedFilters;
    });
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

  const listFilterOptions = useMemo(
    () =>
      [
        {
          value: 'search',
          label: `${t('fields.name')}/${t('fields.code').toLowerCase()}`,
          default: true,
        },
        {
          value: 'startDate',
          label: t('fields.startDate'),
          default: searchParams.getAll('startDate').length > 0,
        },
        {
          value: 'endDate',
          label: t('fields.endDate'),
          default: searchParams.getAll('endDate').length > 0,
        },
        permissions[PermissionEnum.READ_ALL_PROJECTS] && {
          value: 'isVisible',
          label: `${t('fields.status')} ${t('fields.visible').toLowerCase()}`,
          default: searchParams.getAll('isVisible').length > 0,
        },
        {
          value: 'status',
          label: `${t('fields.status')} ${t('common.project').toLowerCase()}`,
          default: searchParams.getAll('status').length > 0,
        },
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, t]
  );

  // Set default filters based on URL params and options
  useEffect(() => {
    const defaults = listFilterOptions
      .filter((option) => option.default)
      .map((option) => option.value);

    setSelectedFilters(defaults);
  }, [listFilterOptions]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProjectsQueryFilterState({
      ...(params.get('search') && { search: params.get('search') || '' }),
      ...(params.get('status') && { status: Number(params.get('status')) }),
      ...(params.get('isVisible') &&
        permissions[PermissionEnum.READ_ALL_PROJECTS] && {
          isVisible: params.get('isVisible') === 'true',
        }),
      ...(params.get('startDate') && { startDate: params.get('startDate') || '' }),
      ...(params.get('endDate') && { endDate: params.get('endDate') || '' }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions]);

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
          {selectedFilters.includes('search') && (
            <GridItem colSpan={2}>
              <SearchInput
                placeholder={`${t('common.enter')} ${t('fields.name').toLowerCase()}/${t(
                  'fields.code'
                ).toLowerCase()}`}
                initValue={projectsQueryState.filters.search || ''}
                onHandleSearch={(keyword) => {
                  setProjectsQueryFilterState({ search: keyword });
                  updateQueryParams('search', keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('startDate') && (
            <GridItem colSpan={1}>
              <SearchInput
                placeholder={`${t('common.choose')} ${t('fields.startDate').toLowerCase()}...`}
                initValue={projectsQueryState.filters.startDate || ''}
                type="date"
                onHandleSearch={(keyword) => {
                  setProjectsQueryFilterState({ startDate: keyword });
                  updateQueryParams('startDate', keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('endDate') && (
            <GridItem colSpan={1}>
              <SearchInput
                placeholder={`${t('common.choose')} ${t('fields.endDate').toLowerCase()}...`}
                initValue={projectsQueryState.filters.endDate || ''}
                type="date"
                onHandleSearch={(keyword) => {
                  setProjectsQueryFilterState({ endDate: keyword });
                  updateQueryParams('endDate', keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('status') && (
            <GridItem colSpan={selectedFilters.includes('isVisible') ? 1 : 2}>
              <CustomChakraReactSelect
                isSearchable={false}
                size="sm"
                placeholder={`${t('common.choose')} ${t('fields.status').toLowerCase()} ${t(
                  'common.project'
                ).toLowerCase()}`}
                options={PROJECT_STATUS_OPTIONS.map((s) => ({
                  label: <BadgeStatus status={s} />,
                  value: s,
                }))}
                defaultValue={
                  searchParams.getAll('status').length > 0
                    ? {
                        label: <BadgeStatus status={searchParams.getAll('status')[0] as any} />,
                        value: Number(searchParams.getAll('status')[0]) as any,
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setProjectsQueryFilterState({
                    status: opt?.value || undefined,
                  });
                  updateQueryParams('status', opt?.value as any);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('isVisible') && (
            <GridItem colSpan={1}>
              <CustomChakraReactSelect
                isSearchable={false}
                size="sm"
                placeholder={`${t('common.choose')} ${t('fields.status').toLowerCase()} ${t(
                  'fields.visible'
                ).toLowerCase()}`}
                options={PROJECT_VISIBILITY_OPTIONS}
                defaultValue={
                  searchParams.getAll('isVisible').length > 0
                    ? {
                        label: (searchParams.getAll('isVisible')[0] === 'true'
                          ? 'Visible'
                          : 'Invisible') as any,
                        value: searchParams.getAll('isVisible')[0],
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setProjectsQueryFilterState({
                    isVisible: opt?.value === 'true',
                  });
                  updateQueryParams('isVisible', opt?.value);
                }}
              />
            </GridItem>
          )}
        </Grid>

        <Box display="flex" gap={2}>
          <Menu closeOnSelect={false}>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<FiFilter />}
              variant="outline"
            />
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
          {permissions[PermissionEnum.ADD_PROJECT] && (
            <>
              <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
                {t('common.create')}
              </Button>
              <UpsertProjectWidget
                isOpen={disclosureModal.isOpen}
                onClose={disclosureModal.onClose}
              />
            </>
          )}
        </Box>
      </HStack>
    </Box>
  );
}
