import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ProjectMembersWidget } from './project-members.widget';
import { BadgeStatus } from '../components';

import type { IProject, ProjectStatusEnum } from '../../list-project/types';

import { Head } from '@/components/elements';
import { ChangeStatus } from '@/components/widgets/change-status';
import { PermissionEnum } from '@/configs';
import { formatDate } from '@/libs/helpers';
import { InfoCard } from '@/modules/profile/components';

export function BaseInformationProjectWidget({
  project,
  permissions,
}: {
  project?: IProject;
  permissions: Record<string, boolean>;
}) {
  const { t } = useTranslation();

  const infoData = [
    {
      label: t('fields.name'),
      text: project?.name || '',
    },
    {
      label: t('fields.code'),
      text: project?.code || '',
    },
    {
      label: t('fields.description'),
      text: project?.description || '',
    },
    permissions[PermissionEnum.GET_ALL_PROJECT] && {
      label: t('fields.status'),
      text: <BadgeStatus status={project?.status as ProjectStatusEnum} />,
    },
    permissions[PermissionEnum.GET_ALL_PROJECT] && {
      label: t('fields.visible'),
      text: (
        <ChangeStatus
          id={project?.id || ''}
          initStatus={project?.isVisible || false}
          title={
            project?.isVisible
              ? `${t('actions.archive')} ${t('common.project').toLowerCase()}?`
              : `${t('actions.unarchive')} ${t('common.project').toLowerCase()}?`
          }
          description={
            project?.isVisible ? t('actions.archiveProject') : t('actions.unarchiveProject')
          }
        />
      ),
    },
    {
      label: t('fields.startDate'),
      text: project?.startDate
        ? formatDate({ date: project?.startDate, format: 'DD-MM-YYYY' })
        : '',
    },
    {
      label: t('fields.endDate'),
      text: project?.endDate ? formatDate({ date: project?.endDate, format: 'DD-MM-YYYY' }) : '',
    },
  ].filter(Boolean);

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
              {t('header.projectInformation')}
            </Text>
            <InfoCard
              data={infoData}
              labelProps={{
                sx: {
                  w: '150px',
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
