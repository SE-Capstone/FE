import { useMemo, useState } from 'react';

import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
} from '@chakra-ui/react';
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState<any>(null);

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

  const handleChartClick = (elements: any) => {
    if (elements.length > 0) {
      const { index } = elements[0];
      const skill = skillsReport[index];
      setSelectedSkill(skill);
      setIsModalOpen(true);
    }
  };

  return (
    <Stack bg="white" p={5} rounded={2.5} overflowX="auto" maxHeight="500px">
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
          onClick: (_: any, elements: any) => handleChartClick(elements),
          onHover: (event: any, chartElement: any) => {
            event.native.target.style.cursor = chartElement.length ? 'pointer' : 'default';
          },
        }}
      />

      <Modal isOpen={isModalOpen} isCentered onClose={() => setIsModalOpen(false)}>
        <ModalOverlay />
        <ModalContent maxHeight="600px" overflowY="auto">
          <ModalHeader>
            {selectedSkill?.title} ({selectedSkill?.userCount})
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={2}>
              {selectedSkill?.users?.map((user: any) => (
                <Text key={user.id}>
                  {user.fullName} ({user.userName})
                </Text>
              ))}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Stack>
  );
};
