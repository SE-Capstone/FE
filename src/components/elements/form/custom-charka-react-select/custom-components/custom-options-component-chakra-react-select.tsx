import { Avatar, HStack, Text } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';

import type { CustomOptionSelectBase } from '../custom-charka-react-select';
import type { OptionProps, GroupBase, SizeProp } from 'chakra-react-select';

export function CustomOptionComponentChakraReactSelect<
  Option extends CustomOptionSelectBase & { image?: string },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: OptionProps<Option, IsMulti, Group>, size?: SizeProp) {
  const { data, innerProps } = props;
  const { onMouseMove: _onMouseMove, onMouseOver: _onMouseOver, ...newInnerProps } = innerProps;

  return (
    <chakraComponents.Option {...props} innerProps={newInnerProps}>
      <HStack w="full" role="group">
        <Avatar src={data.image} boxSize={size === 'sm' ? 8 : 10} name={data.label as string} />

        <Text color="inherit" fontSize={size === 'sm' ? '13px' : ''}>
          {data.label}
        </Text>
      </HStack>
    </chakraComponents.Option>
  );
}
