import { useMemo } from 'react';

import { Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Pie } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { useGetReportProjectsByStatus } from '../apis/get-report-project-by-status.api';

import { PROJECT_STATUS_VALUES } from '@/configs';

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number;
  }[];
};
Chart.register();

export const ReportProjectsByStatusWidget = () => {
  const { t } = useTranslation();

  const { data: projectsByStatusReport, isLoading } = useGetReportProjectsByStatus({
    params: {
      year: new Date().getFullYear(),
    },
  });

  const chartData = useMemo(() => {
    if (!projectsByStatusReport || isLoading) return { labels: [], datasets: [] };
    return {
      labels: projectsByStatusReport.map((item) => PROJECT_STATUS_VALUES(t)[item.status]),
      datasets: [
        {
          label: t('common.total'),
          data: projectsByStatusReport.map((item) => item.count),
        },
      ],
    };
  }, [isLoading, projectsByStatusReport, t]);

  return (
    <Stack bg="white" p={5} rounded={2.5} overflowX="auto">
      <Pie
        data={chartData}
        title={t('chart.projectsByStatusReport')}
        options={{
          plugins: {
            title: {
              display: true,
              text: t('chart.projectsByStatusReport'),
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
