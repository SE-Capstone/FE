import { Stack, Text } from '@chakra-ui/react';

import { ProjectMembersWidget } from './project-members.widget';
import { BadgeStatus } from '../components';

import type { IProject, ProjectStatusEnum } from '../../list-project/types';

import { Head } from '@/components/elements';
import { formatDate } from '@/libs/helpers';
import { InfoCard } from '@/modules/profile/components';

export function BaseInformationProjectWidget({ project }: { project?: IProject }) {
  const infoData = [
    {
      label: 'Name',
      text: project?.name || '',
    },
    {
      label: 'Code',
      text: project?.code || '',
    },
    {
      label: 'Description',
      text: project?.description || '',
    },
    {
      label: 'Status',
      text: <BadgeStatus status={project?.status as ProjectStatusEnum} />,
    },
    {
      label: 'Isvisible',
      text: project?.isVisible ? 'Yes' : 'No',
    },
    {
      label: 'Start date',
      text: project?.startDate
        ? formatDate({ date: project?.startDate, format: 'DD-MM-YYYY' })
        : '',
    },
    {
      label: 'End date',
      text: project?.endDate ? formatDate({ date: project?.endDate, format: 'DD-MM-YYYY' }) : '',
    },
  ];

  return (
    <>
      <Head title={`Project - ${project?.name}`} />
      <Stack direction={{ base: 'column', xl: 'row' }} alignItems="stretch" spacing="24px" w="100%">
        <Stack w="full" spacing="24px" flex={2.8}>
          <Stack padding="24px" borderRadius="8px" direction="column" spacing="24px" bg="white">
            <Text
              sx={{
                fontWeight: 'semibold',
                fontSize: '20px',
                lineHeight: '27px',
                paddingBottom: '24px',
                borderBottom: '1px solid',
                borderColor: 'neutral.500',
              }}
            >
              Project information
            </Text>
            <InfoCard
              data={infoData}
              labelProps={{
                sx: {
                  w: '100px',
                },
              }}
            />
            <Stack />
          </Stack>
        </Stack>

        <ProjectMembersWidget project={project} />
      </Stack>
    </>
  );
}
