import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableRolesWidget() {
  const { t } = useTranslation();
  return (
    <Box p={5} py={3} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Stack flexBasis="50%" />

        <Button as={Link} to={APP_PATHS.createRole} size="md" leftIcon={<>+</>}>
          {t('common.create')}
        </Button>
      </HStack>
    </Box>
  );
}
