import { Box, Button, HStack, Spacer, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { UpsertPhaseWidget } from './upsert-phase.widget';
import { useCompletePhaseHook } from '../hooks/mutations/use-complete-phase.hooks';
import { PhaseStatus } from '../types';

import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';

export function ActionTablePhasesWidget({ phaseStatus }: { phaseStatus: PhaseStatus }) {
  const { t } = useTranslation();
  const { permissions } = useProjectContext();
  const disclosureModal = useDisclosure();
  const { handleCompletePhase } = useCompletePhaseHook();

  return (
    permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) && (
      <Box p={5} py={3} mb={5} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
        <HStack justify="space-between">
          <Spacer />
          {phaseStatus !== PhaseStatus.NoPhase && (
            <Tooltip
              label={
                phaseStatus !== PhaseStatus.NoPhaseRunning && phaseStatus !== PhaseStatus.Running
                  ? t('common.noRunningPhase')
                  : ''
              }
            >
              {permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) && (
                <Button
                  disabled={
                    phaseStatus !== PhaseStatus.Running &&
                    phaseStatus !== PhaseStatus.NoPhaseRunning
                  }
                  onClick={() => handleCompletePhase(phaseStatus === PhaseStatus.Running)}
                >
                  {phaseStatus === PhaseStatus.NoPhaseRunning
                    ? t('common.startPhase')
                    : t('common.completePhase')}
                </Button>
              )}
            </Tooltip>
          )}
          {permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) && (
            <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
          )}
          <UpsertPhaseWidget isOpen={disclosureModal.isOpen} onClose={disclosureModal.onClose} />
        </HStack>
      </Box>
    )
  );
}
