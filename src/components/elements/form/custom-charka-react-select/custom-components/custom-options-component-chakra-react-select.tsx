import { Avatar, HStack, Text } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';

import type { CustomOptionSelectBase } from '../custom-charka-react-select';
import type { OptionProps, GroupBase } from 'chakra-react-select';

export function CustomOptionComponentChakraReactSelect<
  Option extends CustomOptionSelectBase & { image?: string },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: OptionProps<Option, IsMulti, Group>) {
  const { data, innerProps } = props;
  const { onMouseMove: _onMouseMove, onMouseOver: _onMouseOver, ...newInnerProps } = innerProps;

  return (
    <chakraComponents.Option {...props} innerProps={newInnerProps}>
      <HStack w="full" role="group">
        <Avatar src={data.image} boxSize={10} name={data.label} />

        <Text color="inherit">{data.label}</Text>
      </HStack>
    </chakraComponents.Option>
  );
}
