import { useMemo, useState } from 'react';

import { Button, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertIssueHook } from '../hooks/mutations';

import type { IOptionUserSelect } from '@/modules/projects/detail-project/components/users-async-select';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomOptionComponentChakraReactSelect,
  ModalBase,
} from '@/components/elements';
import { useProjectContext } from '@/contexts/project/project-context';
import { useAuthentication } from '@/modules/profile/hooks';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export interface AddNewIssueWidgetProps {
  children: React.ReactElement;
}

export function AddNewIssueWidget(props: AddNewIssueWidgetProps) {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const { children } = props;
  const { members, projectId } = useProjectContext();
  const { data, formUpsertIssue, handleUpsertIssue, isLoading, reset } = useUpsertIssueHook();
  const [value, setValue] = useState<IOptionUserSelect>();

  const { listStatus, isLoading: isLoading2 } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const customComponents = useMemo(
    () => ({
      Option: CustomOptionComponentChakraReactSelect,
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

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title={`${t('common.create')} ${t('common.issue').toLowerCase()}`}
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-issue" w={20} type="submit" isDisabled={isLoading || isLoading2}>
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
              label: s.name,
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
