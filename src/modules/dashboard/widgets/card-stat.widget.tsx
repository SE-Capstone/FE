import { useCallback } from 'react';

import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsStack } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';
import { GoProjectRoadmap } from 'react-icons/go';
import { HiUsers } from 'react-icons/hi';
import { IoIosListBox } from 'react-icons/io';

import { useGetReportOverview } from '../apis/get-report-overview.api';
import { useGetReportUserOverview } from '../apis/get-report-user-overview.api';

interface StatData {
  label: string;
  score: number;
  icon: any;
  bg?: string;
}

export const Card = ({ data }: { data: StatData }) => (
  <Stack
    direction="column"
    rounded="md"
    boxShadow={useColorModeValue(
      '0 4px 6px rgba(160, 174, 192, 0.6)',
      '2px 4px 6px rgba(9, 17, 28, 0.9)'
    )}
    w="100%"
    textAlign="left"
    align="start"
    spacing={0}
    role="group"
    overflow="hidden"
  >
    <HStack py={6} px={5} spacing={4} bg="white" w="100%" h="100%">
      <Flex
        justifyContent="center"
        alignItems="center"
        rounded="lg"
        p={2}
        bg={data.bg || 'green.400'}
        position="relative"
        w={12}
        h={12}
        overflow="hidden"
        lineHeight={0}
        boxShadow="inset 0 0 1px 1px rgba(0, 0, 0, 0.015)"
      >
        <Icon as={data.icon} w={6} h={6} color="white" />
      </Flex>
      <VStack spacing={0} align="start" justifyContent="space-evenly" maxW="lg" h="100%">
        <Text as="h3" fontSize="md" noOfLines={2} color="gray.400">
          {data.label}
        </Text>
        <HStack spacing={2}>
          <Text as="h2" fontSize="lg" fontWeight="extrabold">
            {data.score}
          </Text>
        </HStack>
      </VStack>
    </HStack>
  </Stack>
);

const StatsWithIcons = () => {
  const { t } = useTranslation();
  const { data } = useGetReportOverview({});
  const { data: dataUser } = useGetReportUserOverview({});

  const statData = useCallback(() => {
    if (data) {
      return [
        {
          label: t('chart.totalUser'),
          score: data.totalEmployee,
          icon: HiUsers,
        },
        {
          label: t('chart.ongoingProjects'),
          score: data.totalProjects,
          icon: GoProjectRoadmap,
          bg: 'primary',
        },
        {
          label: t('chart.completedProjects'),
          score: data.totalProjectsDone,
          icon: GoProjectRoadmap,
        },
        {
          label: t('chart.totalSkill'),
          score: data.totalSkillsEmployee,
          icon: BsStack,
        },
        {
          label: t('chart.ongoingTasks'),
          score: data.ongoingTasks,
          icon: IoIosListBox,
          bg: 'primary',
        },
        {
          label: t('chart.totalTask'),
          score: data.totalTasks,
          icon: IoIosListBox,
        },
      ];
    }
    if (dataUser) {
      return [
        {
          label: t('chart.totalTask'),
          score: dataUser.totalTasks,
          icon: GoProjectRoadmap,
        },
        {
          label: t('chart.ongoingTasks'),
          score: dataUser.totalCurrentTasks,
          icon: GoProjectRoadmap,
          bg: 'primary',
        },
        {
          label: t('chart.doneTasks'),
          score: dataUser.totalTasksDone,
          icon: GoProjectRoadmap,
        },
        {
          label: t('chart.totalSkill'),
          score: dataUser.totalSkills,
          icon: BsStack,
        },
        {
          label: t('chart.ongoingProjects'),
          score: dataUser.totalCurrentProjects,
          icon: IoIosListBox,
          bg: 'primary',
        },
        {
          label: t('chart.totalProject'),
          score: dataUser.totalProjects,
          icon: IoIosListBox,
        },
        {
          label: t('chart.totalProjectsLead'),
          score: dataUser.totalProjectsLead,
          icon: FaUserTie,
        },
      ];
    }
    return [];
  }, [data, dataUser, t]);

  return (
    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5} mt={6} mb={6}>
      {statData().map((data, index) => (
        <Card key={index} data={data} />
      ))}
    </SimpleGrid>
  );
};

export default StatsWithIcons;
