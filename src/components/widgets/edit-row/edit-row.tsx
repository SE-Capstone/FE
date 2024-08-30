import type { PropsWithChildren } from 'react';

import { Box, HStack, Text } from '@chakra-ui/react';

interface EditRowProps {
  title: string;
  isRequired?: boolean;
}

export function EditRow({ title, isRequired = false, children }: PropsWithChildren<EditRowProps>) {
  return (
    <HStack spacing={4} align="flex-start">
      <HStack
        minH={10}
        spacing={0.5}
        flexShrink={0}
        flexBasis={40}
        w={40}
        maxW={50}
        lineHeight="normal"
        align="flex-start"
      >
        {isRequired ? (
          <Text as="span" color="red.300">
            *
          </Text>
        ) : null}
        <Text as="span" fontWeight="600">
          {title}
        </Text>
      </HStack>
      <Box flex={1}>{children}</Box>
    </HStack>
  );
}