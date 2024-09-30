import { Button, SimpleGrid, Stack } from '@chakra-ui/react';

import { useCreateProjectHook } from '../hooks/mutations';

import type { IUser } from '@/modules/users/list-user/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';

export interface AddNewProjectWidgetProps {
  children: React.ReactElement;
  teamLeads: IUser[];
}

export function AddNewProjectWidget(props: AddNewProjectWidgetProps) {
  const { children, teamLeads } = props;

  const { data, formCreateProject, handleCreateProject, isLoading, reset } = useCreateProjectHook();

  const {
    register,
    control,
    formState: { errors },
  } = formCreateProject;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title="Create project"
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-project" w={20} type="submit" isDisabled={isLoading}>
          Save
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-project"
        form={formCreateProject}
        onSubmit={handleCreateProject}
      >
        <Stack spacing={5}>
          <CustomInput
            label="Name"
            isRequired
            registration={register('name')}
            error={errors.name}
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
              label="End date"
              isRequired
              type="date"
              registration={register('endDate')}
              error={errors.endDate}
            />
          </SimpleGrid>
          <CustomChakraReactSelect
            isSearchable
            placeholder="Choose team lead"
            label="Team lead"
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
