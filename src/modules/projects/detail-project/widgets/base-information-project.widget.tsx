import { useEffect, useMemo } from 'react';

import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';

import { ProjectMembersWidget } from './project-members.widget';
import { ProjectStatusEnum, type IProject } from '../../list-project/types';
import { BadgeStatus } from '../components';
import { useUpsertProjectHook } from '../hooks/mutations/use-upsert-project.mutation.hooks';

import { Head } from '@/components/elements';
import { ChangeStatus } from '@/components/widgets/change-status';
import { PermissionEnum, PROJECT_STATUS_OPTIONS } from '@/configs';
import { formatDate } from '@/libs/helpers';
import InlineEditableField from '@/modules/issues/list-issue/components/inline-edit-field';
import { UserWithAvatar } from '@/modules/issues/list-issue/components/user-with-avatar';
import { InlineEditCustomSelectInfinity } from '@/modules/issues/list-issue/widgets/editable-dropdown-infinity.widget';
import { InlineEditCustomSelect } from '@/modules/issues/list-issue/widgets/editable-dropdown.widget';
import { InfoCard } from '@/modules/profile/components';
import { useAuthentication } from '@/modules/profile/hooks';

export function BaseInformationProjectWidget({
  project,
  permissions,
}: {
  project?: IProject;
  permissions: Record<string, boolean>;
}) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const canUpdate =
    permissions[PermissionEnum.UPDATE_PROJECT] || currentUser?.id === project?.leadId;
  const canToggle = permissions[PermissionEnum.TOGGLE_VISIBLE_PROJECT];
  const canUpdateLead = permissions[PermissionEnum.UPDATE_PROJECT];

  const [searchParams, setSearchParams] = useSearchParams();

  const setTab = () => {
    const params = new URLSearchParams();
    params.set('tab', 'overview');
    setSearchParams(params);
  };

  useEffect(() => {
    // Only set the tab if it is not already set
    if (searchParams.get('tab') !== 'overview') {
      setTab();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const { handleUpsertProject } = useUpsertProjectHook({ id: project?.id || '', isUpdate: true });

  const handleSubmit = (value: string, fieldName?: string) => {
    if (project) {
      handleUpsertProject({
        ...project,
        startDate: project.startDate
          ? (formatDate({
              date: project.startDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : undefined,
        endDate: project.endDate
          ? (formatDate({
              date: project.endDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : undefined,
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
        ...(fieldName === 'totalEffort' && {
          totalEffort: Number(value || project.totalEffort),
        }),
        ...(fieldName === 'startDate' && {
          startDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (project.startDate
              ? (formatDate({
                  date: project.startDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        ...(fieldName === 'endDate' && {
          endDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (project.endDate
              ? (formatDate({
                  date: project.endDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        ...(fieldName === 'actualStartDate' && {
          actualStartDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (project.actualStartDate
              ? (formatDate({
                  date: project.actualStartDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
        ...(fieldName === 'actualEndDate' && {
          actualEndDate:
            (formatDate({
              date: value,
              format: 'YYYY-MM-DD',
            }) as unknown as Date) ||
            (project.actualEndDate
              ? (formatDate({
                  date: project.actualEndDate,
                  format: 'YYYY-MM-DD',
                }) as unknown as Date)
              : undefined),
        }),
      });
    }
  };

  const infoData = useMemo(
    () =>
      [
        {
          label: t('fields.name'),
          text: canUpdate ? (
            <InlineEditableField
              fieldValue={project?.name || ''}
              callback={handleSubmit}
              fieldName="name"
            />
          ) : (
            project?.name || ''
          ),
        },
        {
          label: t('fields.code'),
          text: canUpdate ? (
            <InlineEditableField
              fieldValue={project?.code || ''}
              callback={handleSubmit}
              fieldName="code"
            />
          ) : (
            project?.code || ''
          ),
        },
        {
          label: t('fields.description'),
          text: canUpdate ? (
            <InlineEditableField
              fieldValue={project?.description || ''}
              callback={handleSubmit}
              fieldName="description"
              isTextArea
            />
          ) : (
            project?.description || ''
          ),
        },
        {
          label: t('fields.teamLead'),
          text: canUpdateLead ? (
            <InlineEditCustomSelectInfinity
              defaultValue={
                project?.leadId && project?.leadName
                  ? {
                      label: project.leadName,
                      value: project.leadId,
                      image: project?.leadAvatar,
                    }
                  : undefined
              }
              project={project}
            />
          ) : (
            project?.leadId && (
              <UserWithAvatar label={project.leadName!} image={project.leadAvatar || ''} />
            )
          ),
        },
        canUpdate && {
          label: t('fields.status'),
          text: canUpdate ? (
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
          ) : (
            <BadgeStatus status={project?.status as ProjectStatusEnum} />
          ),
        },
        canToggle && {
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
              isLoading={!canToggle && true}
              description={
                project?.isVisible ? t('actions.archiveProject') : t('actions.unarchiveProject')
              }
            />
          ),
        },
        {
          label: t('fields.totalEffort'),
          text: (
            <InlineEditableField
              fieldValue={project?.totalEffort?.toString() || ''}
              callback={handleSubmit}
              fieldName="totalEffort"
              styleProps={{ minW: '200px', minH: '20px' }}
              isViewOnly={!canUpdate}
            />
          ),
        },
        {
          label: t('fields.expectStartDate'),
          text: canUpdate ? (
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
          ) : project?.startDate ? (
            formatDate({ date: project.startDate, format: 'YYYY-MM-DD' })
          ) : (
            ''
          ),
        },
        {
          label: t('fields.expectEndDate'),
          text: canUpdate ? (
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
                project?.endDate
                  ? formatDate({ date: project?.endDate, format: 'YYYY-MM-DD' }) || ''
                  : ''
              }
              styleProps={{ transform: 'translate(0, -4px)' }}
            />
          ) : project?.endDate ? (
            formatDate({ date: project.endDate, format: 'YYYY-MM-DD' })
          ) : (
            ''
          ),
        },
        {
          label: t('fields.actualStartDate'),
          text:
            canUpdate && project?.status !== ProjectStatusEnum.NotStarted ? (
              <InlineEditableField
                fieldValue={
                  project?.actualStartDate
                    ? formatDate({ date: project?.actualStartDate, format: 'YYYY-MM-DD' }) || ''
                    : ''
                }
                callback={handleSubmit}
                fieldName="actualStartDate"
                type="date"
                startDate={
                  project?.actualStartDate
                    ? formatDate({ date: project?.actualStartDate, format: 'YYYY-MM-DD' }) || ''
                    : ''
                }
                styleProps={{ transform: 'translate(0, -4px)' }}
              />
            ) : project?.actualStartDate ? (
              formatDate({ date: project.actualStartDate, format: 'YYYY-MM-DD' })
            ) : (
              ''
            ),
        },
        {
          label: t('fields.actualEndDate'),
          text:
            canUpdate &&
            (project?.status === ProjectStatusEnum.Completed ||
              project?.status === ProjectStatusEnum.Canceled) ? (
              <InlineEditableField
                fieldValue={
                  project?.actualEndDate
                    ? formatDate({ date: project?.actualEndDate, format: 'YYYY-MM-DD' }) || ''
                    : ''
                }
                callback={handleSubmit}
                fieldName="actualEndDate"
                type="date"
                startDate={
                  project?.actualEndDate
                    ? formatDate({ date: project?.actualEndDate, format: 'YYYY-MM-DD' }) || ''
                    : ''
                }
                styleProps={{ transform: 'translate(0, -4px)' }}
              />
            ) : project?.actualEndDate ? (
              formatDate({ date: project.actualEndDate, format: 'YYYY-MM-DD' })
            ) : (
              ''
            ),
        },
      ].filter(Boolean),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [permissions, project, t]
  );

  return (
    <>
      <Head title={`Project - ${project?.name}`} />
      <Stack direction={{ base: 'column', xl: 'row' }} alignItems="stretch" spacing="24px" w="100%">
        <Stack w="full" spacing="24px" flex={2.5}>
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
                  w: '160px',
                },
              }}
              stackProps={{ alignItems: 'center' }}
            />
            <Stack />
          </Stack>
        </Stack>
      </Stack>
      <ProjectMembersWidget project={project} />
    </>
  );
}
