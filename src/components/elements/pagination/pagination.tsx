import { Stack, Text } from '@chakra-ui/react';

import PaginationItem from './pagination-item';

interface PaginationProps {
  totalCount: number;
  perPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const siblingsCount = 2;

function generatePagesArray(from: number, to: number) {
  return [...new Array(to - from)].map((_, index) => from + index + 1).filter((page) => page > 0);
}

const Pagination: React.FC<PaginationProps> = ({
  totalCount,
  currentPage,
  onPageChange,
  perPage,
}: PaginationProps) => {
  const lastPage = Math.ceil(totalCount / perPage);

  const previousPages =
    currentPage > 1 ? generatePagesArray(currentPage - 1 - siblingsCount, currentPage - 1) : [];

  const nextPages =
    currentPage < lastPage
      ? generatePagesArray(currentPage, Math.min(currentPage + siblingsCount, lastPage))
      : [];

  return (
    <Stack direction="row" spacing="2">
      {currentPage > 1 + siblingsCount && (
        <>
          <PaginationItem number={1} onPageChange={onPageChange} />
          {currentPage > 2 + siblingsCount && (
            <Text color="primary" w="10" textAlign="center">
              ...
            </Text>
          )}
        </>
      )}
      {previousPages.length > 0 &&
        previousPages.map((page) => (
          <PaginationItem key={page} number={page} onPageChange={onPageChange} />
        ))}
      <PaginationItem number={currentPage} isCurrent onPageChange={onPageChange} />
      {nextPages.length > 0 &&
        nextPages.map((page) => (
          <PaginationItem key={page} number={page} onPageChange={onPageChange} />
        ))}

      {currentPage + siblingsCount < lastPage && (
        <>
          {currentPage + 1 + siblingsCount < lastPage && (
            <Text color="primary" w="10" textAlign="center">
              ...
            </Text>
          )}
          <PaginationItem number={lastPage} onPageChange={onPageChange} />
        </>
      )}
    </Stack>
  );
};

export default Pagination;
