import { useMemo } from 'react';

import { HStack } from '@chakra-ui/react';
import { createFilter } from 'chakra-react-select';

import type { CustomChakraReactSelectProps, CustomOptionSelectBase } from '@/components/elements';
import type { FieldValues } from 'react-hook-form';

import {
  CustomChakraReactSelect,
  CustomMultiValueComponentChakraReactSelect,
  CustomOptionComponentChakraReactSelect,
} from '@/components/elements';
import { DEFAULT_PAGINATION, UserStatusEnum } from '@/configs';
import { getStorageUrl } from '@/libs/helpers';
import { useDebounce } from '@/libs/hooks';
import { useGetInfiniteUserQuery } from '@/modules/users/list-user/hooks/queries';

export interface IOptionUserSelect extends CustomOptionSelectBase {
  image: string;
}

type UsersAsyncSelectProps<
  TFormValues extends FieldValues,
  IsMulti extends boolean = false
> = CustomChakraReactSelectProps<TFormValues, IsMulti, IOptionUserSelect> & {
  defaultUserValue?: string[];
  ignoreUserIds?: string[];
};

export function UsersAsyncSelect<TFormValues extends FieldValues, IsMulti extends boolean>(
  props: UsersAsyncSelectProps<TFormValues, IsMulti>
) {
  const { defaultUserValue, ignoreUserIds, ...propsSelect } = props;

  const [inputValue, setInputValue] = useDebounce('');

  const variables = {
    paginateInput: DEFAULT_PAGINATION,
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
    .filter((user) => !ignoreUserIds?.includes(user.id))
    ?.map((user) => {
      const isDisabled = defaultUserValue?.includes(user.id);
      const avatar = user.avatar ? getStorageUrl(user.avatar) : '';
      return {
        value: user.id,
        label: user.fullName,
        image: avatar,
        isDisabled,
      };
    });

  const handleInputChange: CustomChakraReactSelectProps<
    TFormValues,
    IsMulti,
    IOptionUserSelect
  >['onInputChange'] = (inputValue: string) => {
    setInputValue(inputValue);
  };

  const handleMenuScrollToBottom = () => {
    if (!hasMore || isFetching || isRefetching) return;
    fetchMore();
  };

  const chakraStyles: CustomChakraReactSelectProps<
    TFormValues,
    IsMulti,
    IOptionUserSelect
  >['chakraStyles'] = {
    menuList: (provided) => ({
      ...provided,
      maxHeight: '200px',
      py: 0,
      shadow: 'lg',
    }),
    menu: (provided) => ({
      ...provided,
      rounded: 2,
    }),
  };

  const customComponents: CustomChakraReactSelectProps<
    TFormValues,
    IsMulti,
    IOptionUserSelect
  >['components'] = useMemo(
    () => ({
      Option: CustomOptionComponentChakraReactSelect,
      MultiValue: CustomMultiValueComponentChakraReactSelect,
    }),
    []
  );

  return (
    <HStack w="full">
      <CustomChakraReactSelect<TFormValues, IsMulti, IOptionUserSelect>
        placeholder="Choose members..."
        filterOption={createFilter({ ignoreAccents: false })}
        isLoading={isLoading || isFetching || isRefetching}
        isOptionDisabled={(option) => option.isDisabled || isLoading}
        options={options}
        chakraStyles={chakraStyles}
        components={customComponents}
        menuShouldScrollIntoView
        onInputChange={handleInputChange}
        onMenuScrollToBottom={handleMenuScrollToBottom}
        {...propsSelect}
      />
    </HStack>
  );
}
