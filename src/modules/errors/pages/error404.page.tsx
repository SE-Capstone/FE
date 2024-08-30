import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Stack } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import type { To } from 'react-router-dom';

export function Error404Page() {
  return (
    <Stack align="center" justify="center" w="100vw" h="100vh" bg="white">
      <Alert
        status="error"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        height="100%"
        bg="white"
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Page not found
        </AlertTitle>
        <AlertDescription maxWidth="md" />
        <Button mt={4} as={Link} to={-1 as To} size="sm">
          Back
        </Button>
      </Alert>
    </Stack>
  );
}
