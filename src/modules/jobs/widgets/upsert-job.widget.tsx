import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertJobHook } from '../hooks/mutations';

import type { IJob } from '../types';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface UpsertJobWidgetProps {
  isUpdate?: boolean;
  job?: IJob;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertJobWidget(props: UpsertJobWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, job, isOpen, onClose } = props;

  const { formUpsertJob, handleUpsertJob, isLoading, reset } = useUpsertJobHook({
    id: job?.id,
    isUpdate,
    onClose,
  });

  const {
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertJob;

  useEffect(() => {
    if (job) {
      resetForm(
        {
          title: job.title || '',
          description: job.description || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [job, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-job"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.job').toLowerCase()}`
          : `${t('common.create')} ${t('common.job').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-upsert-job" form={formUpsertJob} onSubmit={handleUpsertJob}>
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.title')}
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          <CustomTextArea
            label={t('fields.description')}
            isRequired
            registration={register('description')}
            error={errors.description}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
