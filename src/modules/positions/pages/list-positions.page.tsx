import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { usePositionsQueryFilterStateContext } from '../contexts';
import { useGetListPositionQuery } from '../hooks/queries';
import { ActionMenuTablePositions, ActionTablePositionsWidget } from '../widgets';

import type { IPosition } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';

export function ListPositionPage() {
  const { t } = useTranslation();
  const { positionsQueryState, resetPositionsQueryState } = usePositionsQueryFilterStateContext();

  const { listPosition, isError, isLoading, isRefetching } = useGetListPositionQuery({
    params: positionsQueryState.filters,
  });

  const columns = useMemo<ColumnsProps<IPosition>>(
    () => [
      {
        header: 'Position',
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
            key: 'name',
            title: t('fields.name'),
            hasSort: false,
            Cell({ name }) {
              return <>{name}</>;
            },
          },
          {
            key: 'description',
            title: t('fields.description'),
            hasSort: false,
            Cell({ description }) {
              return (
                <Text noOfLines={3} whiteSpace="normal">
                  {description || ''}
                </Text>
              );
            },
          },
          {
            key: 'createdBy',
            title: t('fields.createdBy'),
            hasSort: false,
            Cell({ createdBy }) {
              return <Text>{createdBy || ''}</Text>;
            },
          },
          {
            key: 'updatedBy',
            title: t('fields.updatedBy'),
            hasSort: false,
            Cell({ updatedBy }) {
              return <Text>{updatedBy || ''}</Text>;
            },
          },
        ],
      },
    ],
    [t]
  );

  return (
    <>
      <Head title="Position" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetPositionsQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTablePositionsWidget />
            <TableComponent
              withoutPagination
              data={listPosition}
              groupColumns={columns}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(position) => <ActionMenuTablePositions position={position} />}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
