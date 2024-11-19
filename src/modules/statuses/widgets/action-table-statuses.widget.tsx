import { Box, Button, HStack, Spacer, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { UpsertStatusWidget } from './upsert-status.widget';

import { PermissionEnum, ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { useAuthentication } from '@/modules/profile/hooks';

export function ActionTableStatusesWidget({ isDefault }: { isDefault?: boolean }) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { permissions } = useAuthentication();
  const { permissions: permissionProject } = useProjectContext();
  const disclosureModal = useDisclosure();
  const canCreate =
    (permissionProject.includes(ProjectPermissionEnum.IsProjectConfigurator) &&
      pathname.includes('projects')) ||
    (isDefault && permissions[PermissionEnum.ADD_DEFAULT_STATUS] && pathname.includes('settings'));

  return (
    canCreate && (
      <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
        <HStack justify="space-between">
          <Spacer />
          {canCreate && (
            <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
              {t('common.create')}
            </Button>
          )}
          <UpsertStatusWidget
            isOpen={disclosureModal.isOpen}
            isDefault={isDefault}
            onClose={disclosureModal.onClose}
          />
        </HStack>
      </Box>
    )
  );
}
