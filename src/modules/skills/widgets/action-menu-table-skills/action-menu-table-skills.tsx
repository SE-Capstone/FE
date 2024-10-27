import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveSkillHook } from '../../hooks/mutations/use-remove-skill.hooks';
import { UpsertSkillWidget } from '../upsert-skill.widget';

import type { ISkill } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableSkillsProps {
  skill: ISkill;
}
export function ActionMenuTableSkills({ skill }: ActionMenuTableSkillsProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { handleRemoveSkill } = useRemoveSkillHook();

  if (!skill || !skill.id) return null;

  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!skill.id) return;

        disclosureModal.onOpen();
      },
    },
    {
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
