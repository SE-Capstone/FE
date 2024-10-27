import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useSkillsQueryFilterStateContext } from '../contexts';
import { useGetListSkillQuery } from '../hooks/queries';
import { ActionMenuTableSkills, ActionTableSkillsWidget } from '../widgets';

import type { ISkill } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { Head, StateHandler, TableComponent } from '@/components/elements';
import { getNumericalOrder } from '@/libs/helpers';

export function ListSkillPage() {
  const { t } = useTranslation();
  const { skillsQueryState, resetSkillsQueryState } = useSkillsQueryFilterStateContext();

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
      <Head title="Skill" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetSkillsQueryState}
        >
          <Container maxW="container.2xl" centerContent>
            <ActionTableSkillsWidget />
            <TableComponent
              currentPage={meta.pageIndex}
              perPage={meta.pageSize}
              data={listSkill}
              groupColumns={columns}
              totalCount={meta.totalCount}
              isLoading={isLoading || isRefetching}
              isError={!!isError}
              additionalFeature={(skill) => <ActionMenuTableSkills skill={skill} />}
              onPageChange={handlePaginate}
            />
          </Container>
        </StateHandler>
      </Container>
    </>
  );
}
