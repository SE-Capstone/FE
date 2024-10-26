import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useJobsQueryFilterStateContext } from '../contexts';
import { useGetListJobQuery } from '../hooks/queries';
import { ActionMenuTableJobs, ActionTableJobsWidget } from '../widgets';

import type { IJob } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';

export function ListJobPage() {
  const { t } = useTranslation();
  const { jobsQueryState, resetJobsQueryState } = useJobsQueryFilterStateContext();

  const { listJob, meta, isError, isLoading, handlePaginate, isRefetching } = useGetListJobQuery({
    params: jobsQueryState.filters,
  });

  const columns = useMemo<ColumnsProps<IJob>>(
    () => [
      {
        header: 'Job',
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
      <Head title="Job" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetJobsQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTableJobsWidget />
            <TableComponent
              currentPage={meta.pageIndex}
              perPage={meta.pageSize}
              data={listJob}
              groupColumns={columns}
              totalCount={meta.totalCount}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(job) => <ActionMenuTableJobs job={job} />}
              onPageChange={handlePaginate}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
