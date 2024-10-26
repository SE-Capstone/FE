import { Button, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useRemoveStatusMutation } from '../apis/delete-status.api';
import { removeStatusFormSchema } from '../validations/remove-status.validations';

import type { IStatus } from '../types';
import type { RemoveStatusFormValues } from '../validations/remove-status.validations';

import { CustomChakraReactSelect, CustomFormProvider, ModalBase } from '@/components/elements';
import { useFormWithSchema } from '@/libs/hooks';
import { BadgeIssue } from '@/modules/issues/list-issue/components';

export interface RemoveStatusWidgetProps {
  listStatus: IStatus[];
  status: IStatus;
  isOpen: boolean;
  onClose: () => void;
  isDefault?: boolean;
}

export function RemoveStatusWidget(props: RemoveStatusWidgetProps) {
  const { t } = useTranslation();
  const { status, listStatus, isOpen, onClose, isDefault } = props;

  const formRemoveStatus = useFormWithSchema({
    schema: removeStatusFormSchema,
  });

  const {
    control,
    formState: { isDirty },
    reset,
  } = formRemoveStatus;

  const { mutate, isPending: isLoading } = useRemoveStatusMutation({
    closeAlert: onClose,
    isDefault,
  });

  function onSubmit(values: RemoveStatusFormValues) {
    if (isLoading) return;

    mutate({
      body: {
        ...values,
        id: status.id,
      },
    });
  }

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-status"
          w={20}
          type="submit"
          bg="red.600"
          _hover={{
            bg: 'red.600',
            opacity: 0.8,
          }}
          isDisabled={isLoading || !isDirty}
        >
          {t('actions.delete')}
        </Button>
      )}
      title={`${t('actions.delete')} ${t('common.status').toLowerCase()}`}
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider id="form-upsert-status" form={formRemoveStatus} onSubmit={onSubmit}>
        <Stack spacing={5}>
          <Text>
            {t('messages.deleteStatusBody', {
              issueCount: status.issueCount,
              statusName: status.name,
            })}
          </Text>
          <CustomChakraReactSelect
            isSearchable
            placeholder={`${t('common.choose')} ${t('common.status').toLowerCase()}`}
            label={t('messages.deleteStatusLabel', { statusName: status.name })}
            size="lg"
            options={listStatus
              .filter((l) => l.id !== status.id)
              .map((status) => ({
                label: <BadgeIssue content={status.name} colorScheme={status.color} />,
                value: status.id,
              }))}
            control={control}
            name="newStatusId"
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
