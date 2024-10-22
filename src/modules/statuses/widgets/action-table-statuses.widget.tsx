import { Box, Button, HStack, Spacer, useDisclosure } from '@chakra-ui/react';

import { UpsertStatusWidget } from './upsert-status.widget';

export function ActionTableStatusesWidget({ isDefault }: { isDefault?: boolean }) {
  const disclosureModal = useDisclosure();

  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Spacer />
        <Button leftIcon={<>+</>} onClick={disclosureModal.onOpen}>
          Create
        </Button>
        <UpsertStatusWidget
          isOpen={disclosureModal.isOpen}
          isDefault={isDefault}
          onClose={disclosureModal.onClose}
        />
      </HStack>
    </Box>
  );
}
