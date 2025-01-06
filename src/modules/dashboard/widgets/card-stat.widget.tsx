import { useCallback, useMemo, useState } from 'react';

import {
  HStack,
  VStack,
  Text,
  useColorModeValue,
  Flex,
  Icon,
  SimpleGrid,
  Stack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BsStack } from 'react-icons/bs';
import { FaUserTie } from 'react-icons/fa';
import { GoProjectRoadmap } from 'react-icons/go';
import { HiUsers } from 'react-icons/hi';
import { IoIosListBox } from 'react-icons/io';

import { useGetReportOverview } from '../apis/get-report-overview.api';
import { useGetReportUserOverview } from '../apis/get-report-user-overview.api';

import type { ColumnsProps } from '@/components/elements';

import { CustomLink, TableComponent } from '@/components/elements';
import { BadgeIssue } from '@/modules/issues/list-issue/components';
import { APP_PATHS } from '@/routes/paths/app.paths';

export type IIssueDash = {
  id: string;
  color: string;
  index: number;
  projectId: string;
  projectName: string;
  statusName: string;
  taskId: string;
  taskName: string;
  userId: string;
  userName: string;
};

interface StatData {
  label: string;
  score: number;
  icon: any;
  data?: IIssueDash[];
  cursor?: boolean;
  bg?: string;
}

export const Card = ({ data }: { data: StatData }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleClick = () => {
    if (data.data) {
      setIsModalOpen(true);
    }
  };

  const columns = useMemo<ColumnsProps<IIssueDash>>(
    () => [
      {
        header: 'Issue',
        columns: [
          {
            key: 'index',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell({ index, color }) {
              return <BadgeIssue content={`#${index}`} variant="solid" colorScheme={color} />;
            },
          },
          {
            key: 'projectName',
            title: t('fields.title'),
            hasSort: false,
            Cell({ projectName, projectId }) {
              return (
                <CustomLink
                  to={APP_PATHS.detailProject(projectId)}
                  noOfLines={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {projectName || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'status',
            title: t('common.status'),
            hasSort: false,
            Cell({ statusName, color }) {
              return <BadgeIssue content={statusName} colorScheme={color} />;
            },
          },
          {
            key: 'title',
            title: t('fields.title'),
            hasSort: false,
            Cell({ projectId, taskId, taskName }) {
              return (
                <CustomLink
                  to={APP_PATHS.detailIssue(projectId, taskId)}
                  noOfLines={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  {taskName || ''}
                </CustomLink>
              );
            },
          },
        ],
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data.data, t]
  );

  return (
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
      _hover={{
        cursor: data.cursor && 'pointer',
      }}
      onClick={handleClick}
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

      {data.data && (
        <Modal isOpen={isModalOpen} isCentered size="6xl" onClose={() => setIsModalOpen(false)}>
          <ModalOverlay />
          <ModalContent maxHeight="600px" overflowY="auto">
            <ModalHeader>{t('common.issues')}</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <TableComponent
                data={data.data}
                groupColumns={columns}
                isLoading={false}
                isError={false}
                withoutPagination
              />
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </Stack>
  );
};

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
          cursor: true,
          data: data.overViewTasks,
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
          cursor: true,
          data: dataUser.overViewTasks,
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
