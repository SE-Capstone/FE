import { useEffect } from 'react';

import { Button, Icon, Stack } from '@chakra-ui/react';
import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { MdOutlineFileUpload } from 'react-icons/md';

import { useUpsertApplicantHook } from '../hooks/mutations';

import type { IApplicant } from '../types';

import { CustomFormProvider, CustomInput, FileUpload, ModalBase } from '@/components/elements';
import { formatDate, phoneNumberAutoFormat } from '@/libs/helpers';

export interface UpsertApplicantWidgetProps {
  applicant?: IApplicant;
  isUpdate?: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertApplicantWidget(props: UpsertApplicantWidgetProps) {
  const { t } = useTranslation();
  const { applicant, isUpdate, isOpen, onClose } = props;

  const { formUpsertApplicant, handleUpsertApplicant, isLoading, reset } = useUpsertApplicantHook({
    id: applicant?.id,
    isUpdate,
    onClose,
    cvLink: applicant?.cvLink,
  });

  const {
    register,
    control,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertApplicant;

  useEffect(() => {
    if (applicant) {
      resetForm(
        {
          name: applicant.name || '',
          email: applicant.email || '',
          phoneNumber: applicant.phoneNumber || '',
          startDate: applicant.startDate
            ? (formatDate({
                date: applicant.startDate,
                format: 'YYYY-MM-DD',
              }) as unknown as Date)
            : undefined,
          cvFile: applicant.cvLink || undefined,
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [applicant, resetForm]);

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-applicant"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.applicant').toLowerCase()}`
          : `${t('common.create')} ${t('common.applicant').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-applicant"
        form={formUpsertApplicant}
        onSubmit={handleUpsertApplicant}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.name')}
            isRequired
            registration={register('name')}
            error={errors.name}
          />
          <CustomInput
            label="Email"
            type="email"
            isRequired
            registration={register('email')}
            error={errors.email}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field: { value, onChange, ...field } }) => (
              <CustomInput
                label={t('fields.phone')}
                placeholder="012-345-6789"
                isRequired
                error={errors?.phoneNumber}
                value={value ?? ''}
                maxLength={12}
                onChange={(e) => {
                  onChange(phoneNumberAutoFormat(e.target.value));
                }}
                {...field}
              />
            )}
          />
          <CustomInput
            label={t('fields.startDate')}
            type="date"
            registration={register('startDate')}
            error={errors.startDate}
          />
          <FileUpload
            label="CV file"
            control={control}
            name="cvFile"
            error={errors?.cvFile}
            types={['pdf', 'word']}
            displayFileName
            acceptedFileTypes="application/pdf,application/msword"
            trigger={() => (
              <Button
                color="secondary"
                fontWeight={500}
                size="lg"
                variant="ghost"
                leftIcon={<Icon as={MdOutlineFileUpload} boxSize={5} />}
                isDisabled={isLoading}
              >
                {t('common.upload')}
              </Button>
            )}
            stackProps={{ direction: 'column', align: 'flex-start', spacing: 4 }}
            controlProps={{
              bg: 'white',
              rounded: '8px',
              w: { base: 'full' },
            }}
            labelProps={{
              w: 'full',
            }}
          />
        </Stack>
      </CustomFormProvider>
    </ModalBase>
  );
}
