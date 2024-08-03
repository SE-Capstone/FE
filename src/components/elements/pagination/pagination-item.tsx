import { Button } from '@chakra-ui/react';

interface PaginationItemProps {
  number: number;
  isCurrent?: boolean;
  onPageChange: (page: number) => void;
}

const PaginationItem: React.FC<PaginationItemProps> = ({
  isCurrent = false,
  onPageChange,
  number,
}: PaginationItemProps) => (
  <Button
    size="sm"
    fontSize="xs"
    variant="solid"
    bg="primary"
    color="white"
    rounded={2}
    w={{ base: 8, '2xl': 9 }}
    h={{ base: 8, '2xl': 9 }}
    isDisabled={isCurrent}
    onClick={() => onPageChange(number)}
  >
    {number}
  </Button>
);

export default PaginationItem;
