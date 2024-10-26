import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import { APP_PATHS } from '@/routes/paths/app.paths';

export function Error403Page() {
  const { t } = useTranslation();
  return (
    <Stack align="center" justify="center" w="100vw" h="100vh">
      <Alert
        status="warning"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100%"
        bg="neutral.600"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          403 - ACCESS DENIED
        </AlertTitle>
        <AlertDescription maxWidth="md">{t('common.403PageMessage')}</AlertDescription>
        <Stack direction="row" spacing={2} mt={4}>
          <Button as={Link} to={APP_PATHS.HOME}>
            {t('common.back')}
          </Button>
        </Stack>
      </Alert>
    </Stack>
  );
}
