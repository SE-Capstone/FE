import { useEffect, useMemo, useState } from 'react';

import { Button, Container, SimpleGrid, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import RichTextEditor from 'reactjs-tiptap-editor';

import { useGetDetailIssue } from '../apis/detail-issue.api';
import { PriorityIssue } from '../components';
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
import { ISSUE_PRIORITY_OPTIONS } from '@/configs';
import { formatDate } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetDetailProject } from '@/modules/projects/detail-project/apis/detail-project.api';
import { extensions } from '@/modules/public/pages/rich-text-ex.pages';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

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

  const customComponents = useMemo(
    () => ({
      Option: CustomOptionComponentChakraReactSelect,
      SingleValue: CustomSingleValueComponentChakraReactSelect,
    }),
    []
  );

  const handleAssigneeChange = (option) => {
    setValue({
      label: option?.label || '',
      value: option?.value || '',
      image: option?.image || '',
    });
    setFieldValue('assigneeId', option?.value || undefined);
  };

  const assignToMe = () => {
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
          parentIssueId: issue.parentIssue?.id,
          // TODO: phase
          percentage: issue.percentage,
          priority: issue.priority,
          assigneeId: issue.assignee?.id,
          estimatedTime: issue.estimatedTime,
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
          avatar: '',
        });
      }
      if (!members.find((member) => member.id === currentUser?.id)) {
        members.unshift({
          id: currentUser?.id || '',
          fullName: currentUser?.fullName || '',
          userName: `${currentUser?.userName} (${t('common.me')})` || '',
          roleName: currentUser?.roleName || '',
          positionName: currentUser?.positionName || '',
          avatar: currentUser?.avatar || '',
        });
      }
      setMembers(members);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

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
            </SimpleGrid>

            <SimpleGrid columns={2} spacing={3}>
              <CustomChakraReactSelect
                isSearchable
                placeholder={`${t('common.choose')} ${t('fields.status').toLowerCase()}`}
                isRequired
                label={t('fields.status')}
                options={listStatus.map((s) => ({
                  label: s.name,
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

            <SimpleGrid columns={isUpdate ? 3 : 2} spacing={3}>
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
            </SimpleGrid>

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
