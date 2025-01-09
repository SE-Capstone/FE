import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { FaRegCircleCheck } from 'react-icons/fa6';
import { IoPlayOutline } from 'react-icons/io5';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useNewCompletePhaseHook } from '../../hooks/mutations/use-new-complete-phase.hooks';
import { useRemovePhaseHook } from '../../hooks/mutations/use-remove-phase.hooks';
import { UpsertPhaseWidget } from '../upsert-phase.widget';

import type { IPhase } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { ProjectStatusEnum } from '@/modules/projects/list-project/types';

interface ActionMenuTablePhasesProps {
  phase: IPhase;
  permissions: string[];
}

export function ActionMenuTablePhases({ phase, permissions }: ActionMenuTablePhasesProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { project } = useProjectContext();
  const { handleRemovePhase } = useRemovePhaseHook();
  const { handleCompletePhase } = useNewCompletePhaseHook({ phaseId: phase.id });
  const isDone = !!phase?.actualEndDate;
  const isRunning = !!phase?.actualStartDate && !phase?.actualEndDate;

  if (!phase || !phase.id) return null;

  const menuOptions = [
    permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) &&
      project?.status === ProjectStatusEnum.InProgress &&
      !phase.actualEndDate && {
        label: !phase.actualStartDate ? t('common.startPhase') : t('common.completePhase'),
        type: 'warning',
        icon: !phase.actualStartDate ? (
          <Icon as={IoPlayOutline} boxSize={5} />
        ) : (
          <Icon as={FaRegCircleCheck} boxSize={5} />
        ),
        onClick: () => handleCompletePhase(!!phase.actualStartDate),
      },
    permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) &&
      !phase.actualEndDate && {
        label: t('actions.edit'),
        icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
        onClick: () => {
          if (!phase.id) return;

          disclosureModal.onOpen();
        },
      },
    !isDone &&
      !isRunning &&
      permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) && {
        type: 'danger',
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
