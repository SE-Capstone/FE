import { useEffect, useRef, useState } from 'react';

import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Radio,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  VStack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { SearchInput } from '@/components/elements';
import { DEFAULT_PAGINATION, UserStatusEnum } from '@/configs';
import { useDebounce } from '@/libs/hooks';
import { useGetInfiniteUserQuery } from '@/modules/users/list-user/hooks/queries';

interface UsersAsyncTableProps {
  onUserSelect: (userId: string | null) => void; // Accept a prop for the user selection callback
}

export function UsersAsyncTable({ onUserSelect }: UsersAsyncTableProps) {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useDebounce<string | undefined>('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const variables = {
    paginateInput: DEFAULT_PAGINATION,
    filter: {
      userName: inputValue ? inputValue.toLocaleLowerCase() : undefined,
      status: UserStatusEnum.Active,
    },
  };

  const { isLoading, hasMore, listUser, fetchMore, isFetching, isRefetching, isError } =
    useGetInfiniteUserQuery({
      params: variables.filter,
    });

  useEffect(() => {
    onUserSelect(selectedUserId); // Call the callback whenever the selected user changes
  }, [selectedUserId, onUserSelect]);

  const handleScroll = () => {
    if (tableContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = tableContainerRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (hasMore && !isFetching && !isRefetching) {
          fetchMore();
        }
      }
    }
  };

  useEffect(() => {
    const container = tableContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasMore, isFetching, isRefetching]);

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
  };

  return (
    <VStack w="full">
      <Heading size="md">{t('common.users')}</Heading>
      <SearchInput
        bg="white"
        borderColor="gray.300"
        placeholder={`${t('common.enter')} ${t('fields.fullName').toLowerCase()}...`}
        initValue=""
        onHandleSearch={(keyword) => {
          setInputValue(keyword);
        }}
      />
      <Stack spacing={4} w="full">
        <Box w="full">
          {!isLoading && isError ? (
            <Flex my={4} justify="center">
              <Text>{t('common.noData')}</Text>
            </Flex>
          ) : isLoading ? (
            <Table bg="white">
              <Tbody>
                {[...Array(7)].map((_, index) => (
                  <Tr key={`loading-${index}`}>
                    <Td>
                      <Checkbox isDisabled />
                    </Td>
                    {[...Array(2)].map((_, index) => (
                      <Td key={String(index)}>
                        <Skeleton color="gray.800" height="10px" />
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <TableContainer
              ref={tableContainerRef}
              maxW="full"
              shadow="md"
              overflowY="auto"
              maxH="580px"
              rounded={2}
            >
              <Table size="sm" variant="simple" position="relative" borderRadius={2}>
                <Thead>
                  <Tr position="sticky" top={0} bg="white" zIndex={1} shadow="sm">
                    <Th
                      color="#8E96AF"
                      fontWeight={600}
                      fontSize="sm"
                      py={2}
                      lineHeight="21px"
                      textTransform="capitalize"
                      w="10px"
                    >
                      <Box>#</Box>
                    </Th>
                    <Th
                      color="#8E96AF"
                      fontWeight={600}
                      fontSize="sm"
                      py={2}
                      lineHeight="21px"
                      textTransform="capitalize"
                    >
                      <Box>{t('fields.fullName')}</Box>
                    </Th>
                    <Th
                      color="#8E96AF"
                      fontWeight={600}
                      fontSize="sm"
                      py={2}
                      lineHeight="21px"
                      textTransform="capitalize"
                      position="sticky"
                      top={0}
                      bg="white"
                      zIndex={1}
                    >
                      <Box>{t('fields.aliasName')}</Box>
                    </Th>
                  </Tr>
                </Thead>

                <Tbody rounded="12px" bg="white">
                  {listUser &&
                    listUser.map((user) => {
                      const tdContent = (
                        <>
                          <Td pl="16px" border="none">
                            <Radio
                              size="md"
                              type="radio"
                              borderColor="gray.300"
                              isChecked={selectedUserId === user.id}
                            />
                          </Td>
                          <Td
                            border="none"
                            py={2}
                            isNumeric={false}
                            sx={{
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '21px',
                              color: 'textColor',
                            }}
                          >
                            {user.fullName}
                          </Td>
                          <Td
                            border="none"
                            py={2}
                            isNumeric={false}
                            sx={{
                              fontWeight: 500,
                              fontSize: '14px',
                              lineHeight: '21px',
                              color: 'textColor',
                            }}
                          >
                            {user.userName}
                          </Td>
                        </>
                      );

                      return (
                        <Tr
                          key={user.id}
                          bg={selectedUserId === user.id ? 'gray.50' : ''}
                          _hover={{
                            bgColor: 'gray.50',
                          }}
                          cursor="pointer"
                          onClick={() => handleUserSelect(user.id)}
                        >
                          {tdContent}
                        </Tr>
                      );
                    })}
                </Tbody>
              </Table>
              {listUser && !listUser.length && (
                <Flex my={4} justify="center">
                  <Text>{t('common.noData')}</Text>
                </Flex>
              )}
            </TableContainer>
          )}
        </Box>
      </Stack>
    </VStack>
  );
}
