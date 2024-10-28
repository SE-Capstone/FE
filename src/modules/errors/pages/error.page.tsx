import { Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdLogout } from 'react-icons/md';
import { Link, useRouteError } from 'react-router-dom';

import type { To } from 'react-router-dom';

import { DEFAULT_MESSAGE, isDevelopment } from '@/configs';
import { notify } from '@/libs/helpers';
import { useLogoutMutation } from '@/modules/auth/apis/logout.api';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ErrorPage() {
  const { t } = useTranslation();
  const error = useRouteError() as {
    status: number;
    statusText: string;
    data: unknown;
  };

  const { handleLogout: handleLogoutMutation, isPending: logoutMutationResult } =
    useLogoutMutation();

  async function handleLogout() {
    try {
      handleLogoutMutation();
    } catch (error) {
      notify({
        type: 'error',
        message: DEFAULT_MESSAGE(t).SOMETHING_WRONG,
      });
    }
  }

  return (
    <VStack id="error-page" w="full" h="100vh" justify="center">
      <Heading textAlign="center">Oops!</Heading>
      <Text textAlign="center">{t('messages.errorPageMessage')}</Text>
      {isDevelopment ? (
        <Text textAlign="center">
          <strong>{error.statusText}</strong>
        </Text>
      ) : null}

      <Stack w="200px" gap={2}>
        <Button as={Link} to={APP_PATHS.HOME}>
          {t('common.backToHomePage')}
        </Button>
      </Stack>

      <Button leftIcon={<MdLogout />} onClick={logoutMutationResult ? undefined : handleLogout}>
        {t('common.logout')}
      </Button>
    </VStack>
  );
}
