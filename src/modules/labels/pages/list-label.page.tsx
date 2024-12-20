import { useEffect, useMemo } from 'react';

import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams, useSearchParams } from 'react-router-dom';

import { useGetListLabelQuery } from '../hooks/queries';
import { ActionMenuTableLabels, ActionTableLabelsWidget } from '../widgets';

import type { ILabel } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { getNumericalOrder } from '@/libs/helpers';

export function ListLabelPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { permissions } = useProjectContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const setTab = () => {
    const params = new URLSearchParams();
    params.set('tab', 'label');
    setSearchParams(params);
  };

  useEffect(() => {
    // Only set the tab if it is not already set
    if (searchParams.get('tab') !== 'label') {
      setTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
          additionalFeature={(label) =>
            permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) ? (
              <ActionMenuTableLabels label={label} listLabel={listLabel} />
            ) : undefined
          }
        />
      </StateHandler>
    </>
  );
}
