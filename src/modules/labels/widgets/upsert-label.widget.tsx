import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';

import { useUpsertLabelHook } from '../hooks/mutations';

import type { ILabel } from '../types';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface UpsertLabelWidgetProps {
  isUpdate?: boolean;
  label?: ILabel;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertLabelWidget(props: UpsertLabelWidgetProps) {
  const { isUpdate, label, isOpen, onClose } = props;

  const { formUpsertLabel, handleUpsertLabel, isLoading, reset } = useUpsertLabelHook({
    id: label?.id,
    isUpdate,
    onClose,
  });

  const {
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertLabel;

  useEffect(() => {
    if (label) {
      resetForm(
        {
          title: label.title || '',
          description: label.description || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [label, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-label"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          Save
        </Button>
      )}
      title={isUpdate ? 'Update label' : 'Create label'}
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-label"
        form={formUpsertLabel}
        onSubmit={handleUpsertLabel}
      >
        <Stack spacing={5}>
          <CustomInput
            label="Title"
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          <CustomTextArea
            label="Description"
            registration={register('description')}
            error={errors.description}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
