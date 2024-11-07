import { Avatar, HStack, Text } from '@chakra-ui/react';

export function UserWithAvatar({
  image,
  label,
  size,
  stackProps,
}: {
  image: string;
  label: string;
  size?: number;
  stackProps?: any;
}) {
  return (
    <HStack w="full" role="group" {...stackProps}>
      <Avatar src={image} boxSize={size || 8} name={label as string} />

      <Text color="inherit">{label}</Text>
    </HStack>
  );
}
