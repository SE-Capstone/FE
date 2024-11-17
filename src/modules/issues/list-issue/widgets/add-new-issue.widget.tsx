import { useEffect, useMemo, useState } from 'react';

import { Button, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

import { BadgeIssue } from '../components';
import { useUpsertIssueHook } from '../hooks/mutations';

import type { IOptionUserSelect } from '@/modules/projects/detail-project/components/users-async-select';
import type { ProjectMember } from '@/modules/projects/list-project/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomOptionComponentChakraReactSelect,
  CustomSingleValueComponentChakraReactSelect,
  ModalBase,
} from '@/components/elements';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetDetailProject } from '@/modules/projects/detail-project/apis/detail-project.api';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export interface AddNewIssueWidgetProps {
  children: React.ReactElement;
  parentIssueId?: string;
}

export function AddNewIssueWidget(props: AddNewIssueWidgetProps) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const { children, parentIssueId } = props;
  const { projectId } = useParams();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const { data, formUpsertIssue, handleUpsertIssue, isLoading, reset } = useUpsertIssueHook();
  const [value, setValue] = useState<IOptionUserSelect>();

  const { listStatus, isLoading: isLoading2 } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const { project, isLoading: isLoading3 } = useGetDetailProject({ projectId: projectId || '' });

  const customComponents = useMemo(
    () => ({
      Option: (props) => CustomOptionComponentChakraReactSelect(props, 'sm'),
      SingleValue: (props) => CustomSingleValueComponentChakraReactSelect(props, false),
    }),
    []
  );

  const {
    register,
    control,
    formState: { errors },
    setValue: setFieldValue,
  } = formUpsertIssue;

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
          roleName: t('fields.teamLead'),
          positionName: project.leadPosition || '',
          avatar: project.leadAvatar || '',
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
    <ModalBase
      size="xl"
      isDone={!!data}
      title={`${t('common.create')} ${
        parentIssueId ? t('common.subTask').toLowerCase() : t('common.issue').toLowerCase()
      }`}
      triggerButton={() => children}
      renderFooter={() => (
        <Button
          form="form-create-issue"
          w={20}
          type="submit"
          isDisabled={isLoading || isLoading2 || isLoading3}
        >
          {t('common.save')}
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-issue"
        form={formUpsertIssue}
        onSubmit={handleUpsertIssue}
      >
        {parentIssueId && (
          <CustomInput
            hidden
            value={parentIssueId}
            registration={register('parentIssueId')}
            error={errors.parentIssueId}
          />
        )}
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.title')}
            isRequired
            registration={register('title')}
            error={errors.title}
          />

          <CustomChakraReactSelect
            isSearchable
            placeholder={`${t('common.choose')} ${t('fields.status').toLowerCase()}`}
            isRequired
            label={t('fields.status')}
            size="lg"
            options={listStatus.map((s) => ({
              label: <BadgeIssue content={s.name} colorScheme={s.color} />,
              value: s.id,
            }))}
            control={control}
            name="statusId"
          />
          <CustomChakraReactSelect
            isSearchable
            placeholder={`${t('common.choose')} ${t('fields.assignee').toLowerCase()}`}
            label={t('fields.assignee')}
            size="lg"
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
      </CustomFormProvider>
    </ModalBase>
  );
}
