import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

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
  isDefault?: boolean;
  status?: IStatus;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertStatusWidget(props: UpsertStatusWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, status, isOpen, onClose, isDefault } = props;

  const { formUpsertStatus, handleUpsertStatus, isLoading, reset } = useUpsertStatusHook({
    id: status?.id,
    isUpdate,
    onClose,
    isDefault,
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
          color: status.color || '',
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
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.status').toLowerCase()}`
          : `${t('common.create')} ${t('common.status').toLowerCase()}`
      }
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
            label={t('fields.name')}
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomChakraReactSelect
            isSearchable
            isRequired
            placeholder={`${t('common.choose')} ${t('fields.theme').toLowerCase()}`}
            label={t('fields.theme')}
            size="lg"
            options={COLOR_OPTIONS.map((color) => ({
              label: <BadgeIssue content="Status" colorScheme={color} />,
              value: color,
            }))}
            control={control}
            name="color"
          />
          <CustomTextArea
            label={t('fields.description')}
            registration={register('description')}
            error={errors.description}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
