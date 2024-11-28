import { useCallback, useEffect, useMemo, useState } from 'react';

import { Grid, GridItem, SimpleGrid, Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { FaCircleCheck } from 'react-icons/fa6';
import { ImStatsBars2 } from 'react-icons/im';
import { IoIosListBox } from 'react-icons/io';
import { useSearchParams } from 'react-router-dom';

import { useGetTaskCompleteByDateReport } from '../apis/get-complete-task-by-date-report.api';
import { useGetOverviewProjectReport } from '../apis/get-overview-report.api';
import { useGetStatusReport } from '../apis/get-status-report.api';
import { useProjectStatisticQueryFilterStateContext } from '../context/project-statistic-query-filters.contexts';
import { CompleteTaskByDateChartWidget } from '../widgets/complete-task-by-date-chart.widget';
import { OverviewPieChartWidget } from '../widgets/overview-pie-chart.widget';

import type { IProject } from '../../list-project/types';
import type { IPhase } from '@/modules/phases/types';

import { CustomChakraReactSelect, SearchInput, StateHandler } from '@/components/elements';
import { Card } from '@/modules/dashboard/widgets/card-stat.widget';
import { useGetListPhaseQuery } from '@/modules/phases/hooks/queries';

Chart.register();

export function ProjectStatisticPage({ project }: { project?: IProject }) {
  const now = useMemo(() => new Date(), []);
  const { t } = useTranslation();
  const { projectStatisticQueryState, setProjectStatisticQueryFilterState } =
    useProjectStatisticQueryFilterStateContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [defaultPhase, setDefaultPhase] = useState<IPhase | undefined>(undefined);

  const updateQueryParams = useCallback(
    (key: string, value?: string) => {
      setSearchParams((prevParams) => {
        const params = new URLSearchParams(prevParams);
        if (value) {
          params.set(key, value);
        } else {
          params.delete(key);
        }
        return params;
      });
    },
    [setSearchParams]
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setProjectStatisticQueryFilterState({
      ...(params.get('phaseId') && { phaseId: params.get('phaseId') || '' }),
      ...(params.get('startDate') && { startDate: params.get('startDate') || '' }),
      ...(params.get('endDate') && { endDate: params.get('endDate') || '' }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setTab = () => {
    const params = new URLSearchParams();
    params.set('tab', 'statistic');
    setSearchParams(params);
  };

  useEffect(() => {
    if (searchParams.get('tab') !== 'statistic') {
      setTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const {
    listPhase,
    isLoading: isLoading5,
    isError: isError5,
  } = useGetListPhaseQuery({
    params: {
      projectId: project?.id || '',
    },
  });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('phaseId')) {
      const phase = listPhase.find((r) => r.id === params.get('phaseId'));
      setDefaultPhase(phase);
    }
  }, [listPhase]);

  const getStartDate = useMemo(
    () =>
      projectStatisticQueryState.filters.startDate ||
      (projectStatisticQueryState.filters.endDate
        ? new Date(
            new Date(projectStatisticQueryState.filters.endDate).setFullYear(
              new Date(projectStatisticQueryState.filters.endDate).getFullYear() - 1
            )
          )
        : new Date(new Date().setFullYear(new Date().getFullYear() - 1))),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [projectStatisticQueryState.filters.endDate, projectStatisticQueryState.filters.startDate]
  );

  const { statusReport, isLoading, isError, refetch } = useGetStatusReport({
    req: {
      body: {
        projectId: project?.id || '',
        phaseId: projectStatisticQueryState.filters.phaseId,
        startDate:
          projectStatisticQueryState.filters.startDate || projectStatisticQueryState.filters.endDate
            ? getStartDate
            : undefined,
        endDate: projectStatisticQueryState.filters.endDate
          ? projectStatisticQueryState.filters.endDate
          : undefined,
      },
    },
  });

  const {
    overviewReport,
    isLoading: isLoading2,
    isError: isError2,
  } = useGetOverviewProjectReport({
    req: {
      body: {
        projectId: project?.id || '',
        phaseId: projectStatisticQueryState.filters.phaseId,
        startDate:
          projectStatisticQueryState.filters.startDate || projectStatisticQueryState.filters.endDate
            ? getStartDate
            : undefined,
        endDate: projectStatisticQueryState.filters.endDate
          ? projectStatisticQueryState.filters.endDate
          : undefined,
      },
    },
  });

  const {
    taskCompleteByDateData,
    isLoading: isLoading3,
    isError: isError3,
  } = useGetTaskCompleteByDateReport({
    req: {
      body: {
        projectId: project?.id || '',
        phaseId: projectStatisticQueryState.filters.phaseId,
        startDate: getStartDate,
        endDate: projectStatisticQueryState.filters.endDate || now,
      },
    },
  });

  const overViewData = useCallback(() => {
    if (overviewReport || !isLoading2) {
      return {
        cardData: [
          {
            id: 1,
            label: t('chart.ongoingTasks'),
            score: overviewReport?.ongoingTasks || 0,
            icon: IoIosListBox,
            bg: 'primary',
          },
          {
            id: 2,
            label: t('chart.doneTasks'),
            score: overviewReport?.doneTasks || 0,
            icon: FaCircleCheck,
          },
          {
            id: 3,
            label: t('chart.totalTask'),
            score: overviewReport?.totalTasks || 0,
            icon: IoIosListBox,
          },
          {
            id: 4,
            label: t('chart.overallCompletionRate'),
            score: overviewReport?.overallCompletionRate || 0,
            icon: ImStatsBars2,
          },
        ],
        pieChartData: overviewReport?.taskCompletionRate || [],
      };
    }

    return {
      cardData: [
        {
          id: 1,
          label: t('chart.ongoingTasks'),
          score: 0,
          icon: IoIosListBox,
          bg: 'primary',
        },
        {
          id: 2,
          label: t('chart.doneTasks'),
          score: 0,
          icon: FaCircleCheck,
        },
        {
          id: 3,
          label: t('chart.totalTask'),
          score: 0,
          icon: IoIosListBox,
        },
        {
          id: 4,
          label: t('chart.overallCompletionRate'),
          score: 0,
          icon: ImStatsBars2,
        },
      ],
      pieChartData: [],
    };
  }, [isLoading2, overviewReport, t]);

  const taskCompleteByDate = useCallback(() => {
    if (taskCompleteByDateData || !isLoading3) {
      return taskCompleteByDateData || [];
    }

    return [];
  }, [isLoading3, taskCompleteByDateData]);

  useEffect(() => {
    if (project) {
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.id]);

  const chartData = useMemo(() => {
    if (!statusReport || isLoading) return { labels: [], datasets: [] };

    const uniqueStatuses = statusReport.statuses.map((status) => ({
      id: status.id,
      name: status.statusName,
    }));

    const datasets = uniqueStatuses.map((status) => ({
      label: status.name,
      data: statusReport.users.map((user) => {
        const taskStatus = user.userTaskStatuses.find((us) => us.statusId === status.id);
        return taskStatus ? taskStatus.total : 0;
      }),
    }));

    return {
      labels: statusReport.users.map((user) => user.fullName),
      datasets,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, statusReport, project]);

  return (
    <StateHandler
      showLoader={isLoading || isLoading2 || isLoading3 || isLoading5}
      showError={!!isError || !!isError2 || !!isError3 || !!isError5}
    >
      <Grid
        alignItems="center"
        gap={2}
        templateColumns={{
          base: 'repeat(1, 1fr)',
          md: 'repeat(3, 1fr)',
        }}
      >
        <GridItem colSpan={1}>
          <CustomChakraReactSelect
            key={defaultPhase?.id}
            isSearchable={false}
            size="md"
            placeholder={`${t('common.choose')} ${t('common.phase').toLowerCase()}...`}
            options={listPhase.map((s) => ({ label: s.title, value: s.id }))}
            defaultValue={
              searchParams.get('phaseId') && defaultPhase
                ? {
                    label: defaultPhase.title,
                    value: searchParams.get('phaseId') || '',
                  }
                : undefined
            }
            onChange={(opt) => {
              setProjectStatisticQueryFilterState({
                phaseId: opt?.value || undefined,
              });
              updateQueryParams('phaseId', opt?.value);
            }}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <SearchInput
            placeholder={`${t('common.choose')} ${t('fields.startDate').toLowerCase()}...`}
            type="date"
            isSetMax={!!projectStatisticQueryState.filters.endDate}
            maxDate={
              projectStatisticQueryState.filters.endDate
                ? new Date(projectStatisticQueryState.filters.endDate)
                : undefined
            }
            initValue={projectStatisticQueryState.filters.startDate || ''}
            inputGroupProps={{
              size: 'lg',
            }}
            bg="white"
            onHandleSearch={(keyword) => {
              setProjectStatisticQueryFilterState({ startDate: keyword });
              updateQueryParams('startDate', keyword);
            }}
          />
        </GridItem>
        <GridItem colSpan={1}>
          <SearchInput
            placeholder={`${t('common.choose')} ${t('fields.endDate').toLowerCase()}...`}
            type="date"
            isSetMax
            maxDate={new Date()}
            minDate={
              projectStatisticQueryState.filters.startDate
                ? new Date(projectStatisticQueryState.filters.startDate)
                : undefined
            }
            initValue={projectStatisticQueryState.filters.endDate || ''}
            inputGroupProps={{
              size: 'lg',
            }}
            bg="white"
            onHandleSearch={(keyword) => {
              setProjectStatisticQueryFilterState({ endDate: keyword });
              updateQueryParams('endDate', keyword);
            }}
          />
        </GridItem>
      </Grid>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5} mt={6} mb={6}>
        {overViewData().cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </SimpleGrid>
      <CompleteTaskByDateChartWidget data={taskCompleteByDate()} />
      <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={5}>
        <OverviewPieChartWidget data={overViewData().pieChartData} />
        <Stack
          bg="white"
          p={5}
          flex={1}
          flexBasis="10%"
          rounded={2.5}
          spacing={3}
          overflowX="auto"
          maxHeight="500px"
        >
          <Bar
            data={chartData}
            options={{
              plugins: {
                title: {
                  display: true,
                  text: t('chart.statusReport'),
                  font: {
                    size: 18,
                  },
                },
              },
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                },
              },
            }}
          />
        </Stack>
      </SimpleGrid>
    </StateHandler>
  );
}
