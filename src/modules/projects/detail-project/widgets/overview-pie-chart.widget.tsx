import { useMemo } from 'react';

import { Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import type { TaskCompletionByStatus } from '../apis/get-overview-report.api';

Chart.register();

export const OverviewPieChartWidget = ({ data }: { data: TaskCompletionByStatus[] }) => {
  const { t } = useTranslation();

  const chartData = useMemo(
    () => ({
      labels: data.map((item) => item.status),
      datasets: [
        {
          label: `${t('common.percentage')}(%)`,
          data: data.map((item) => item.percentage),
        },
      ],
    }),
    [data, t]
  );

  return (
    <Stack bg="white" p={5} rounded={2.5} overflowX="auto">
      <Pie
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
            x: {
              display: false,
            },
            y: {
              display: false,
            },
          },
        }}
      />
    </Stack>
  );
};
