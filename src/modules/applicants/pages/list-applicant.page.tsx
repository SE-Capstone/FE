import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { useApplicantsQueryFilterStateContext } from '../contexts';
import { useGetListApplicantQuery } from '../hooks/queries';
import { ActionMenuTableApplicants, ActionTableApplicantsWidget } from '../widgets';

import type { IApplicant } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { formatDate, getNumericalOrder, phoneNumberAutoFormat } from '@/libs/helpers';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListApplicantPage() {
  const { applicantsQueryState, resetApplicantsQueryState } =
    useApplicantsQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listApplicant, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListApplicantQuery({
      params: applicantsQueryState.filters,
    });

  const columns = useMemo<ColumnsProps<IApplicant>>(
    () => [
      {
        header: 'Applicant',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return (
                <>
                  {getNumericalOrder({
                    page: meta.pageIndex,
                    perPage: meta.pageSize,
                    index,
                  })}
                </>
              );
            },
          },
          {
            key: 'name',
            title: 'Name',
            hasSort: false,
            Cell({ name, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listApplicant) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {name}
                </CustomLink>
              );
            },
          },
          {
            key: 'phoneNumber',
            title: 'Phone',
            hasSort: false,
            Cell({ phoneNumber }) {
              return <Text>{phoneNumberAutoFormat(phoneNumber || '')}</Text>;
            },
          },
          {
            key: 'updatedBy',
            title: 'Updated by',
            hasSort: false,
            Cell({ updatedBy }) {
              return <>{updatedBy || ''}</>;
            },
          },
          {
            key: 'startDate',
            title: 'Start date',
            hasSort: false,
            Cell({ startDate }) {
              return <>{startDate ? formatDate({ date: startDate, format: 'DD-MM-YYYY' }) : ''}</>;
            },
          },
          {
            key: 'updatedAt',
            title: 'Updated at',
            hasSort: false,
            Cell({ updatedAt, createdAt }) {
              return (
                <>{formatDate({ date: updatedAt || createdAt, format: 'DD-MM-YYYY: HH:mm' })}</>
              );
            },
          },
        ],
      },
    ],
    [meta.pageIndex, meta.pageSize, pathname]
  );

  return (
    <>
      <Head title="Applicants" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetApplicantsQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTableApplicantsWidget />
            <TableComponent
              currentPage={meta.pageIndex}
              perPage={meta.pageSize}
              data={listApplicant}
              groupColumns={columns}
              totalCount={meta.totalCount}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(applicant) => <ActionMenuTableApplicants applicant={applicant} />}
              onPageChange={handlePaginate}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
