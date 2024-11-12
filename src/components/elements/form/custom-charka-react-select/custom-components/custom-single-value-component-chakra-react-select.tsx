import { Avatar, HStack, Text } from '@chakra-ui/react';
import { chakraComponents } from 'chakra-react-select';

import type { CustomOptionSelectBase } from '../custom-charka-react-select';
import type { GroupBase, SingleValueProps } from 'chakra-react-select';

export function CustomSingleValueComponentChakraReactSelect<
  Option extends CustomOptionSelectBase & { image?: string },
  IsMulti extends boolean = false,
  Group extends GroupBase<Option> = GroupBase<Option>
>(props: SingleValueProps<Option, IsMulti, Group>, noDisplayLabel?: boolean) {
  const { data } = props;

  return (
    <chakraComponents.SingleValue {...props}>
      <HStack w="full" role="group">
        <Avatar src={data.image} boxSize={8} name={data.label as string} />

        {!noDisplayLabel && <Text color="inherit">{data.label}</Text>}
      </HStack>
    </chakraComponents.SingleValue>
  );
}
