import { useMemo } from 'react';

import { Text, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { LuInfo } from 'react-icons/lu';
import { useParams } from 'react-router-dom';

import { useGetListStatusQuery } from '../hooks/queries';
import { ActionMenuTableStatuses, ActionTableStatusesWidget } from '../widgets';

import type { IStatus } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { ChangeStatus } from '@/components/widgets/change-status';
import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { getNumericalOrder } from '@/libs/helpers';
import { BadgeIssue } from '@/modules/issues/list-issue/components';

export function ListStatusPage() {
  const { t } = useTranslation();
  const { projectId } = useParams();
  const { permissions } = useProjectContext();
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
          {
            key: 'isDone',
            title: t('fields.isDone'),
            hasSort: false,
            additionalTitle: (
              <Tooltip label={t('common.isDoneTooltip')}>
                <Text ml={1} as="span" color="textColor" fontSize="17px" fontWeight="600">
                  <LuInfo />
                </Text>
              </Tooltip>
            ),
            Cell(status) {
              return (
                <ChangeStatus
                  id={status?.id || ''}
                  initStatus={status?.isDone || false}
                  isUpdateStatus
                  title={status?.isDone ? `${t('actions.inactive')}?` : `${t('actions.active')}?`}
                  status={status}
                  isLoading={
                    !permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) && true
                  }
                  description={status?.isDone ? t('actions.markAsUndone') : t('actions.markAsDone')}
                />
              );
            },
          },
        ],
      },
    ],
    [permissions, t]
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
          additionalFeature={(status) =>
            permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) ? (
              <ActionMenuTableStatuses status={status} listStatus={listStatus} />
            ) : undefined
          }
        />
      </StateHandler>
    </>
  );
}
