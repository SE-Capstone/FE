import { Box, Button, HStack, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { APP_PATHS } from '@/routes/paths/app.paths';

export function ActionTableRolesWidget() {
  return (
    <Box p={5} mb={6} rounded={2.5} bg="white" w="full" shadow="0 1px 4px 0 #0002">
      <HStack justify="space-between">
        <Stack flexBasis="50%" />

        <Button as={Link} to={APP_PATHS.createRole} size="md" leftIcon={<>+</>}>
          Create
        </Button>
      </HStack>
    </Box>
  );
}
