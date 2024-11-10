import { Avatar, HStack, Text } from '@chakra-ui/react';

export function UserWithAvatar({
  image,
  label,
  size,
  stackProps,
  hideText = false,
}: {
  image: string;
  label: string;
  hideText?: boolean;
  size?: number;
  stackProps?: any;
}) {
  return (
    <HStack w="full" role="group" {...stackProps}>
      <Avatar src={image} boxSize={size || 8} name={label as string} />

      <Text color="inherit">{!hideText && label}</Text>
    </HStack>
  );
}
