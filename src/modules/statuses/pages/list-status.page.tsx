import { useMemo } from 'react';

import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetListStatusQuery } from '../hooks/queries';
import { ActionMenuTableStatuses, ActionTableStatusesWidget } from '../widgets';

import type { IStatus } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';
import { BadgeIssue } from '@/modules/issues/list-issue/components';

export function ListStatusPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { listStatus, isError, isLoading, isRefetching } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const columns = useMemo<ColumnsProps<IStatus>>(
    () => [
      {
        header: 'Status',
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
            Cell({ name, color }) {
              return <BadgeIssue content={name} colorScheme={color} />;
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

  return (
    <>
      <Head title="Status" />
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <ActionTableStatusesWidget />
        <TableComponent
          withoutPagination
          data={listStatus}
          groupColumns={columns}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          additionalFeature={(status) => (
            <ActionMenuTableStatuses status={status} listStatus={listStatus} />
          )}
        />
      </StateHandler>
    </>
  );
}
