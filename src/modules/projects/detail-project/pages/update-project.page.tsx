import { useEffect, useState } from 'react';

import { Box, Button, SimpleGrid, Stack } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { useGetDetailProject as getDetailProject } from '../apis/detail-project.api';
import { useUpdateProjectMutation } from '../apis/update-project.api';
import { updateProjectFormSchema } from '../validations/update-project.validation';

import type { UpdateProjectFormType } from '../validations/update-project.validation';
import type { IUser } from '@/modules/users/list-user/types';

import {
  CustomChakraReactSelect,
  CustomCheckbox,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
} from '@/components/elements';
import { PermissionEnum, PROJECT_STATUS_OPTIONS } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { formatDate, getCurrentDate } from '@/libs/helpers';
import { useFormWithSchema } from '@/libs/hooks';
import { useGetUsersByPermission } from '@/modules/users/list-user/apis/get-user-by-permission.api';

export function UpdateProjectPage() {
  const { projectIdParam } = useParams();

  const [teamLeads, setTeamLeads] = useState<IUser[]>([]);

  const { project, isLoading: isLoadingProject } = getDetailProject({
    projectId: projectIdParam || '',
  });

  const { users } = useGetUsersByPermission({
    permissionName: PermissionEnum.IS_PROJECT_LEAD,
  });

  useEffect(() => {
    if (JSON.stringify(users) !== JSON.stringify(teamLeads)) {
      setTeamLeads(users);
    }
  }, [users, teamLeads]);

  const { mutate: updateProjectMutation, isPending: isLoading } = useUpdateProjectMutation();

  const form = useFormWithSchema({
    schema: updateProjectFormSchema,
  });

  const { formState, register, reset, control } = form;
  const { errors, isDirty } = formState;

  const { openAlert, closeAlert } = useAlertDialogStore(isLoading);

  function onSubmit(values: UpdateProjectFormType) {
    if (isLoading) return;

    openAlert({
      title: 'Update',
      description: `Are you sure to update project "${project?.name}"?`,
      onHandleConfirm() {
        updateProjectMutation({
          body: {
            ...values,
            id: project?.id || '',
            startDate: formatDate({
              date: values.startDate,
              format: 'YYYY-MM-DD',
            }),
            endDate: formatDate({
              date: values.endDate,
              format: 'YYYY-MM-DD',
            }),
          },
        });

        closeAlert();
      },
    });
  }

  useEffect(() => {
    reset(
      {
        ...project,
        startDate: project?.startDate
          ? (formatDate({
              date: project?.startDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : (getCurrentDate() as unknown as Date),
        endDate: project?.endDate
          ? (formatDate({
              date: project?.endDate,
              format: 'YYYY-MM-DD',
            }) as unknown as Date)
          : (getCurrentDate() as unknown as Date),
      },
      {
        keepDirty: false,
      }
    );
  }, [reset, project]);

  return (
    <Box bg="white" rounded={2} w="full" p={6}>
      <CustomFormProvider form={form} style={{ height: 'fit-content' }} onSubmit={onSubmit}>
        <Stack
          direction={{ base: 'column-reverse' }}
          spacing="24px"
          w="100%"
          alignItems="flex-start"
        >
          <Stack direction="column" w="100%" spacing="24px">
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
            </Stack>
            <SimpleGrid columns={2} spacing={3}>
              <CustomChakraReactSelect
                isSearchable
                isRequired
                placeholder="Choose status"
                label="Status"
                size="lg"
                options={PROJECT_STATUS_OPTIONS}
                control={control}
                name="status"
              />
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
            </SimpleGrid>
            <CustomCheckbox
              label="Isvisible"
              registration={register('isVisible')}
              error={errors.isVisible}
            />
            <Stack align="center">
              <Button
                w="150px"
                maxW="100%"
                type="submit"
                isDisabled={isLoading || !isDirty || isLoadingProject}
                isLoading={isLoading || isLoadingProject}
              >
                Save
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </CustomFormProvider>
    </Box>
  );
}
