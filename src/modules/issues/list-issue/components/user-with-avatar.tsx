import { Avatar, HStack, Text } from '@chakra-ui/react';

export function UserWithAvatar({
  image,
  label,
  size,
  stackProps,
  hideText = false,
  date,
  size2,
}: {
  image: string;
  label: string;
  hideText?: boolean;
  size?: number;
  size2?: any;
  stackProps?: any;
  date?: string;
}) {
  return (
    <HStack w="full" role="group" {...stackProps}>
      <Avatar src={image} boxSize={size || 8} name={label as string} size={size2} />

      {!hideText && <Text color="inherit">{label}</Text>}
      {!hideText && date && (
        <>
          <Text>&#8226;</Text>
          <Text fontSize="sm" color="gray.500">
            {date}
          </Text>
        </>
      )}
    </HStack>
  );
}
