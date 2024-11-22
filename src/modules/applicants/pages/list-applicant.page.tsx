import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useApplicantsQueryFilterStateContext } from '../contexts';
import { useGetListApplicantQuery } from '../hooks/queries';
import { ActionMenuTableApplicants, ActionTableApplicantsWidget } from '../widgets';

import type { IApplicant } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { formatDate, getNumericalOrder, phoneNumberAutoFormat } from '@/libs/helpers';

export function ListApplicantPage() {
  const { t } = useTranslation();
  const { applicantsQueryState, resetApplicantsQueryState } =
    useApplicantsQueryFilterStateContext();

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
            title: t('fields.name'),
            hasSort: false,
            Cell({ name }) {
              return <>{name}</>;
            },
          },
          {
            key: 'phoneNumber',
            title: t('fields.phone'),
            hasSort: false,
            Cell({ phoneNumber }) {
              return <Text>{phoneNumberAutoFormat(phoneNumber || '')}</Text>;
            },
          },
          {
            key: 'cvFile',
            title: 'CV',
            hasSort: false,
            Cell({ cvLink }) {
              return (
                <>
                  {cvLink && (
                    <CustomLink target="_blank" to={cvLink}>
                      View
                    </CustomLink>
                  )}
                </>
              );
            },
          },
          {
            key: 'updatedBy',
            title: t('fields.updatedBy'),
            hasSort: false,
            Cell({ updatedBy }) {
              return <>{updatedBy || ''}</>;
            },
          },
          {
            key: 'startDate',
            title: t('fields.startDate'),
            hasSort: false,
            Cell({ startDate }) {
              return <>{startDate ? formatDate({ date: startDate, format: 'DD-MM-YYYY' }) : ''}</>;
            },
          },
          {
            key: 'updatedAt',
            title: t('fields.updatedAt'),
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
    [meta.pageIndex, meta.pageSize, t]
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
