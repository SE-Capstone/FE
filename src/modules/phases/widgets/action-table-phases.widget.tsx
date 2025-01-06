import { Box, Button, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { UpsertPhaseWidget } from './upsert-phase.widget';

import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTablePhasesWidget() {
  const { t } = useTranslation();
  const { members, permissions } = useProjectContext();
  const { currentUser } = useAuthentication();
  const disclosureModal = useDisclosure();

  return (
    permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) &&
    !!members?.find((m) => m.id === currentUser?.id) && (
      <Box p={5} py={3} mb={5} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
        <HStack justify="space-between">
          <Spacer />
          {permissions.includes(ProjectPermissionEnum.IsProjectConfigurator) &&
            !!members?.find((m) => m.id === currentUser?.id) && (
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
