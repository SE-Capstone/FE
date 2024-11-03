import { useMemo } from 'react';

import { Box } from '@atlaskit/primitives';

import { useUpdateIssueMutation } from '../apis/update-issue.api';

import type { IIssue } from '../types';

import { CustomChakraReactSelect, type CustomOptionSelectBase } from '@/components/elements';

export const InlineEditCustomSelect = ({
  options,
  defaultValue,
  issue,
  field,
}: {
  options: CustomOptionSelectBase[];
  defaultValue: CustomOptionSelectBase;
  issue: IIssue;
  field: 'status' | 'priority';
}) => {
  const { mutate: updateIssueMutation } = useUpdateIssueMutation();

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
    updateIssueMutation({
      body: {
        ...issue,
        id: option?.value,
        ...(field === 'status' ? { statusId: option?.value } : { priority: option?.value }),
      },
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
      components={customComponents}
      chakraStyles={stylesComponents}
      onChange={handleSubmit}
    />
  );
};
