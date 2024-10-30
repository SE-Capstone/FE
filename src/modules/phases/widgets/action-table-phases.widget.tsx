import { Box, Button, HStack, Spacer, Tooltip, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { UpsertPhaseWidget } from './upsert-phase.widget';
import { useCompletePhaseHook } from '../hooks/mutations/use-complete-phase.hooks';
import { PhaseStatus } from '../types';

import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTablePhasesWidget({ phaseStatus }: { phaseStatus: PhaseStatus }) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const disclosureModal = useDisclosure();
  const { handleCompletePhase } = useCompletePhaseHook();

  return (
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
            {/* TODO: add permission complete phase */}
            <Button
              disabled={
                phaseStatus !== PhaseStatus.Running && phaseStatus !== PhaseStatus.NoPhaseRunning
              }
              onClick={() => handleCompletePhase(phaseStatus === PhaseStatus.Running)}
            >
              {phaseStatus === PhaseStatus.NoPhaseRunning
                ? t('common.startPhase')
                : t('common.completePhase')}
            </Button>
          </Tooltip>
        )}
        {permissions[PermissionEnum.ADD_PHASE] && (
          <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
            {t('common.create')}
          </Button>
        )}
        <UpsertPhaseWidget isOpen={disclosureModal.isOpen} onClose={disclosureModal.onClose} />
      </HStack>
    </Box>
  );
}
