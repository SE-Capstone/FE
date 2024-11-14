import { useEffect, useMemo, useState } from 'react';

import type { IProject } from '@/modules/projects/list-project/types';

import {
  CustomChakraReactSelect,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
  type CustomOptionSelectBase,
} from '@/components/elements';
import { UserStatusEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { formatDate } from '@/libs/helpers';
import { useDebounce } from '@/libs/hooks';
import { useUpsertProjectHook } from '@/modules/projects/detail-project/hooks/mutations/use-upsert-project.mutation.hooks';
import { useGetInfiniteUserQuery } from '@/modules/users/list-user/hooks/queries';

interface IOptionSelectWithImage extends CustomOptionSelectBase {
  image?: string;
}

export const InlineEditCustomSelectInfinity = ({
  defaultValue,
  project,
}: {
  defaultValue?: IOptionSelectWithImage;
  project?: IProject;
}) => {
  const { members } = useProjectContext();
  const [selectedOption, setSelectedOption] = useState(defaultValue);

  useEffect(() => {
    setSelectedOption(defaultValue);
  }, [defaultValue]);

  const { handleUpsertProject } = useUpsertProjectHook({ id: project?.id || '', isUpdate: true });
  const [inputValue, setInputValue] = useDebounce('');

  const variables = {
    filter: {
      fullName: inputValue ? inputValue.toLocaleLowerCase() : undefined,
      status: UserStatusEnum.Active,
    },
  };

  const { isLoading, hasMore, listUser, fetchMore, isFetching, isRefetching } =
    useGetInfiniteUserQuery({
      params: variables.filter,
    });

  const options = listUser
    .filter((user) => !members.map((m) => m.id)?.includes(user.id))
    ?.map((user) => ({
      value: user.id,
      label: user.userName,
      image: user.avatar || '',
    }));

  const handleInputChange = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleMenuScrollToBottom = () => {
    if (!hasMore || isFetching || isRefetching) return;
    fetchMore();
  };

  const customComponents = useMemo(
    () => ({
      Option: (props) => CustomOptionComponentChakraReactSelect(props, 'sm'),
      SingleValue: (props) => CustomSingleValueComponentChakraReactSelect(props, false),
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
        width: 'max-content',
        maxWidth: '300px',
      }),

      dropdownIndicator: (provide) => ({
        ...provide,
        display: 'none',
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
    if (project) {
      if (project.leadId && project.leadId === option.value) {
        return;
      }

      handleUpsertProject({
        ...project,
        startDate: formatDate({
          date: project.startDate,
          format: 'YYYY-MM-DD',
        }) as unknown as Date,
        endDate: formatDate({
          date: project.endDate,
          format: 'YYYY-MM-DD',
        }) as unknown as Date,
        leadId: option?.value || project.leadId,
      });
    }
  };

  return (
    <CustomChakraReactSelect
      value={
        selectedOption
          ? {
              image: selectedOption.image,
              value: selectedOption.value,
              label: selectedOption.label,
            }
          : undefined
      }
      size="sm"
      isSearchable
      variant="unstyled"
      isLoading={isLoading}
      isClearable={false}
      options={options}
      placeholder=""
      components={customComponents}
      chakraStyles={stylesComponents}
      onChange={handleSubmit}
      onInputChange={handleInputChange}
      onMenuScrollToBottom={handleMenuScrollToBottom}
    />
  );
};
