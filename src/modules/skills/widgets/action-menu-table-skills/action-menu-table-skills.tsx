import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveSkillHook } from '../../hooks/mutations/use-remove-skill.hooks';
import { UpsertSkillWidget } from '../upsert-skill.widget';

import type { ISkill } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableSkillsProps {
  skill: ISkill;
}
export function ActionMenuTableSkills({ skill }: ActionMenuTableSkillsProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { handleRemoveSkill } = useRemoveSkillHook();
  const { permissions } = useAuthentication();

  if (!skill || !skill.id) return null;

  const menuOptions = [
    permissions[PermissionEnum.UPDATE_SKILL] && {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!skill.id) return;

        disclosureModal.onOpen();
      },
    },
    permissions[PermissionEnum.DELETE_SKILL] && {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemoveSkill(skill),
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertSkillWidget
        skill={skill}
        isUpdate
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
