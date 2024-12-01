import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useApplicantsQueryFilterStateContext } from '../contexts';
import { useGetListApplicantQuery } from '../hooks/queries';
import { ActionMenuTableApplicants, ActionTableApplicantsWidget } from '../widgets';

import type { IApplicant } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { formatDate, getNumericalOrder, phoneNumberAutoFormat } from '@/libs/helpers';
import { Error403Page } from '@/modules/errors';
import { useAuthentication } from '@/modules/profile/hooks';

export function ListApplicantPage() {
  const { t } = useTranslation();
  const { applicantsQueryState, resetApplicantsQueryState } =
    useApplicantsQueryFilterStateContext();
  const { permissions } = useAuthentication();

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
            key: 'email',
            title: t('fields.email'),
            hasSort: false,
            Cell({ email }) {
              return <>{email}</>;
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

  if (!permissions[PermissionEnum.GET_APPLICANT]) {
    return <Error403Page />;
  }

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
              showChangeEntries
              additionalFeature={(applicant) =>
                permissions[PermissionEnum.UPDATE_APPLICANT] ||
                permissions[PermissionEnum.DELETE_APPLICANT] ? (
                  <ActionMenuTableApplicants applicant={applicant} />
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
