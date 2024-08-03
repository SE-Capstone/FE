import type { PropsWithChildren } from 'react';

import { Avatar, Center, Heading, Stack } from '@chakra-ui/react';

export interface LayoutAuthProps extends PropsWithChildren {
  Icon: React.ReactElement;
  title: string;
}

export function LayoutAuth(props: LayoutAuthProps) {
  const { Icon, title, children } = props;
  return (
    <Stack align="center" h="h-screen" w="w-screen" justify="center">
      <Stack w={{ base: '350px', md: '400px' }} spacing={5}>
        <Center>
          <Avatar sx={{ m: 1, bg: 'secondary' }} mx="auto">
            {Icon}
          </Avatar>
        </Center>
        <Heading as="h1" textAlign="center">
          {title}
        </Heading>

        {children}
      </Stack>
    </Stack>
  );
}
