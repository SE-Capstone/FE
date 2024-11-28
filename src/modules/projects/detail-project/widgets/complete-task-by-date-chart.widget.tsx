import { useMemo } from 'react';

import { Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Line } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import type { TaskCompletionByDate } from '../apis/get-complete-task-by-date-report.api';

Chart.register();

export const CompleteTaskByDateChartWidget = ({ data }: { data: TaskCompletionByDate[] }) => {
  const { t } = useTranslation();

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.period),
      datasets: [
        {
          label: `${t('chart.doneTasks')}`,
          data: data.map((item) => item.completedTasks),
        },
      ],
    }),
    [data, t]
  );

  return (
    <Stack bg="white" p={5} rounded={2.5} mb={5} maxHeight="500px" overflowX="auto">
      <Line
        data={chartData}
        title={t('chart.statusReport')}
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
            y: {
              min: 0,
            },
          },
        }}
      />
    </Stack>
  );
};
