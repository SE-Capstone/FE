import { useEffect } from 'react';

import { Button, SimpleGrid, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertPhaseHook } from '../hooks/mutations';

import type { IPhase } from '../types';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';
import { formatDate } from '@/libs/helpers';

export interface UpsertPhaseWidgetProps {
  isUpdate?: boolean;
  phase?: IPhase;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertPhaseWidget(props: UpsertPhaseWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, phase, isOpen, onClose } = props;

  const { formUpsertPhase, handleUpsertPhase, isLoading, reset } = useUpsertPhaseHook({
    id: phase?.id,
    isUpdate,
    onClose,
  });

  const {
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertPhase;

  useEffect(() => {
    if (phase) {
      resetForm(
        {
          title: phase.title,
          description: phase.description,
          expectedStartDate: formatDate({
            date: phase.expectedStartDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date,
          expectedEndDate: formatDate({
            date: phase.expectedEndDate,
            format: 'YYYY-MM-DD',
          }) as unknown as Date,
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [phase, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-phase"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.phase').toLowerCase()}`
          : `${t('common.create')} ${t('common.phase').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-phase"
        form={formUpsertPhase}
        onSubmit={handleUpsertPhase}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.title')}
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          <CustomTextArea
            label={t('fields.description')}
            registration={register('description')}
            error={errors.description}
          />
          <SimpleGrid columns={2} spacing={3}>
            <CustomInput
              label={t('fields.startDate')}
              isRequired
              type="date"
              registration={register('expectedStartDate')}
              error={errors.expectedStartDate}
            />
            <CustomInput
              label={t('fields.endDate')}
              isRequired
              type="date"
              registration={register('expectedEndDate')}
              error={errors.expectedEndDate}
            />
          </SimpleGrid>
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
