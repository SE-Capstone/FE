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
      <HStack w="full" role="group">
        {data.image ? <Avatar src={data.image} boxSize={6} /> : null}
        {children}
        <Text color="inherit">{data.label}</Text>
      </HStack>
    </chakraComponents.MultiValue>
  );
}
