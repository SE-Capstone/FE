import { useMemo } from 'react';

import { Box } from '@atlaskit/primitives';

import { useUpsertIssueHook } from '../hooks/mutations';

import type { IIssue } from '../types';

import { CustomChakraReactSelect, type CustomOptionSelectBase } from '@/components/elements';
import { formatDate } from '@/libs/helpers';

export const InlineEditCustomSelect = ({
  options,
  defaultValue,
  issue,
  field,
}: {
  options: CustomOptionSelectBase[];
  defaultValue?: CustomOptionSelectBase;
  issue: IIssue;
  field: 'status' | 'priority' | 'assignee' | 'label';
}) => {
  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issue.id);

  const customComponents = useMemo(
    () => ({
      DropdownIndicator: () => <Box />,
    }),
    []
  );

  const stylesComponents = useMemo(
    () => ({
      valueContainer: (provide) => ({
        ...provide,
        px: 0,
      }),

      singleValue: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
        minWidth: 'fit-content',
      }),

      menuList: (provide) => ({
        ...provide,
        minWidth: 'fit-content',
        maxWidth: '300px',
      }),

      container: (provide) => ({
        ...provide,
        px: 0,
        bg: 'transparent',
        _hover: {
          cursor: 'pointer',
          bg: 'gray.100',
        },
      }),
    }),
    []
  );

  const handleSubmit = (option) => {
    handleUpsertIssue({
      ...issue,
      startDate: issue.startDate
        ? (formatDate({
            date: issue.startDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      dueDate: issue.dueDate
        ? (formatDate({
            date: issue.dueDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date)
        : undefined,
      statusId: field === 'status' ? option?.value : issue.status.id,
      ...(field === 'priority' && { priority: option?.value }),
      ...(field === 'assignee' && { assigneeId: option?.value }),
      ...(field === 'label' && { labelId: option?.value }),
    });
  };

  return (
    <CustomChakraReactSelect
      defaultValue={defaultValue}
      variant="subtle"
      size="lg"
      isClearable={false}
      isSearchable={false}
      options={options}
      placeholder=""
      components={customComponents}
      chakraStyles={stylesComponents}
      onChange={handleSubmit}
    />
  );
};
