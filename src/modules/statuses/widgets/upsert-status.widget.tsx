import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';

import { useUpsertStatusHook } from '../hooks/mutations';

import type { IStatus } from '../types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';
import { COLOR_OPTIONS } from '@/configs';
import { BadgeIssue } from '@/modules/issues/list-issue/components';

export interface UpsertStatusWidgetProps {
  isUpdate?: boolean;
  status?: IStatus;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertStatusWidget(props: UpsertStatusWidgetProps) {
  const { isUpdate, status, isOpen, onClose } = props;

  const { formUpsertStatus, handleUpsertStatus, isLoading, reset } = useUpsertStatusHook({
    id: status?.id,
    isUpdate,
    onClose,
  });

  const {
    control,
    register,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertStatus;

  useEffect(() => {
    if (status) {
      resetForm(
        {
          name: status.name || '',
          description: status.description || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [status, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-status"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          Save
        </Button>
      )}
      title={isUpdate ? 'Update status' : 'Create status'}
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-status"
        form={formUpsertStatus}
        onSubmit={handleUpsertStatus}
      >
        <Stack spacing={5}>
          <CustomInput
            label="Title"
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomChakraReactSelect
            isSearchable
            isRequired
            placeholder="Choose theme"
            label="Theme"
            size="lg"
            options={COLOR_OPTIONS.map((color) => ({
              label: <BadgeIssue content="Status" colorScheme={color} />,
              value: color,
            }))}
            control={control}
            name="color"
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
