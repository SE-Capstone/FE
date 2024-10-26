import { useEffect } from 'react';

import { Button, SimpleGrid, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertProjectHook } from '../../detail-project/hooks/mutations/use-upsert-project.mutation.hooks';

import type { IProject } from '../types';
import type { IUser } from '@/modules/users/list-user/types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';
import { PROJECT_STATUS_OPTIONS } from '@/configs';
import { formatDate } from '@/libs/helpers';

export interface UpsertProjectWidgetProps {
  teamLeads: IUser[];
  isUpdate?: boolean;
  project?: IProject;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertProjectWidget(props: UpsertProjectWidgetProps) {
  const { t } = useTranslation();
  const { teamLeads, isUpdate, project, isOpen, onClose } = props;

  const { formUpsertProject, handleUpsertProject, isLoading, reset } = useUpsertProjectHook({
    id: project?.id,
    isUpdate,
    onClose,
  });

  const {
    control,
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertProject;

  useEffect(() => {
    if (project) {
      resetForm(
        {
          name: project.name,
          code: project.code,
          description: project.description,
          startDate: formatDate({
            date: project.startDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date,
          endDate: formatDate({
            date: project.endDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date,
          status: project.status,
          leadId: project.leadId || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [project, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-project"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.project').toLowerCase()}`
          : `${t('common.create')} ${t('common.project').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-project"
        form={formUpsertProject}
        onSubmit={handleUpsertProject}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.name')}
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomInput
            label={t('fields.code')}
            isRequired
            registration={register('code')}
            error={errors.code}
          />
          <CustomTextArea
            label={t('fields.description')}
            isRequired
            registration={register('description')}
            error={errors.description}
          />
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label={t('fields.startDate')}
              isRequired
              type="date"
              registration={register('startDate')}
              error={errors.startDate}
            />
            <CustomInput
              label={t('fields.endDate')}
              isRequired
              type="date"
              registration={register('endDate')}
              error={errors.endDate}
            />
          </SimpleGrid>
          <CustomChakraReactSelect
            isSearchable
            placeholder={`${t('common.choose')} team lead`}
            label="Team lead"
            size="lg"
            options={teamLeads.map((user) => ({
              label: `${user.fullName} (${user.userName})`,
              value: user.id,
            }))}
            control={control}
            name="leadId"
          />
          {isUpdate && (
            <CustomChakraReactSelect
              isSearchable
              isRequired
              placeholder={`${t('common.choose')} ${t('common.status').toLowerCase()}`}
              label={t('common.status')}
              size="lg"
              options={PROJECT_STATUS_OPTIONS}
              control={control}
              name="status"
            />
          )}
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
