import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { usePositionsQueryFilterStateContext } from '../contexts';
import { useGetListPositionQuery } from '../hooks/queries';
import { ActionMenuTablePositions, ActionTablePositionsWidget } from '../widgets';

import type { IPosition } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { getNumericalOrder } from '@/libs/helpers';
import { Error403Page } from '@/modules/errors';
import { useAuthentication } from '@/modules/profile/hooks';

export function ListPositionPage() {
  const { t } = useTranslation();
  const { positionsQueryState, resetPositionsQueryState } = usePositionsQueryFilterStateContext();
  const { permissions } = useAuthentication();

  const { listPosition, meta, isError, isLoading, isRefetching, handlePaginate } =
    useGetListPositionQuery({
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
            key: 'title',
            title: t('fields.title'),
            hasSort: false,
            Cell({ title }) {
              return <>{title}</>;
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
        ],
      },
    ],
    [t]
  );

  if (!permissions[PermissionEnum.GET_POSITION]) {
    return <Error403Page />;
  }

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
              currentPage={meta.pageIndex}
              perPage={meta.pageSize}
              data={listPosition}
              groupColumns={columns}
              totalCount={meta.totalCount}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(position) =>
                permissions[PermissionEnum.UPDATE_POSITION] ||
                permissions[PermissionEnum.DELETE_POSITION] ? (
                  <ActionMenuTablePositions position={position} />
                ) : undefined
              }
              onPageChange={handlePaginate}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
