import type React from 'react';

import { Box, Drawer, DrawerContent, Flex, Stack, useDisclosure } from '@chakra-ui/react';

import { MobileNav } from './mobile-nav';
import { SidebarContent } from './sidebar-content';

import { genericMemo } from '@/types';

export default genericMemo(function ({ children }: { children: React.ReactNode }) {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Flex flexDir="column" h="100vh" bg="white">
      <SidebarContent display={{ base: 'none', lg: 'block' }} onClose={onClose} />
      <Drawer
        isOpen={isOpen}
        placement="left"
        size={{ base: 'full', md: 'md' }}
        onClose={onClose}
        onOverlayClick={onClose}
      >
        {/* <DrawerOverlay /> */}

        <DrawerContent>
          <SidebarContent h="full" overflowY="hidden" onClose={onClose} />
        </DrawerContent>
      </Drawer>

      <Stack spacing={0} flexGrow={1} ml={{ base: 0, lg: 84 }} h="full">
        <MobileNav onOpen={onOpen} />
        <Box bg="#f6f6f6" p={{ base: 4 }} overflowY="auto" flexGrow={1}>
          {children}
        </Box>
      </Stack>
    </Flex>
  );
});
