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
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiFilter } from 'react-icons/fi';

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
        },
        {
          value: 'endDate',
          label: t('fields.endDate'),
        },
        permissions[PermissionEnum.READ_ALL_PROJECTS] && {
          value: 'isVisible',
          label: `${t('fields.status')} ${t('fields.visible').toLowerCase()}`,
        },
        {
          value: 'status',
          label: `${t('fields.status')} ${t('common.project').toLowerCase()}`,
        },
      ].filter(Boolean),
    [permissions, t]
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
          {selectedFilters.includes('search') && (
            <GridItem colSpan={2}>
              <SearchInput
                placeholder={`${t('common.enter')} ${t('fields.name').toLowerCase()}/${t(
                  'fields.code'
                ).toLowerCase()}`}
                initValue={projectsQueryState.filters.search || ''}
                onHandleSearch={(keyword) => {
                  setProjectsQueryFilterState({ search: keyword });
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
                onChange={(opt) => {
                  setProjectsQueryFilterState({
                    status: opt?.value ? opt.value : undefined,
                  });
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
                onChange={(opt) => {
                  setProjectsQueryFilterState({
                    isVisible: opt?.value ? opt.value === 'true' : undefined,
                  });
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
            <MenuList>
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
