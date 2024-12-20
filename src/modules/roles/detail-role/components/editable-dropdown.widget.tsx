import { useEffect, useMemo, useState } from 'react';

import { useUpdateRoleMutation } from '../apis/update-role.api';

import type { IRole } from '../../list-role/types';

import { CustomChakraReactSelect, type CustomOptionSelectBase } from '@/components/elements';

interface IOptionSelectWithImage extends CustomOptionSelectBase {
  image?: string;
}

export const InlineEditRoleSelect = ({
  options,
  defaultValue,
  role,
  isDisabled = false,
}: {
  options: IOptionSelectWithImage[];
  defaultValue?: IOptionSelectWithImage;
  role?: IRole;
  isDisabled?: boolean;
}) => {
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const { mutate: updateRoleMutation } = useUpdateRoleMutation({});

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
        borderColor: '#EDF2F7',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        rounded: '5px',
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
    if (role) {
      updateRoleMutation({
        body: {
          id: role.id,
          name: role.name,
          description: role.description,
          color: option?.value || role.color,
          permissionsId: role.permissions.map((permission) => permission.id),
        },
      });
    }
  };

  return (
    <CustomChakraReactSelect
      value={selectedOption}
      variant="subtle"
      isDisabled={isDisabled}
      isClearable={false}
      isSearchable={false}
      options={options}
      placeholder=""
      chakraStyles={stylesComponents}
      onChange={handleSubmit}
    />
  );
};
