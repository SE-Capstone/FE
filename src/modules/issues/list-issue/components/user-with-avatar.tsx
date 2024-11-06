import { Avatar, HStack, Text } from '@chakra-ui/react';

export function UserWithAvatar({ image, label }: { image: string; label: string }) {
  return (
    <HStack w="full" role="group">
      <Avatar src={image} boxSize={8} name={label as string} />

      <Text color="inherit">{label}</Text>
    </HStack>
  );
}
