import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemovePhaseHook } from '../../hooks/mutations/use-remove-phase.hooks';
import { UpsertPhaseWidget } from '../upsert-phase.widget';

import type { IPhase } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTablePhasesProps {
  phase: IPhase;
}

export function ActionMenuTablePhases({ phase }: ActionMenuTablePhasesProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { handleRemovePhase } = useRemovePhaseHook();
  const isDone = !!phase?.actualEndDate;
  const isRunning = !!phase?.actualStartDate && !phase?.actualEndDate;

  if (!phase || !phase.id) return null;

  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!phase.id) return;

        disclosureModal.onOpen();
      },
    },
    !isDone &&
      !isRunning && {
        label: t('actions.delete'),
        icon: <Icon as={BiTrash} boxSize={5} />,
        onClick: () => handleRemovePhase(phase),
      },
  ].filter(Boolean);

  return (
    <>
      <UpsertPhaseWidget
        phase={phase}
        isUpdate
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} isDotVertical />}
      </ActionMenuTable>
    </>
  );
}
