import { useEffect } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpsertSkillHook } from '../hooks/mutations';

import type { ISkill } from '../types';

import {
  CustomChakraReactSelect,
  CustomFormProvider,
  CustomInput,
  CustomTextArea,
  ModalBase,
} from '@/components/elements';
import { getSkillLevel, SKILL_LEVEL_OPTIONS } from '@/configs';

export interface UpsertSkillWidgetProps {
  isUpdate?: boolean;
  skill?: ISkill;
  isOpen: boolean;
  onClose: () => void;
}

export function UpsertSkillWidget(props: UpsertSkillWidgetProps) {
  const { t } = useTranslation();
  const { isUpdate, skill, isOpen, onClose } = props;

  const { formUpsertSkill, handleUpsertSkill, isLoading, reset } = useUpsertSkillHook({
    id: skill?.id,
    isUpdate,
    onClose,
  });

  const {
    register,
    control,
    formState: { errors, isDirty },
    reset: resetForm,
  } = formUpsertSkill;

  useEffect(() => {
    if (skill) {
      resetForm(
        {
          title: skill.title || '',
          description: skill.description || '',
          level: skill.level || '',
        },
        {
          keepDirty: false,
        }
      );
    }
  }, [skill, resetForm]);

  if (!isOpen) return null;

  return (
    <ModalBase
      size="xl"
      renderFooter={() => (
        <Button
          form="form-upsert-skill"
          w={20}
          type="submit"
          isDisabled={isLoading || (isUpdate && !isDirty)}
        >
          {t('common.save')}
        </Button>
      )}
      title={
        isUpdate
          ? `${t('common.update')} ${t('common.skill').toLowerCase()}`
          : `${t('common.create')} ${t('common.skill').toLowerCase()}`
      }
      isOpen={isOpen}
      onClose={onClose}
      onCloseComplete={reset}
    >
      <CustomFormProvider
        id="form-upsert-skill"
        form={formUpsertSkill}
        onSubmit={handleUpsertSkill}
      >
        <Stack spacing={5}>
          <CustomInput
            label={t('fields.title')}
            isRequired
            registration={register('title')}
            error={errors.title}
          />
          <CustomChakraReactSelect
            placeholder={`${t('common.choose')} ${t('common.level').toLowerCase()}`}
            label={t('common.level')}
            options={SKILL_LEVEL_OPTIONS.map((s) => ({
              label: getSkillLevel(t, s),
              value: s,
            }))}
            isRequired
            control={control}
            name="level"
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
