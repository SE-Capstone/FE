import { useMemo } from 'react';

import { Stack } from '@chakra-ui/react';
import Chart from 'chart.js/auto';
import { Bar } from 'react-chartjs-2';
import { useTranslation } from 'react-i18next';

import { useGetSkillsReport } from '../apis/get-skills-report.api';

export type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number;
  }[];
};
Chart.register();

export const ReportSkillsWidget = () => {
  const { t } = useTranslation();

  const { data: skillsReport, isLoading } = useGetSkillsReport({
    body: {},
  });

  const chartData = useMemo(() => {
    if (!skillsReport || isLoading) return { labels: [], datasets: [] };
    return {
      labels: skillsReport.map((item) => item.title),
      datasets: [
        {
          label: t('common.total'),
          data: skillsReport.map((item) => item.userCount),
        },
      ],
    };
  }, [isLoading, skillsReport, t]);

  return (
    <Stack bg="white" p={5} rounded={2.5} overflowX="auto" maxHeight="500px">
      {/* <Text fontSize="lg">{t('chart.skillsReport')}</Text> */}
      <Bar
        data={chartData}
        title={t('chart.skillsReport')}
        options={{
          plugins: {
            title: {
              display: true,
              text: t('chart.skillsReport'),
              font: {
                size: 18,
              },
            },
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              ticks: {
                stepSize: 1,
              },
            },
          },
        }}
      />
    </Stack>
  );
};
