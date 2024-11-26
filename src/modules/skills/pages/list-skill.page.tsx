import { useMemo } from 'react';

import { Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useSkillsQueryFilterStateContext } from '../contexts';
import { useGetListSkillQuery } from '../hooks/queries';
import { ActionMenuTableSkills, ActionTableSkillsWidget } from '../widgets';

import type { ISkill } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { getNumericalOrder } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';

export function ListSkillPage() {
  const { t } = useTranslation();
  const { skillsQueryState, resetSkillsQueryState } = useSkillsQueryFilterStateContext();
  const { permissions } = useAuthentication();

  const { listSkill, meta, isError, isLoading, handlePaginate, isRefetching } =
    useGetListSkillQuery({
      params: skillsQueryState.filters,
    });

  const columns = useMemo<ColumnsProps<ISkill>>(
    () => [
      {
        header: 'Skill',
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
      <Head title="Skill" />
      <StateHandler
        showLoader={isLoading}
        showError={!!isError}
        retryHandler={resetSkillsQueryState}
      >
        <ActionTableSkillsWidget />
        <TableComponent
          currentPage={meta.pageIndex}
          perPage={meta.pageSize}
          data={listSkill}
          groupColumns={columns}
          totalCount={meta.totalCount}
          isLoading={isLoading || isRefetching}
          isError={!!isError}
          additionalFeature={(skill) =>
            permissions[PermissionEnum.UPDATE_SKILL] || permissions[PermissionEnum.DELETE_SKILL] ? (
              <ActionMenuTableSkills skill={skill} />
            ) : undefined
          }
          onPageChange={handlePaginate}
        />
      </StateHandler>
    </>
  );
}
