import type { PropsWithChildren } from 'react';

import { Box, Heading } from '@chakra-ui/react';

interface CardPanelProps {
  title: string;
}

export const CardPanel = (props: PropsWithChildren<CardPanelProps>) => {
  const { children, title } = props;
  return (
    <Box w="full" shadow="panel" p={6} bg="white" rounded={3}>
      {title ? (
        <Heading mb={3} variant="sub-title">
          {title}
        </Heading>
      ) : null}

      {children}
    </Box>
  );
};
