import { Button, SimpleGrid, Stack } from '@chakra-ui/react';

import { useCreateIssueHook } from '../hooks/mutations';

import type { IUser } from '@/modules/users/list-user/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';

export interface AddNewIssueWidgetProps {
  children: React.ReactElement;
  teamLeads: IUser[];
}

export function AddNewIssueWidget(props: AddNewIssueWidgetProps) {
  const { children, teamLeads } = props;

  const { data, formCreateIssue, handleCreateIssue, isLoading, reset } = useCreateIssueHook();

  const {
    register,
    control,
    formState: { errors },
  } = formCreateIssue;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create issue"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-issue" w={20} type="submit" isDisabled={isLoading}>
          Save
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
            label="Subject"
            isRequired
            registration={register('subject')}
            error={errors.subject}
          />
          <CustomInput
            label="Code"
            isRequired
            registration={register('code')}
            error={errors.code}
          />
          <CustomTextArea
            label="Description"
            isRequired
            registration={register('description')}
            error={errors.description}
          />
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label="Start date"
              isRequired
              type="date"
              registration={register('startDate')}
              error={errors.startDate}
            />
            <CustomInput
              label="Due date"
              isRequired
              type="date"
              registration={register('dueDate')}
              error={errors.dueDate}
            />
          </SimpleGrid>
          <CustomChakraReactSelect
            isSearchable
            placeholder="Choose assignee"
            label="Assignee"
            size="lg"
            options={teamLeads.map((user) => ({
              label: `${user.fullName} (${user.userName})`,
              value: user.id,
            }))}
            control={control}
            name="leadId"
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
