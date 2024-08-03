import type { ReactNode } from 'react';

import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Spinner,
  Text,
} from '@chakra-ui/react';

type MaybeBooleanFunction = boolean | (() => boolean);

interface StateHandlerProps {
  showLoader?: MaybeBooleanFunction;
  showError?: MaybeBooleanFunction;
  showEmpty?: MaybeBooleanFunction;
  retryHandler?: () => void;
  children: ReactNode;
}

export function StateHandler(props: StateHandlerProps) {
  const {
    showLoader = false,
    showError = false,
    showEmpty = false,
    retryHandler = undefined,
    children,
  } = props;

  const isLoader = typeof showLoader === 'function' ? showLoader() : showLoader;
  const isError = typeof showError === 'function' ? showError() : showError;
  const isEmpty = typeof showEmpty === 'function' ? showEmpty() : showEmpty;

  if (isLoader) {
    return (
      <Center minH="150px" bg="white" w="full" rounded={2.5}>
        <Spinner thickness="3px" size="lg" label="Loading..." color="primary" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Alert
        status="error"
        variant="subtle"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        bg="white"
        rounded={2.5}
        p={5}
      >
        <AlertIcon boxSize="40px" mr={0} />
        <AlertTitle mt={4} mb={1} fontSize="lg">
          Oops!
        </AlertTitle>
        <AlertDescription maxWidth="sm">Có lỗi xảy ra</AlertDescription>
        {retryHandler ? (
          <Button display="none" size="md" my={2} onClick={() => retryHandler()}>
            Retry
          </Button>
        ) : null}
      </Alert>
    );
  }

  if (!isError && !isLoader && isEmpty) {
    return (
      <Center bg="white" w="full" h="full" rounded={2.5}>
        <Text as="span" fontSize="sm">
          Không có dữ liệu
        </Text>
      </Center>
    );
  }

  return <>{children}</>;
}
