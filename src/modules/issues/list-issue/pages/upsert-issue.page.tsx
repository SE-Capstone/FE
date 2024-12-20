import { useEffect, useMemo, useState } from 'react';

import { Button, Container, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import RichTextEditor from 'reactjs-tiptap-editor';

import { useGetDetailIssue } from '../apis/detail-issue.api';
import { BadgeIssue, PriorityIssue } from '../components';
import { useUpsertIssueHook } from '../hooks/mutations';
import { useEditorState } from '../hooks/use-editor-state';

import type { IOptionUserSelect } from '@/modules/projects/detail-project/components/users-async-select';
import type { ProjectMember } from '@/modules/projects/list-project/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
} from '@/components/elements';
import { LayoutBack } from '@/components/layouts';
import { ISSUE_PRIORITY_OPTIONS, PermissionEnum } from '@/configs';
import { formatDate, notify } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListPhaseQuery } from '@/modules/phases/hooks/queries';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetDetailProject } from '@/modules/projects/detail-project/apis/detail-project.api';
import { extensions } from '@/modules/public/pages/rich-text-ex.pages';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function UpsertIssuePage({ isUpdate }: { isUpdate?: boolean }) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const { projectId, issueId } = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [value, setValue] = useState<IOptionUserSelect>();
  const { editor, editorRef } = useEditorState();

  const [content, setContent] = useState('');

  const { formUpsertIssue, handleUpsertIssue, isLoading } = useUpsertIssueHook(
    editor,
    isUpdate,
    undefined,
    true
  );

  const {
    register,
    control,
    formState: { errors, isDirty },
    setValue: setFieldValue,
    reset: resetForm,
  } = formUpsertIssue;

  const onChangeContent = (value: any) => {
    setContent(value);
    setFieldValue('description', value, { shouldDirty: true });
  };

  const { issue, isLoading: isLoading6 } = useGetDetailIssue({ issueId: issueId || '' });

  const { project, isLoading: isLoading5 } = useGetDetailProject({ projectId: projectId || '' });

  const { listLabel, isLoading: isLoading3 } = useGetListLabelQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const { listStatus, isLoading: isLoading2 } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const { listPhase, isLoading: isLoading8 } = useGetListPhaseQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const customComponents = useMemo(
    () => ({
      Option: (props) => CustomOptionComponentChakraReactSelect(props, 'sm'),
      SingleValue: (props) => CustomSingleValueComponentChakraReactSelect(props, false),
    }),
    []
  );
  // Todo: should add reporter?
  const handleAssigneeChange = (option) => {
    setValue({
      label: option?.label || '',
      value: option?.value || '',
      image: option?.image || '',
    });
    setFieldValue('assigneeId', option?.value || undefined);
  };

  const assignToMe = () => {
    if (currentUser?.id && !members.find((mem) => mem.id === currentUser?.id)) {
      return;
    }

    const selectedOption = {
      label: currentUser?.userName || '',
      value: currentUser?.id || '',
      image: currentUser?.avatar || '',
    };

    setValue(selectedOption);
    handleAssigneeChange(selectedOption);
  };

  useEffect(() => {
    if (editor && issue?.description) {
      editor.commands.setContent(issue.description);
      setContent(issue.description);
    }
  }, [editor, issue]);

  useEffect(() => {
    if (issue) {
      resetForm(
        {
          labelId: issue.label?.id,
          statusId: issue.status.id,
          title: issue.title,
          description: issue.description,
          startDate: issue.startDate
            ? (formatDate({
                date: issue.startDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          dueDate: issue.dueDate
            ? (formatDate({
                date: issue.dueDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          actualDate: issue.actualDate
            ? (formatDate({
                date: issue.actualDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          parentIssueId: issue.parentIssue?.id,
          phaseId: issue.phase?.id,
          percentage: issue.percentage,
          priority: issue.priority,
          assigneeId: issue.assignee?.id,
          reporterId: issue.reporter?.id,
          estimatedTime: issue.estimatedTime,
          actualTime: issue.actualTime,
        },
        {
          keepDirty: false,
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [issue, resetForm]);

  useEffect(() => {
    if (project) {
      const members: ProjectMember[] = [];
      project?.members?.map((member) =>
        members.push({
          id: member.id,
          fullName: member.fullName,
          userName:
            currentUser?.id === member.id
              ? `${member.userName} (${t('common.me')})`
              : member.userName,
          roleName: member.roleName,
          positionName: member.positionName,
          avatar: member.avatar || '',
        })
      );
      if (project?.leadId) {
        members.push({
          id: project.leadId,
          fullName: project.leadName || '',
          userName:
            currentUser?.id === project.leadId
              ? `${project.leadName} (${t('common.me')})`
              : project.leadName || '',
          roleName: 'Project lead',
          positionName: project.leadPosition || '',
          avatar: project.leadAvatar || '',
        });
      }
      // if (!members.find((member) => member.id === currentUser?.id)) {
      //   members.unshift({
      //     id: currentUser?.id || '',
      //     fullName: currentUser?.fullName || '',
      //     userName: `${currentUser?.userName} (${t('common.me')})` || '',
      //     roleName: currentUser?.roleName || '',
      //     positionName: currentUser?.positionName || '',
      //     avatar: currentUser?.avatar || '',
      //   });
      // }
      setMembers(members);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  const { permissions } = useAuthentication();
  const navigate = useNavigate();
  // if (!permissions[PermissionEnum.READ_ALL_PROJECTS] && !project?.isVisible) {
  //   notify({
  //     type: 'error',
  //     message: t('common.accessProjectDenied'),
  //   });
  //   navigate(APP_PATHS.HOME);
  //   // eslint-disable-next-line react/jsx-no-useless-fragment
  //   return <></>;
  // }
  useEffect(() => {
    if (project && !permissions[PermissionEnum.READ_ALL_PROJECTS] && !project?.isVisible) {
      notify({
        type: 'error',
        message: t('common.accessProjectDenied'),
      });
      navigate(APP_PATHS.HOME);
      return undefined;
    }
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project, permissions, t]);

  return (
    <Container p={6} rounded={3} maxW="container.2xl" bg="white" centerContent>
      <LayoutBack
        display="flex"
        bgColor="transparent"
        justify="space-between"
        alignItems="start"
        py="14px"
        px={0}
      >
        <CustomFormProvider
          id="form-create-issue"
          form={formUpsertIssue}
          onSubmit={handleUpsertIssue}
        >
          <Stack spacing={5} mt={2}>
            <CustomInput
              label={t('fields.title')}
              isRequired
              registration={register('title')}
              error={errors.title}
            />

            <SimpleGrid columns={2} spacing={3}>
              <CustomChakraReactSelect
                isSearchable
                placeholder={`${t('common.choose')} ${t('fields.status').toLowerCase()}`}
                isRequired
                label={t('fields.status')}
                options={listStatus.map((s) => ({
                  label: <BadgeIssue content={s.name} colorScheme={s.color} />,
                  value: s.id,
                }))}
                control={control}
                name="statusId"
              />
              <CustomChakraReactSelect
                isSearchable
                placeholder={`${t('common.choose')} ${t('common.label').toLowerCase()}`}
                label={t('common.label')}
                options={listLabel.map((s) => ({
                  label: s.title,
                  value: s.id,
                }))}
                control={control}
                name="labelId"
              />
            </SimpleGrid>

            <SimpleGrid columns={isUpdate ? 2 : 1} spacing={3}>
              <Stack gap={5}>
                <CustomChakraReactSelect
                  isSearchable
                  placeholder={`${t('common.choose')} ${t('fields.assignee').toLowerCase()}`}
                  label={t('fields.assignee')}
                  components={customComponents}
                  options={members.map((user) => ({
                    label: user.userName,
                    value: user.id,
                    image: user.avatar || '',
                  }))}
                  control={control}
                  name="assigneeId"
                  setValue={value}
                  onChange={(option) => {
                    handleAssigneeChange(option);
                  }}
                />
                <Text
                  color="indicator.500"
                  mt={-4}
                  _hover={{
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  display="inline-block"
                  textAlign="left"
                  onClick={assignToMe}
                >
                  {t('common.assignToMe')}
                </Text>
              </Stack>
              {isUpdate && (
                <CustomChakraReactSelect
                  placeholder={`${t('common.choose')} ${t('common.phase').toLowerCase()}`}
                  label={t('common.phase')}
                  options={listPhase.map((s) => ({
                    label: s.title,
                    value: s.id,
                  }))}
                  control={control}
                  name="phaseId"
                />
              )}
            </SimpleGrid>

            <SimpleGrid columns={3} spacing={3}>
              <CustomInput
                label={t('fields.startDate')}
                type="date"
                registration={register('startDate')}
                error={errors.startDate}
              />
              <CustomInput
                label={t('fields.dueDate')}
                type="date"
                registration={register('dueDate')}
                error={errors.dueDate}
              />
              <CustomInput
                label={t('fields.actualDate')}
                type="date"
                registration={register('actualDate')}
                error={errors.actualDate}
              />
            </SimpleGrid>

            <SimpleGrid columns={isUpdate ? 4 : 2} spacing={3}>
              <CustomChakraReactSelect
                placeholder={`${t('common.choose')} ${t('fields.priority').toLowerCase()}`}
                label={t('fields.priority')}
                options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                  label: <PriorityIssue priority={value} />,
                  value,
                }))}
                control={control}
                name="priority"
              />
              {isUpdate && (
                <CustomInput
                  name="percentage"
                  label={t('fields.percentageDone')}
                  registration={register('percentage')}
                  error={errors.percentage}
                />
              )}
              <CustomInput
                name="estimatedTime"
                label={t('fields.estimatedTime')}
                registration={register('estimatedTime')}
                error={errors.estimatedTime}
              />
              {isUpdate && (
                <CustomInput
                  name="actualTime"
                  label={t('fields.actualTime')}
                  registration={register('actualTime')}
                  error={errors.actualTime}
                />
              )}
            </SimpleGrid>

            <Text mb={-2}>{t('fields.description')}</Text>
            <RichTextEditor
              ref={editorRef}
              dark={false}
              label={t('fields.description')}
              output="html"
              content={content}
              extensions={extensions}
              onChangeContent={onChangeContent}
            />

            <Stack align="end">
              <Button
                maxW="100%"
                type="submit"
                isDisabled={
                  isLoading ||
                  isLoading2 ||
                  isLoading3 ||
                  isLoading5 ||
                  isLoading6 ||
                  isLoading8 ||
                  (isUpdate && !isDirty)
                }
                isLoading={isLoading}
              >
                {t('common.submit')}
              </Button>
            </Stack>
          </Stack>
        </CustomFormProvider>
      </LayoutBack>
    </Container>
  );
}
