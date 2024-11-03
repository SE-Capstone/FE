import { useCallback } from 'react';

import { useTranslation } from 'react-i18next';

import { useUpsertUserSkillsMutation } from '../../apis/upsert-user-skills.api';

import type { ISkill } from '../../types';

import { notify } from '@/libs/helpers';

interface IUpsertUserSkillsHook {
  oldUserSkills: ISkill[];
  newUserSkills: ISkill[];
}

export const getDifferenceOfTwoArrays = <T extends { id: string }>(
  oldArray: T[],
  newArray: T[]
): { addedItems: T[]; removedItems: T[] } => {
  const oldIds = new Set(oldArray.map((item) => item.id));
  const newIds = new Set(newArray.map((item) => item.id));

  const addedItems = newArray.filter((item) => !oldIds.has(item.id));
  const removedItems = oldArray.filter((item) => !newIds.has(item.id));

  return {
    addedItems,
    removedItems,
  };
};

export function useUpsertUserSkillsHook({ userId }: { userId: string }) {
  const { t } = useTranslation();
  const { mutate, isPending: isLoading, ...restData } = useUpsertUserSkillsMutation({ userId });

  const handleUpsertUserSkills = useCallback(
    async (values: IUpsertUserSkillsHook) => {
      if (isLoading) return;

      const { addedItems, removedItems } = getDifferenceOfTwoArrays(
        values.oldUserSkills,
        values.newUserSkills
      );

      if (addedItems.length === 0 && removedItems.length === 0) {
        notify({
          type: 'error',
          message: t('messages.sameSkills'),
        });
        return;
      }

      try {
        if (addedItems.length > 0) {
          mutate({
            body: {
              userId,
              isDelete: false,
              skillIds: addedItems.map((s) => s.id),
            },
          });
        }
        if (removedItems.length > 0) {
          mutate({
            body: {
              userId,
              isDelete: true,
              skillIds: removedItems.map((s) => s.id),
            },
          });
        }
      } catch (error) {}
    },
    [isLoading, mutate, t, userId]
  );

  return {
    handleUpsertUserSkills,
    isLoading,
    ...restData,
  };
}
