import { Button, SimpleGrid, Stack } from '@chakra-ui/react';

import { useCreateIssueHook } from '../hooks/mutations';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  ModalBase,
} from '@/components/elements';
import { useProjectContext } from '@/contexts/project/project-context';

export interface AddNewIssueWidgetProps {
  children: React.ReactElement;
}

export function AddNewIssueWidget(props: AddNewIssueWidgetProps) {
  const { children } = props;
  const { members } = useProjectContext();

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
            options={members.map((user) => ({
              label: `${user.fullName}`,
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
