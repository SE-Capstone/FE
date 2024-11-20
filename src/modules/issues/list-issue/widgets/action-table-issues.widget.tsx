import { useCallback, useEffect, useMemo, useState } from 'react';

import DropdownMenu, {
  DropdownItemCheckbox,
  DropdownItemCheckboxGroup,
} from '@atlaskit/dropdown-menu';
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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FiFilter } from 'react-icons/fi';
import { Link, useSearchParams } from 'react-router-dom';

import { AddNewIssueWidget } from './add-new-issue.widget';
import { useGetProjectMembers } from '../apis/get-list-filter-member.api';
import { BadgeIssue, PriorityIssue } from '../components';
import { UserWithAvatar } from '../components/user-with-avatar';
import { useIssuesQueryFilterStateContext } from '../contexts';

import type { ILabel } from '@/modules/labels/types';
import type { IPhase } from '@/modules/phases/types';
import type { ProjectMember } from '@/modules/projects/list-project/types';
import type { IStatus } from '@/modules/statuses/types';

import {
  CustomChakraReactSelect,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
  SearchInput,
} from '@/components/elements';
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTableIssuesWidget({
  listLabel,
  listPhase,
  listStatus,
  projectId,
}: {
  listLabel: ILabel[];
  listStatus: IStatus[];
  listPhase: IPhase[];
  projectId: string;
}) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const [searchParams, setSearchParams] = useSearchParams();
  const [labelChecked, setLabelChecked] = useState<string[]>(searchParams.getAll('labelIds') || []);
  const [phaseChecked, setPhaseChecked] = useState<string[]>(searchParams.getAll('phaseIds') || []);
  const [assigneeChecked, setAssigneeChecked] = useState<string[]>(
    searchParams.getAll('assigneeIds') || []
  );
  const [statusChecked, setStatusChecked] = useState<string[]>(
    searchParams.getAll('statusIds') || []
  );
  const [members, setMembers] = useState<ProjectMember[]>([]);

  // Update filters in query params
  const updateQueryParams = useCallback(
    (key: string, values?: string[], value?: string) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);

        params.set('tab', 'issue');

        if (values) {
          if (values.length > 0) {
            params.delete(key);
            values.forEach((val, i) => (i === 0 ? params.set(key, val) : params.append(key, val)));
          } else {
            params.delete(key);
          }
        } else if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }

        return params;
      });
    },
    [setSearchParams]
  );

  const { issuesQueryState, setIssuesQueryFilterState } = useIssuesQueryFilterStateContext();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const { listMember } = useGetProjectMembers({
    projectId,
  });

  useEffect(() => {
    if (listMember && JSON.stringify(listMember) !== JSON.stringify(members)) {
      const updatedMembers = listMember.map((member) => ({
        id: member.id,
        fullName: '',
        avatar: member.avatar,
        userName:
          currentUser?.id === member.id
            ? `${member.userName} (${t('common.me')})`
            : member.userName,
      }));

      const currentUserMember = !updatedMembers.find((mem) => mem.id === currentUser?.id) && {
        id: currentUser?.id || '',
        fullName: currentUser?.fullName || '',
        userName: `${currentUser?.userName} (${t('common.me')})` || '',
        roleName: currentUser?.roleName || '',
        positionName: currentUser?.positionName || '',
        avatar: currentUser?.avatar || '',
      };

      if (currentUserMember) {
        updatedMembers.unshift(currentUserMember);
      }
      setMembers(updatedMembers);
    }
  }, [listMember, currentUser, t, members]);

  const toggle = useCallback(
    (name: string, field: 'phase' | 'label' | 'assignee' | 'status') => {
      if (field === 'label') {
        setLabelChecked((prev) => {
          const updated = prev.includes(name)
            ? prev.filter((item) => item !== name)
            : [...prev, name];
          updateQueryParams('labelIds', updated); // Update URL after state
          return updated;
        });
      }
      if (field === 'phase') {
        setPhaseChecked((prev) => {
          const updated = prev.includes(name)
            ? prev.filter((item) => item !== name)
            : [...prev, name];
          updateQueryParams('phaseIds', updated);
          return updated;
        });
      }
      if (field === 'status') {
        setStatusChecked((prev) => {
          const updated = prev.includes(name)
            ? prev.filter((item) => item !== name)
            : [...prev, name];
          updateQueryParams('statusIds', updated);
          return updated;
        });
      }
      if (field === 'assignee') {
        setAssigneeChecked((prev) => {
          const updated = prev.includes(name)
            ? prev.filter((item) => item !== name)
            : [...prev, name];
          updateQueryParams('assigneeIds', updated);
          return updated;
        });
      }
    },
    [updateQueryParams]
  );

  useEffect(() => {
    setIssuesQueryFilterState({
      labelIds: labelChecked,
      phaseIds: phaseChecked,
      statusIds: statusChecked,
      assigneeIds: assigneeChecked,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [labelChecked, phaseChecked, statusChecked, assigneeChecked]);

  const filterMapping = {
    title: 'title',
    priority: 'priority',
    assigneeIds: 'assigneeIds',
    reporterId: 'reporterId',
    statusIds: 'statusIds',
    labelIds: 'labelIds',
    phaseIds: 'phaseIds',
    startDate: 'startDate',
    dueDate: 'dueDate',
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilters((prev) => {
      const isSelected = prev.includes(filter);
      const updatedFilters = isSelected ? prev.filter((f) => f !== filter) : [...prev, filter];

      if (isSelected) {
        setIssuesQueryFilterState({ [filterMapping[filter]]: undefined });
        if (filter === 'labelIds') {
          setLabelChecked([]);
        }
        if (filter === 'phaseIds') {
          setPhaseChecked([]);
        }
        if (filter === 'assigneeIds') {
          setAssigneeChecked([]);
        }
        if (filter === 'statusIds') {
          setStatusChecked([]);
        }
      }

      return updatedFilters;
    });
  };

  const listFilterOptions = useMemo(
    () =>
      [
        {
          value: 'title',
          label: t('fields.title'),
          default: true,
        },
        {
          value: 'priority',
          label: t('fields.priority'),
          default: searchParams.getAll('priority').length > 0,
        },
        {
          value: 'assigneeIds',
          label: t('fields.assignee'),
          default: assigneeChecked.length > 0,
        },
        {
          value: 'reporterId',
          label: t('fields.reporter'),
          default: searchParams.getAll('reporterId').length > 0,
        },
        {
          value: 'statusIds',
          label: t('fields.status'),
          default: statusChecked.length > 0,
        },
        {
          value: 'labelIds',
          label: t('common.label'),
          default: labelChecked.length > 0,
        },
        {
          value: 'phaseIds',
          label: t('common.phase'),
          default: phaseChecked.length > 0,
        },
        {
          value: 'startDate',
          label: t('fields.startDate'),
          default: searchParams.getAll('startDate').length > 0,
        },
        {
          value: 'dueDate',
          label: t('fields.dueDate'),
          default: searchParams.getAll('dueDate').length > 0,
        },
      ].filter(Boolean),
      // eslint-disable-next-line react-hooks/exhaustive-deps
    [t]
  );

  useEffect(() => {
    const defaults = listFilterOptions
      .filter((option) => option.default)
      .map((option) => option.value);
    setSelectedFilters(defaults);
  }, [listFilterOptions]);

  const customComponents = useMemo(
    () => ({
      Option: (props) => CustomOptionComponentChakraReactSelect(props, 'sm'),
      SingleValue: (props) => CustomSingleValueComponentChakraReactSelect(props, false),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

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
          {selectedFilters.includes('title') && (
            <GridItem colSpan={2}>
              <SearchInput
                placeholder={`${t('common.enter')} ${t('fields.title').toLowerCase()}...`}
                initValue={issuesQueryState.filters.title || searchParams.getAll('title')[0] || ''}
                onHandleSearch={(keyword) => {
                  setIssuesQueryFilterState({ title: keyword });
                  updateQueryParams('title', undefined, keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('priority') && (
            <GridItem colSpan={1}>
              <CustomChakraReactSelect
                isSearchable={false}
                size="sm"
                placeholder={`${t('common.choose')} ${t('fields.priority').toLowerCase()}`}
                options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                  label: <PriorityIssue priority={value} />,
                  value,
                }))}
                defaultValue={
                  searchParams.getAll('priority').length > 0
                    ? {
                        label: (
                          <PriorityIssue
                            priority={Number(searchParams.getAll('priority')[0]) as any}
                          />
                        ),
                        value: searchParams.getAll('priority')[0] as any,
                      }
                    : undefined
                }
                onChange={(opt) => {
                  setIssuesQueryFilterState({
                    priority: opt?.value ? opt.value : undefined,
                  });
                  updateQueryParams('priority', undefined, opt?.value as any);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('reporterId') && (
            <GridItem colSpan={1}>
              <CustomChakraReactSelect
                isSearchable={false}
                size="sm"
                placeholder={`${t('common.choose')} ${t('fields.reporter').toLowerCase()}`}
                options={members.map((member) => ({
                  label: member.userName,
                  value: member.id,
                  image: member.avatar,
                }))}
                defaultValue={
                  searchParams.getAll('reporterId').length > 0
                    ? {
                        label:
                          members.find((m) => m.id === searchParams.getAll('reporterId')[0])
                            ?.userName || '',
                        value: searchParams.getAll('reporterId')[0],
                        image: members.find((m) => m.id === searchParams.getAll('reporterId')[0])
                          ?.avatar,
                      }
                    : undefined
                }
                components={customComponents}
                onChange={(opt) => {
                  setIssuesQueryFilterState({
                    reporterId: opt?.value ? opt.value : undefined,
                  });
                  updateQueryParams('reporterId', undefined, opt?.value as any);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('startDate') && (
            <GridItem colSpan={1}>
              <SearchInput
                w="full"
                placeholder={`${t('common.choose')} ${t('fields.startDate').toLowerCase()}...`}
                initValue={issuesQueryState.filters.startDate || ''}
                type="date"
                onHandleSearch={(keyword) => {
                  setIssuesQueryFilterState({ startDate: keyword });
                  updateQueryParams('startDate', undefined, keyword);
                }}
              />
            </GridItem>
          )}
          {selectedFilters.includes('dueDate') && (
            <GridItem colSpan={1}>
              <SearchInput
                w="full"
                placeholder={`${t('common.choose')} ${t('fields.dueDate').toLowerCase()}...`}
                initValue={issuesQueryState.filters.dueDate || ''}
                type="date"
                onHandleSearch={(keyword) => {
                  setIssuesQueryFilterState({ dueDate: keyword });
                  updateQueryParams('dueDate', undefined, keyword);
                }}
              />
            </GridItem>
          )}
          <GridItem colSpan={2} className="parent-atlaskit-dropdown">
            <Box gap={2} display="flex" alignItems="center">
              {selectedFilters.includes('labelIds') && (
                <DropdownMenu
                  trigger={`${t('common.label')} ${
                    labelChecked.length > 0 ? `+${labelChecked.length}` : ''
                  } `}
                  shouldRenderToParent
                >
                  <DropdownItemCheckboxGroup id="actions">
                    {listLabel.map((label, index) => (
                      <DropdownItemCheckbox
                        key={index}
                        id="labelIds"
                        isSelected={labelChecked.includes(label.id)}
                        onClick={(_) => toggle(label.id, 'label')}
                      >
                        {label.title}
                      </DropdownItemCheckbox>
                    ))}
                  </DropdownItemCheckboxGroup>
                </DropdownMenu>
              )}
              {selectedFilters.includes('phaseIds') && (
                <DropdownMenu
                  trigger={`${t('common.phase')} ${
                    phaseChecked.length > 0 ? `+${phaseChecked.length}` : ''
                  } `}
                  shouldRenderToParent
                >
                  <DropdownItemCheckboxGroup id="actions2">
                    {listPhase.map((phase, index) => (
                      <DropdownItemCheckbox
                        key={index}
                        id="phaseIds"
                        isSelected={phaseChecked.includes(phase.id)}
                        onClick={(_) => toggle(phase.id, 'phase')}
                      >
                        {phase.title}
                      </DropdownItemCheckbox>
                    ))}
                  </DropdownItemCheckboxGroup>
                </DropdownMenu>
              )}
              {selectedFilters.includes('assigneeIds') && (
                <DropdownMenu
                  trigger={`${t('fields.assignee')} ${
                    assigneeChecked.length > 0 ? `+${assigneeChecked.length}` : ''
                  } `}
                  shouldRenderToParent
                >
                  <DropdownItemCheckboxGroup id="actions3">
                    {members.map((assignee, index) => (
                      <DropdownItemCheckbox
                        key={index}
                        id="assigneeIds"
                        isSelected={assigneeChecked.includes(assignee.id)}
                        onClick={(_) => toggle(assignee.id, 'assignee')}
                      >
                        <UserWithAvatar
                          image={assignee?.avatar || ''}
                          size2="sm"
                          label={assignee?.userName || ''}
                        />
                      </DropdownItemCheckbox>
                    ))}
                  </DropdownItemCheckboxGroup>
                </DropdownMenu>
              )}
              {selectedFilters.includes('statusIds') && (
                <DropdownMenu
                  trigger={`${t('common.status')} ${
                    statusChecked.length > 0 ? `+${statusChecked.length}` : ''
                  } `}
                  shouldRenderToParent
                >
                  <DropdownItemCheckboxGroup id="actions5">
                    {listStatus.map((status, index) => (
                      <DropdownItemCheckbox
                        key={index}
                        id="statusIds"
                        isSelected={statusChecked.includes(status.id)}
                        onClick={(_) => toggle(status.id, 'status')}
                      >
                        <BadgeIssue content={status.name} colorScheme={status.color} />
                      </DropdownItemCheckbox>
                    ))}
                  </DropdownItemCheckboxGroup>
                </DropdownMenu>
              )}
            </Box>
          </GridItem>
        </Grid>

        <Box display="flex" gap={2} alignItems="center">
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
          <AddNewIssueWidget>
            <Button leftIcon={<>+</>}>{t('common.create')}</Button>
          </AddNewIssueWidget>
          <Link to="issues/create">{t('common.create')}</Link>
        </Box>
      </HStack>
    </Box>
  );
}
