import { useEffect, useMemo, useState } from 'react';

import { Box } from '@atlaskit/primitives';

import { useUpsertIssueHook } from '../hooks/mutations';

import type { IIssue } from '../types';

import {
  CustomChakraReactSelect,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
  type CustomOptionSelectBase,
} from '@/components/elements';
import { formatDate } from '@/libs/helpers';

interface IOptionSelectWithImage extends CustomOptionSelectBase {
  image?: string;
}

export const InlineEditCustomSelect = ({
  options,
  defaultValue,
  issue,
  field,
}: {
  options: IOptionSelectWithImage[];
  defaultValue?: IOptionSelectWithImage;
  issue: IIssue;
  field: 'status' | 'priority' | 'assignee' | 'label';
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const { handleUpsertIssue } = useUpsertIssueHook(undefined, true, issue.id);

  const customComponents = useMemo(
    () => ({
      DropdownIndicator: () => <Box />,
      ...(field === 'assignee' && {
        Option: CustomOptionComponentChakraReactSelect,
        SingleValue: CustomSingleValueComponentChakraReactSelect,
      }),
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      labelId: field === 'label' ? option?.value : issue.label?.id,
      assigneeId: field === 'assignee' ? option?.value : issue.assignee?.id,
      priority: field === 'priority' ? option?.value : issue.priority,
      // TODO
      // parentIssueId: issue.parentIssueId
    });
  };

  return (
    <CustomChakraReactSelect
      value={selectedOption}
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
