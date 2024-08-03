import { Flex, IconButton } from '@chakra-ui/react';
import { FiMenu } from 'react-icons/fi';

import { HeaderApp } from '../header';

import type { FlexProps } from '@chakra-ui/react';

interface MobileProps extends FlexProps {
  onOpen: () => void;
}
export const MobileNav = ({ onOpen, ...rest }: MobileProps) => (
  <Flex
    bg="white"
    px={{ base: 4, md: 0 }}
    height="20"
    alignItems="center"
    justifyContent={{ base: 'space-between', md: 'flex-end' }}
    shadow="lg"
    flexShrink={0}
    {...rest}
  >
    <IconButton
      display={{ base: 'flex', lg: 'none' }}
      variant="outline"
      aria-label="open menu"
      icon={<FiMenu />}
      onClick={onOpen}
    />
    <HeaderApp />
  </Flex>
);
