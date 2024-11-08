import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertPositionHook } from '../hooks/mutations';

import type { IPosition } from '../types';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface UpsertPositionWidgetProps {
  isUpdate?: boolean;
  position?: IPosition;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertPositionWidget(props: UpsertPositionWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, position, isOpen, onClose } = props;

  const { formUpsertPosition, handleUpsertPosition, isLoading, reset } = useUpsertPositionHook({
    id: position?.id,
    isUpdate,
    onClose,
  });

  const {
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertPosition;

  useEffect(() => {
    if (position) {
      resetForm(
        {
          title: position.title || '',
          description: position.description || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [position, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-position"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.position').toLowerCase()}`
          : `${t('common.create')} ${t('common.position').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-position"
        form={formUpsertPosition}
        onSubmit={handleUpsertPosition}
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
            isRequired
            registration={register('description')}
            error={errors.description}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
