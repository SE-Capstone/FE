import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useUpsertSkillMutation } from '../../apis/upsert-skill.api';
import { skillFormSchema } from '../../validations/skills.validations';

import type { SkillFormValues } from '../../validations/skills.validations';

import { useFormWithSchema } from '@/libs/hooks';

export function useUpsertSkillHook({
  id,
  isUpdate,
  onClose,
}: {
  id?: string;
  isUpdate?: boolean;
  onClose: () => void;
}) {
  const { t } = useTranslation();
  const formUpsertSkill = useFormWithSchema({
    schema: skillFormSchema(t),
  });

  const { reset } = formUpsertSkill;

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertSkillMutation({ onClose, reset, isUpdate });

  const handleUpsertSkill = useCallback(
    async (values: SkillFormValues) => {
      if (isLoading) return;

      try {
        await mutate({
          body: {
            ...values,
            id,
          },
        });
      } catch (error) {}
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isLoading, mutate]
  );

  return {
    formUpsertSkill,
    handleUpsertSkill,
    isLoading,
    ...restData,
  };
}
