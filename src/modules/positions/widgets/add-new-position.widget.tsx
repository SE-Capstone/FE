import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useCreatePositionHook } from '../hooks/mutations';

import { CustomFormProvider, CustomInput, CustomTextArea, ModalBase } from '@/components/elements';

export interface AddNewPositionWidgetProps {
  children: React.ReactElement;
}

export function AddNewPositionWidget(props: AddNewPositionWidgetProps) {
  const { t } = useTranslation();
  const { children } = props;

  const { data, formCreatePosition, handleCreatePosition, isLoading, reset } =
    useCreatePositionHook();

  const {
    register,
    formState: { errors },
  } = formCreatePosition;

  return (
    <ModalBase
      size="xl"
      isDone={!!data}
      title={`${t('common.create')} ${t('common.position').toLowerCase()}`}
      triggerButton={() => children}
      renderFooter={() => (
        <Button form="form-create-position" w={20} type="submit" isDisabled={isLoading}>
          {t('common.save')}
        </Button>
      )}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-create-position"
        form={formCreatePosition}
        onSubmit={handleCreatePosition}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.name')}
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
