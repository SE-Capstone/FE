import { useEffect, useMemo, useState } from 'react';

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
import { Link } from 'react-router-dom';

import { AddNewIssueWidget } from './add-new-issue.widget';
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

export function ActionTableIssuesWidget({
  listLabel,
  listPhase,
  listStatus,
  members,
}: {
  listLabel: ILabel[];
  listStatus: IStatus[];
  listPhase: IPhase[];
  members: ProjectMember[];
}) {
  const { t } = useTranslation();
  const [labelChecked, setLabelChecked] = useState<string[]>([]);
  const [phaseChecked, setPhaseChecked] = useState<string[]>([]);
  const [assigneeChecked, setAssigneeChecked] = useState<string[]>([]);
  const [statusChecked, setStatusChecked] = useState<string[]>([]);

  const { issuesQueryState, setIssuesQueryFilterState } = useIssuesQueryFilterStateContext();
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const toggle = (name: string, field: 'phase' | 'label' | 'assignee' | 'status') => {
    if (field === 'label') {
      setLabelChecked((prev) => {
        const newChecked = prev.includes(name)
          ? prev.filter((item) => item !== name)
          : [...prev, name];

        setIssuesQueryFilterState({ labelIds: newChecked });

        return newChecked;
      });
    }
    if (field === 'phase') {
      setPhaseChecked((prev) => {
        const newChecked = prev.includes(name)
          ? prev.filter((item) => item !== name)
          : [...prev, name];

        setIssuesQueryFilterState({ phaseIds: newChecked });

        return newChecked;
      });
    }
    if (field === 'status') {
      setStatusChecked((prev) => {
        const newChecked = prev.includes(name)
          ? prev.filter((item) => item !== name)
          : [...prev, name];

        setIssuesQueryFilterState({ statusIds: newChecked });

        return newChecked;
      });
    }
    if (field === 'assignee') {
      setAssigneeChecked((prev) => {
        const newChecked = prev.includes(name)
          ? prev.filter((item) => item !== name)
          : [...prev, name];

        setIssuesQueryFilterState({ assigneeIds: newChecked });

        return newChecked;
      });
    }
  };
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
        },
        {
          value: 'assigneeIds',
          label: t('fields.assignee'),
        },
        {
          value: 'reporterId',
          label: t('fields.reporter'),
        },
        {
          value: 'statusIds',
          label: t('fields.status'),
        },
        {
          value: 'labelIds',
          label: t('common.label'),
        },
        {
          value: 'phaseIds',
          label: t('common.phase'),
        },
        {
          value: 'startDate',
          label: t('fields.startDate'),
        },
        {
          value: 'dueDate',
          label: t('fields.dueDate'),
        },
      ].filter(Boolean),
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
                initValue={issuesQueryState.filters.title || ''}
                onHandleSearch={(keyword) => {
                  setIssuesQueryFilterState({ title: keyword });
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
                onChange={(opt) => {
                  setIssuesQueryFilterState({
                    priority: opt?.value ? opt.value : undefined,
                  });
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
                components={customComponents}
                onChange={(opt) => {
                  setIssuesQueryFilterState({
                    reporterId: opt?.value ? opt.value : undefined,
                  });
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
          <AddNewIssueWidget>
            <Button leftIcon={<>+</>}>{t('common.create')}</Button>
          </AddNewIssueWidget>
          <Link to="issues/create">{t('common.create')}</Link>
        </Box>
      </HStack>
    </Box>
  );
}
