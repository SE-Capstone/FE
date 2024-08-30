import { Button, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { Link, useRouteError } from 'react-router-dom';

import type { To } from 'react-router-dom';

import { isDevelopment } from '@/configs';

export function ErrorPage() {
  const error = useRouteError() as {
    status: number;
    statusText: string;
    data: unknown;
  };

  return (
    <VStack id="error-page" w="full" h="100vh" justify="center">
      <Heading textAlign="center">Oops!</Heading>
      <Text textAlign="center">Sorry, an unexpected error has occurred.</Text>
      {isDevelopment ? (
        <Text textAlign="center">
          <strong>{error.statusText}</strong>
        </Text>
      ) : null}

      <Stack w="200px">
        <Button as={Link} to={-1 as To}>
          Back to home page
        </Button>
      </Stack>

      {isDevelopment ? <Button onClick={() => window.location.reload()}>Reload</Button> : null}
    </VStack>
  );
}
