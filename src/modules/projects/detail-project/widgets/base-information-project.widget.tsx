import { useMemo } from 'react';

import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ProjectMembersWidget } from './project-members.widget';
import { ProjectStatusEnum, type IProject } from '../../list-project/types';
import { BadgeStatus } from '../components';
import { useUpsertProjectHook } from '../hooks/mutations/use-upsert-project.mutation.hooks';

import type { IUser } from '@/modules/users/list-user/types';

import { Head } from '@/components/elements';
import { ChangeStatus } from '@/components/widgets/change-status';
import { PermissionEnum, PROJECT_STATUS_OPTIONS } from '@/configs';
import { formatDate } from '@/libs/helpers';
import InlineEditableField from '@/modules/issues/list-issue/components/inline-edit-field';
import { InlineEditCustomSelect } from '@/modules/issues/list-issue/widgets/editable-dropdown.widget';
import { InfoCard } from '@/modules/profile/components';

export function BaseInformationProjectWidget({
  project,
  teamLeads,
  permissions,
}: {
  teamLeads: IUser[];
  project?: IProject;
  permissions: Record<string, boolean>;
}) {
  const { t } = useTranslation();

  const { handleUpsertProject } = useUpsertProjectHook({ id: project?.id || '', isUpdate: true });

  const handleSubmit = (value: string, fieldName?: string) => {
    if (project) {
      handleUpsertProject({
        ...project,
        startDate: formatDate({
          date: project.startDate,
          format: 'YYYY-MM-DD',
        }) as unknown as Date,
        endDate: formatDate({
          date: project.endDate,
          format: 'YYYY-MM-DD',
        }) as unknown as Date,
        leadId: project.leadId,
        ...(fieldName === 'name' && {
          name: value || project.name,
        }),
        ...(fieldName === 'description' && {
          description: value || project.description,
        }),
        ...(fieldName === 'code' && {
          code: value || project.code,
        }),
        ...(fieldName === 'startDate' && {
          startDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (formatDate({
              date: project.startDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date),
        }),
        ...(fieldName === 'endDate' && {
          endDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (formatDate({
              date: project.endDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date),
        }),
      });
    }
  };

  const infoData = useMemo(
    () =>
      [
        {
          label: t('fields.name'),
          text: (
            <InlineEditableField
              fieldValue={project?.name || ''}
              callback={handleSubmit}
              fieldName="name"
            />
          ),
        },
        {
          label: t('fields.code'),
          text: (
            <InlineEditableField
              fieldValue={project?.code || ''}
              callback={handleSubmit}
              fieldName="code"
            />
          ),
        },
        {
          label: t('fields.description'),
          text: (
            <InlineEditableField
              fieldValue={project?.description || ''}
              callback={handleSubmit}
              fieldName="description"
              isTextArea
            />
          ),
        },
        {
          label: t('fields.teamLead'),
          text: (
            <InlineEditCustomSelect
              options={teamLeads.map((user) => ({
                label: user.userName,
                value: user.id,
                image: user.avatar,
              }))}
              defaultValue={
                project?.leadId
                  ? {
                      label: project?.leadName || '',
                      value: project?.leadId || '',
                      image: project?.leadAvatar,
                    }
                  : undefined
              }
              field="lead"
              project={project}
            />
          ),
        },
        permissions[PermissionEnum.READ_LIST_PROJECT] && {
          label: t('fields.status'),
          text: (
            <InlineEditCustomSelect
              options={PROJECT_STATUS_OPTIONS.map((s) => ({
                label: <BadgeStatus status={s} />,
                value: s,
              }))}
              defaultValue={{
                label: <BadgeStatus status={project?.status as ProjectStatusEnum} />,
                value: project?.status || ProjectStatusEnum.NotStarted,
              }}
              field="status"
              project={project}
            />
          ),
        },
        permissions[PermissionEnum.READ_LIST_PROJECT] && {
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
          // text: project?.startDate
          //   ? formatDate({ date: project?.startDate, format: 'DD-MM-YYYY' })
          //   : '',
          text: (
            <InlineEditableField
              fieldValue={
                project?.startDate
                  ? formatDate({ date: project?.startDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              callback={handleSubmit}
              fieldName="startDate"
              type="date"
              styleProps={{ transform: 'translate(0, -4px)' }}
            />
          ),
        },
        {
          label: t('fields.endDate'),
          text: (
            <InlineEditableField
              fieldValue={
                project?.endDate
                  ? formatDate({ date: project?.endDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              callback={handleSubmit}
              fieldName="endDate"
              type="date"
              startDate={
                project?.startDate
                  ? formatDate({ date: project?.startDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              styleProps={{ transform: 'translate(0, -4px)' }}
            />
          ),
        },
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, project, t, teamLeads]
  );

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
              stackProps={{ alignItems: 'center' }}
            />
            <Stack />
          </Stack>
        </Stack>

        <ProjectMembersWidget project={project} />
      </Stack>
    </>
  );
}
