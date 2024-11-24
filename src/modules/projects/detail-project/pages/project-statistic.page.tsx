import { useEffect, useMemo } from 'react';

import { Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { useGetStatusReport } from '../apis/get-status-report.api';

import type { IProject } from '../../list-project/types';

import { StateHandler } from '@/components/elements';

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
    // Only set the tab if it is not already set
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
    <StateHandler showLoader={isLoading} showError={!!isError}>
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
