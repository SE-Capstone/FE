import { useMemo } from 'react';

import { Text } from '@chakra-ui/react';

import { useGetListDefaultLabelQuery } from '../hooks/queries/use-get-list-default-labels.hook';
import { ActionMenuTableLabels, ActionTableLabelsWidget } from '../widgets';

import type { ILabel } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';

export function ListDefaultLabelPage() {
  const { listLabel, isError, isLoading, isRefetching } = useGetListDefaultLabelQuery();

  const columns = useMemo<ColumnsProps<ILabel>>(
    () => [
      {
        header: 'Label',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return <>{getNumericalOrder({ index })}</>;
            },
          },
          {
            key: 'title',
            title: 'Title',
            hasSort: false,
            Cell({ title }) {
              return <>{title}</>;
            },
          },
          {
            key: 'description',
            title: 'Description',
            hasSort: false,
            Cell({ description }) {
              return (
                <Text noOfLines={3} whiteSpace="normal">
                  {description || ''}
                </Text>
              );
            },
          },
        ],
      },
    ],
    []
  );

  return (
    <>
      <Head title="Label" />
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <ActionTableLabelsWidget isDefault />
        <TableComponent
          withoutPagination
          data={listLabel}
          groupColumns={columns}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          additionalFeature={(label) => (
            <ActionMenuTableLabels label={label} listLabel={listLabel} isDefault />
          )}
        />
      </StateHandler>
    </>
  );
}
