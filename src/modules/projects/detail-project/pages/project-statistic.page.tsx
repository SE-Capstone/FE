import { useCallback, useEffect, useMemo } from 'react';

import { SimpleGrid, Stack } from '@chakra-ui/react';
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
import { CompleteTaskByDateChartWidget } from '../widgets/complete-task-by-date-chart.widget';
import { OverviewPieChartWidget } from '../widgets/overview-pie-chart.widget';

import type { IProject } from '../../list-project/types';

import { StateHandler } from '@/components/elements';
import { Card } from '@/modules/dashboard/widgets/card-stat.widget';

Chart.register();

export function ProjectStatisticPage({ project }: { project?: IProject }) {
  const { t } = useTranslation();

  const [searchParams, setSearchParams] = useSearchParams();

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

  const { statusReport, isLoading, isError, refetch } = useGetStatusReport({
    req: {
      body: {
        projectId: project?.id || '',
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
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
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
      showLoader={isLoading || isLoading2 || isLoading3}
      showError={!!isError || !!isError2 || !!isError3}
    >
      <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={5} mt={6} mb={6}>
        {overViewData().cardData.map((data, index) => (
          <Card key={index} data={data} />
        ))}
      </SimpleGrid>
      <CompleteTaskByDateChartWidget data={taskCompleteByDate()} />
      <OverviewPieChartWidget data={overViewData().pieChartData} />
      <Stack
        bg="white"
        p={5}
        flex={1}
        mt={5}
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
    </StateHandler>
  );
}
