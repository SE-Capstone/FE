import type { ReactElement } from 'react';
import React, { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

import {
  Box,
  Checkbox,
  Flex,
  HStack,
  Skeleton,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
} from '@chakra-ui/react';

import { DraggableRow, type DraggableRowProps } from './draggable-row';
import TableHeader from './table-header';

import type { UnionAndString } from '@/types';
import type { TableCellProps, TableProps } from '@chakra-ui/react';

import { CustomChakraReactSelect } from '@/components/elements';
import Pagination from '@/components/elements/pagination';

interface ColumnItems<ObjectType> {
  key: UnionAndString<keyof ObjectType>;
  title: string;
  Cell?: (value: ObjectType, index: number) => JSX.Element | null;
  isNumeric?: boolean;
  tableCellProps?: TableCellProps;
  hasSort: boolean;
}

export type ColumnsProps<ObjectType> = {
  header: string;
  columns: ColumnItems<ObjectType>[];
}[];

interface RenderFilterTableProps<ObjectType> {
  listSelected: ObjectType[];
  resetSelected: () => void;
}

export interface TableComponentProps<ObjectType> {
  data: ObjectType[];
  groupColumns: ColumnsProps<ObjectType>;
  hasCheckbox?: boolean;
  additionalFeature?(value: ObjectType): JSX.Element;

  // paginate
  totalCount?: number;
  currentPage?: number;
  perPage?: number;
  onPageChange?(page: number, perPage?: number): void;

  isLoading: boolean;
  withoutHeader?: boolean;
  isError: boolean;
  TableProps?: TableProps;
  hasNoPaginate?: boolean;

  // filter

  showChangeEntries?: boolean;

  renderFilterTable?(props: RenderFilterTableProps<ObjectType>): React.ReactNode;

  onFilterChange?(values: string): void;

  hasDraggable?: DraggableRowProps<ObjectType>['hasDraggable'];
  handleReorderRow?: DraggableRowProps<ObjectType>['reorderRow'];
}

type FiltersProps<ObjectType extends { id?: string | null } = {}> = {
  sortBy: 'asc' | 'desc' | 'all';
  accessor: keyof ObjectType;
}[];

function TableComponent<ObjectType extends { id?: string | null } = {}>({
  data,
  groupColumns,
  totalCount = 0,
  additionalFeature = undefined,
  hasCheckbox = false,
  showChangeEntries = false,
  TableProps,
  isError,
  isLoading,
  withoutHeader = false,

  renderFilterTable,
  onFilterChange = undefined,

  // paginate
  currentPage = 1,
  perPage,
  onPageChange,
  hasNoPaginate,

  hasDraggable,
  handleReorderRow,
}: TableComponentProps<ObjectType>) {
  const [page, setPage] = useState(currentPage);
  const [sortedData, setSortedData] = useState<ObjectType[]>([]);
  const [persistData, setPersistData] = useState<ObjectType[]>([]);

  const filters = useRef<FiltersProps<ObjectType>>([]);
  const [rowsCount, setRowsCount] = useState(10);
  const wrapperTableRef = useRef<HTMLDivElement>(null);

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

  useLayoutEffect(() => {
    groupColumns.forEach((group) => {
      group.columns.forEach((column) => {
        if (column.hasSort) {
          filters.current.push({
            accessor: String(column.key) as keyof ObjectType,
            sortBy: 'all',
          });
        }
      });
    });
  }, [groupColumns]);

  const handleChangePage = useCallback(
    (newPage: number) => {
      if (onPageChange) onPageChange(newPage, rowsCount);

      setPage(newPage);
      wrapperTableRef.current?.scrollIntoView({ behavior: 'smooth' });
    },
    [onPageChange, rowsCount]
  );

  const handleSortBy = useCallback(
    (sortBy: 'asc' | 'desc' | 'all', accessor: keyof ObjectType) => {
      const newSortBy = sortBy === 'all' ? 'asc' : sortBy === 'asc' ? 'desc' : 'all';

      filters.current = [
        { accessor, sortBy: newSortBy },
        ...filters.current.filter((predicate) => predicate.accessor !== accessor),
      ];

      const sorted = filters.current
        .reduce<string[]>((acc, cur) => {
          if (cur.sortBy !== 'all') {
            acc.push(`${String(cur.accessor)}_${cur.sortBy}`);
          }

          // by default using key first name, when sort by full name must push key last name
          if (cur.accessor === 'first_name' && cur.sortBy !== 'all') {
            acc.push(`last_name_${cur.sortBy}`);
          }

          return acc;
        }, [])
        .join(',');

      onFilterChange && onFilterChange(sorted);
    },
    [onFilterChange]
  );

  const setSelected = (data: ObjectType[], isCheckAll?: boolean) => {
    if (!isCheckAll) {
      return setPersistData((prev) => {
        const newData = prev.filter((pre) => data.every((d) => d.id !== pre.id));
        return newData;
      });
    }
    return setPersistData((prev) => [
      ...new Map([...prev, ...data].map((d) => [d.id, d])).values(),
    ]);
  };

  const listSelected = useMemo(() => persistData, [persistData]);
  const isCheckAll = sortedData.every((d) => listSelected.some((selected) => selected.id === d.id));
  const isIndeterminate = sortedData.some(
    ({ id }) => listSelected.some((selected) => selected.id === id) && !isCheckAll
  );

  return (
    <Stack ref={wrapperTableRef} spacing={4} w="full">
      {renderFilterTable &&
        renderFilterTable({ listSelected, resetSelected: () => setPersistData([]) })}
      <Box w="full">
        {!isLoading && isError ? (
          <Flex my={4} justify="center">
            <Text>No data</Text>
          </Flex>
        ) : isLoading ? (
          <Table bg="white">
            <Tbody>
              {[...Array(7)].map((_, index) => (
                <Tr key={`loading-${index}`}>
                  <Td>
                    <Checkbox isDisabled />
                  </Td>
                  {groupColumns[0].columns.slice(0, 5).map((column) => (
                    <Td key={String(column.key)}>
                      <Skeleton color="gray.800" height="10px" />
                    </Td>
                  ))}
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <TableContainer {...TableProps} maxW="full" shadow="md">
            {/* <TableSearch handleOnSearch={handleOnSearch} /> */}
            <Table
              // sx={{ borderCollapse: 'collapse', tableLayout: 'fixed' }}
              size="md"
              overflow="hidden"
              borderRadius={2}
            >
              {!withoutHeader && (
                <TableHeader<ObjectType>
                  hasCheckbox={hasCheckbox && sortedData && !!sortedData.length}
                  groupColumns={groupColumns}
                  additionalFeature={!!additionalFeature}
                  handleSortBy={handleSortBy}
                  isCheckAll={isCheckAll}
                  isIndeterminate={isIndeterminate}
                  hasDraggable={hasDraggable}
                  onHandleCheckbox={(checked) => {
                    setSelected(sortedData, checked);
                  }}
                />
              )}

              <Tbody rounded="12px" bg="white">
                {sortedData &&
                  sortedData.map((object, index) => {
                    const tdContent = (
                      <>
                        {hasCheckbox && (
                          <Td pl="16px" border="none">
                            <Checkbox
                              pt="2px"
                              isChecked={persistData.some((pd) => pd.id === object.id)}
                              size="lg"
                              onChange={(e) => {
                                setSelected([object], e.target.checked);
                              }}
                            />
                          </Td>
                        )}
                        {groupColumns.map((group) => (
                          <React.Fragment key={group.header}>
                            {group.columns.map((column) => (
                              <Td
                                key={String(column.key)}
                                border="none"
                                py={2}
                                isNumeric={
                                  // typeof object[column.key] === 'number' && column.key === 'id'
                                  false
                                }
                                sx={{
                                  fontWeight: 500,
                                  fontSize: '14px',
                                  lineHeight: '21px',
                                  color: 'textColor',
                                }}
                                {...column.tableCellProps}
                              >
                                {column?.Cell
                                  ? column.Cell(object, index)
                                  : object[column.key as keyof ObjectType]
                                  ? (object[column.key as keyof ObjectType] as ReactElement)
                                  : ''}
                              </Td>
                            ))}
                          </React.Fragment>
                        ))}

                        {additionalFeature && (
                          <Td py={2} border="none" textAlign="right" pos="relative">
                            {additionalFeature(object)}
                          </Td>
                        )}
                      </>
                    );

                    return hasDraggable && handleReorderRow ? (
                      <DraggableRow<ObjectType>
                        key={object.id}
                        row={{ ...object, index }}
                        hasDraggable={hasDraggable}
                        reorderRow={handleReorderRow}
                      >
                        {tdContent}
                      </DraggableRow>
                    ) : (
                      <Tr key={object.id}>{tdContent}</Tr>
                    );
                  })}
              </Tbody>
            </Table>
            {sortedData && !sortedData.length && (
              <Flex my={4} justify="center">
                <Text>Không có dữ liệu</Text>
              </Flex>
            )}
          </TableContainer>
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
                      wrapperTableRef.current?.scrollIntoView({ behavior: 'smooth' });
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

// const TableComponent = forwardRef(TableComponentRef) as <
//   ObjectType extends { id: string }
// >(
//   p: TableComponentProps<ObjectType> & { ref?: Ref<RefProps> },
// ) => JSX.Element;

export default TableComponent;
