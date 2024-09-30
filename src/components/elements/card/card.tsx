import type React from 'react';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import {
  Box,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Card,
  Text,
  Grid,
  GridItem,
  Container,
  SkeletonText,
} from '@chakra-ui/react';

import type { UnionAndString } from '@/types';
import type { CardProps } from '@chakra-ui/react';

import { CustomChakraReactSelect } from '@/components/elements';
import Pagination from '@/components/elements/pagination';

interface CardItems<ObjectType> {
  key: UnionAndString<keyof ObjectType>;
  isNumeric?: boolean;
}

export type CardsProps<ObjectType> = {
  cards: CardItems<ObjectType>[];
}[];

export interface CardComponentProps<ObjectType> {
  data: ObjectType[];

  // paginate
  totalCount?: number;
  currentPage?: number;
  perPage?: number;
  onPageChange?(page: number, perPage?: number): void;

  isLoading: boolean;
  isError: boolean;
  CardProps?: CardProps;
  hasNoPaginate?: boolean;
  children: (object: ObjectType) => React.ReactNode;

  // filter
  showChangeEntries?: boolean;
  onFilterChange?(values: string): void;
}

function CardComponent<ObjectType extends { id?: string | null } = {}>({
  data,
  totalCount = 0,
  showChangeEntries = false,
  CardProps,
  isError,
  isLoading,
  children,

  // paginate
  currentPage = 1,
  perPage,
  onPageChange,
  hasNoPaginate,
}: CardComponentProps<ObjectType>) {
  const [page, setPage] = useState(currentPage);
  const [sortedData, setSortedData] = useState<ObjectType[]>([]);

  const [rowsCount, setRowsCount] = useState(10);
  const wrapperCardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    setRowsCount(Number(perPage));
  }, [perPage]);

  useLayoutEffect(() => {
    setPage(Number(currentPage));
  }, [currentPage]);

  useLayoutEffect(() => {
    if (data) {
      setSortedData(data);
    }
  }, [data]);

  const handleChangePage = useCallback(
    (newPage: number) => {
      if (onPageChange) onPageChange(newPage, rowsCount);

      setPage(newPage);
      wrapperCardRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [onPageChange, rowsCount]
  );

  return (
    <Stack ref={wrapperCardRef} spacing={4} w="full">
      <Box w="full">
        {!isLoading && isError ? (
          <Flex my={4} justify="center">
            <Text>No data</Text>
          </Flex>
        ) : isLoading ? (
          <Card bg="white">
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
                '2xl': 'repeat(5, 1fr)',
              }}
              gap={3}
              w="100%"
              p={6}
            >
              {[...Array(6)].map((_, index) => (
                <GridItem
                  key={index}
                  _hover={{ bg: 'gray.300' }}
                  rounded={2}
                  border="1px solid"
                  borderColor="darkgrey"
                  transition="background 0.3s ease"
                  p={3}
                  w="100%"
                  bg="gray.200"
                  shadow="card"
                  mb={3}
                >
                  <>
                    <Skeleton height="20px" width="70%" mb={3} />
                    <SkeletonText mt="4" noOfLines={4} spacing="4" />
                    <Skeleton height="15px" width="30%" mt={5} />
                  </>
                </GridItem>
              ))}
            </Grid>
          </Card>
        ) : (
          <Container {...CardProps} maxW="full" shadow="md" p={5} rounded={2}>
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(4, 1fr)',
              }}
              gap={3}
              w="full"
            >
              {sortedData &&
                sortedData.map((object, index) => (
                  <GridItem
                    key={index}
                    _hover={{ bg: 'gray.100' }}
                    rounded={2}
                    border="1px solid"
                    borderColor="darkgrey"
                    transition="background 0.3s ease"
                    p={3}
                    w="100%"
                    bg="gray.200"
                    shadow="card"
                  >
                    {children(object)}
                  </GridItem>
                ))}
            </Grid>

            {sortedData && !sortedData.length && (
              <Flex my={4} justify="center">
                <Text>No data</Text>
              </Flex>
            )}
          </Container>
        )}

        {!hasNoPaginate && sortedData && !!sortedData.length && (
          <HStack
            direction="row"
            pt={4}
            justify={showChangeEntries ? 'space-between' : 'flex-end'}
            align="center"
            spacing="6"
          >
            {showChangeEntries && (
              <HStack spacing={2} align="center" py={3}>
                <Text>Show</Text>
                <Box w="120px">
                  <CustomChakraReactSelect
                    defaultValue={{ value: 20, label: '20' }}
                    size="md"
                    isMulti={false}
                    isSearchable={false}
                    options={[
                      { value: 10, label: '10' },
                      { value: 20, label: '20' },
                      { value: 50, label: '50' },
                      { value: 100, label: '100' },
                    ]}
                    onChange={(option) => {
                      if (!option?.value) return;

                      onPageChange && onPageChange(1, option.value);
                      wrapperCardRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  />
                </Box>

                <Text>entries</Text>
              </HStack>
            )}

            <Pagination
              totalCount={Number(totalCount)}
              currentPage={page}
              perPage={rowsCount}
              onPageChange={handleChangePage}
            />
          </HStack>
        )}
      </Box>
    </Stack>
  );
}

export default CardComponent;
