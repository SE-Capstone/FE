import { useMemo } from 'react';

import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { useGetListLabelQuery } from '../hooks/queries';
import { ActionMenuTableLabels, ActionTableLabelsWidget } from '../widgets';

import type { ILabel } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';

export function ListLabelPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { listLabel, isError, isLoading, isRefetching } = useGetListLabelQuery({
    params: {
      projectId: projectId || '',
    },
  });

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

  return (
    <>
      <Head title="Label" />
      <StateHandler showLoader={isLoading} showError={!!isError}>
        <ActionTableLabelsWidget />
        <TableComponent
          withoutPagination
          data={listLabel}
          groupColumns={columns}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          additionalFeature={(label) => (
            <ActionMenuTableLabels label={label} listLabel={listLabel} />
          )}
        />
      </StateHandler>
    </>
  );
}
