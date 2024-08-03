import { Flex, Icon, Spinner } from '@chakra-ui/react';
import { HiDotsHorizontal } from 'react-icons/hi';

interface AdditionalFeatureProps {
  isOpen: boolean;
  isLoading?: boolean;
}

export function AdditionalFeature({ isOpen, isLoading = false }: AdditionalFeatureProps) {
  return isLoading ? (
    <Spinner size="md" />
  ) : (
    <Flex justifyContent="center">
      <Icon
        fontSize="38px"
        cursor="pointer"
        bg={isOpen ? '#EBEBFF' : 'inherit'}
        color={isOpen ? 'primary' : 'neutral.300'}
        rounded="full"
        p={2}
        as={HiDotsHorizontal}
      />
    </Flex>
  );
}
