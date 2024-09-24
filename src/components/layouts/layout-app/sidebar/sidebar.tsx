import type React from 'react';

import { Box, Flex, Stack, useDisclosure } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

import { MobileNav } from './mobile-nav';
import { SidebarContent } from './sidebar-content';

import { IMAGE_URLS } from '@/assets/images';
import { APP_PATHS } from '@/routes/paths/app.paths';
import { genericMemo } from '@/types';

export default genericMemo(function ({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column" h="100vh" bg="white">
      <Stack spacing={0} flexDir="row" h="full">
        <SidebarContent isOpen={isOpen} display={{ base: 'none', lg: 'block' }} onClose={onClose} />
        <Stack flex={1} gap={0} flexDir="column" h="full">
          <MobileNav onOpen={onOpen} />
          <Box bg="#f6f6f6" flex={1} p={{ base: 4 }} h="full" overflowY="auto">
            {children}
          </Box>
        </Stack>
      </Stack>
    </Flex>
  );
});
