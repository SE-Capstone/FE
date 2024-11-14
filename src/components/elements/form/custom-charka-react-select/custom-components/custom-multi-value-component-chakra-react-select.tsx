import { Avatar, HStack, Text } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';

import type { CustomOptionSelectBase } from '../custom-charka-react-select';
import type { GroupBase, MultiValueProps } from 'chakra-react-select';

export function CustomMultiValueComponentChakraReactSelect<
  Option extends CustomOptionSelectBase & { image?: string },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: MultiValueProps<Option, IsMulti, Group>) {
  const { data, children } = props;

  return (
    <chakraComponents.MultiValue {...props}>
      <HStack w="full" role="group" p={1}>
        <Avatar
          src={data.image}
          size="xs"
          name={(data.label as string).replace(/[^a-zA-Z ]/g, '')}
        />
        {children}
        <Text color="inherit">{data.label}</Text>
      </HStack>
    </chakraComponents.MultiValue>
  );
}
