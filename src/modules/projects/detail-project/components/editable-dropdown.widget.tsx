import { useEffect, useMemo, useState } from 'react';

import { useUpdateMemberPermissionMutation } from '../apis/update-member-permission';

import type { ProjectMember } from '../../list-project/types';

import { CustomChakraReactSelect, type CustomOptionSelectBase } from '@/components/elements';

interface IOptionSelectWithImage extends CustomOptionSelectBase {
  image?: string;
}

export const InlineEditPositionSelect = ({
  options,
  defaultValue,
  member,
  projectId,
}: {
  options: IOptionSelectWithImage[];
  defaultValue?: IOptionSelectWithImage;
  member: ProjectMember;
  projectId: string;
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const { mutate } = useUpdateMemberPermissionMutation({
    projectId,
    memberId: member.id,
  });

  const stylesComponents = useMemo(
    () => ({
      valueContainer: (provide) => ({
        ...provide,
        px: 0,
      }),

      dropdownIndicator: (provide) => ({
        ...provide,
        display: 'none',
      }),

      singleValue: (provide) => ({
        ...provide,
        fontSize: { base: 'sm', '2xl': 'sm' },
        minWidth: 'fit-content',
      }),

      menuList: (provide) => ({
        ...provide,
        width: 'max-content',
        maxWidth: '300px',
      }),

      control: (provide) => ({
        ...provide,
        pr: 0,
        _disabled: { bg: 'white' },

        borderRadius: { base: '6px !important', '2xl': '8px !important' },
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
    if (member) {
      mutate({
        body: {
          isProjectConfigurator: member.isProjectConfigurator || false,
          isIssueConfigurator: member.isIssueConfigurator || false,
          isCommentConfigurator: member.isCommentConfigurator || false,
          positionId: option?.value,
        },
      });
    }
  };

  return (
    <CustomChakraReactSelect
      value={selectedOption}
      variant="subtle"
      isClearable={false}
      isSearchable={false}
      options={options}
      placeholder=""
      chakraStyles={stylesComponents}
      onChange={handleSubmit}
    />
  );
};
