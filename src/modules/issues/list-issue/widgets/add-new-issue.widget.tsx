import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCreateIssueHook } from '../hooks/mutations';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  ModalBase,
} from '@/components/elements';
import { useProjectContext } from '@/contexts/project/project-context';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';

export interface AddNewIssueWidgetProps {
  children: React.ReactElement;
}

export function AddNewIssueWidget(props: AddNewIssueWidgetProps) {
  const { t } = useTranslation();
  const { children } = props;
  const { members, projectId } = useProjectContext();

  const { data, formCreateIssue, handleCreateIssue, isLoading, reset } = useCreateIssueHook();

  const { listStatus, isLoading: isLoading2 } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const {
    register,
    control,
    formState: { errors },
  } = formCreateIssue;

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
        form={formCreateIssue}
        onSubmit={handleCreateIssue}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.title')}
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          {/* <SimpleGrid columns={2} spacing={3}>
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
          </SimpleGrid> */}
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
            options={members.map((user) => ({
              label: `${user.userName}`,
              value: user.id,
            }))}
            control={control}
            name="assigneeId"
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
