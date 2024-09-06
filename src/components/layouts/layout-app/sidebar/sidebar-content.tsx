import { useMemo } from 'react';

import { Box, CloseButton, Flex, HStack, Icon, Image, Stack, Text } from '@chakra-ui/react';
import {
  MdLogout,
  MdOutlineCategory,
  MdOutlineHome,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdOutlineNewspaper,
} from 'react-icons/md';
import { Link } from 'react-router-dom';

import { NavItem } from './nav-item';

import type { NavItemProps } from './nav-item';
import type { BoxProps } from '@chakra-ui/react';

import { IMAGE_URLS } from '@/assets/images';
import { CustomAccordion } from '@/components/elements';
import { notify } from '@/libs/helpers';
import { useLogoutMutation } from '@/modules/auth/apis/logout.api';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

type LinkItemProps = Pick<NavItemProps, 'path' | 'icon'> & {
  name: string;
  children?: Array<LinkItemProps>;
};

interface SidebarContentProps extends BoxProps {
  onClose: () => void;
}

export const SidebarContent = ({ onClose, ...rest }: SidebarContentProps) => {
  const { isLogged, isAdmin } = useAuthentication();
  const { handleLogout: handleLogoutMutation, isPending: logoutMutationResult } =
    useLogoutMutation();

  async function handleLogout() {
    if (!isLogged) return;

    try {
      handleLogoutMutation();
    } catch (error) {
      notify({
        type: 'error',
        message: 'Có lỗi xảy ra, vui lòng thử lại sau',
      });
    }
  }
  const LINK_ITEMS: Array<LinkItemProps> = useMemo(
    () =>
      [
        {
          name: 'Home',
          icon: MdOutlineHome,
          path: APP_PATHS.HOME,
        },
        isAdmin && {
          name: 'Users',
          icon: MdOutlinePeopleAlt,
          path: undefined,
          children: [
            {
              name: 'List User',
              icon: MdOutlineCategory,
              path: APP_PATHS.listUsers,
            },
          ],
        },
        isAdmin && {
          name: 'Roles',
          icon: MdOutlineSettings,
          path: '/roles',
        },
        {
          name: 'News',
          icon: MdOutlineNewspaper,
          path: '/news',
        },
      ].filter(Boolean),
    [isAdmin]
  );

  return (
    <Box bg="white" w={{ base: 'full', lg: 84 }} pos="fixed" h="full" {...rest}>
      <Flex alignItems="center" mx="8" justify="center" mt={6}>
        <HStack alignItems="center" justify="center" pos="relative" mb={4}>
          <Box role="presentation" as={Link} cursor="pointer" to={APP_PATHS.HOME}>
            <Image
              objectFit="cover"
              boxSize="88px"
              src={IMAGE_URLS.logo}
              alt="Logo"
              mb={1}
              loading="lazy"
              _hover={{}}
            />
          </Box>
        </HStack>
        <CloseButton
          display={{ base: 'flex', lg: 'none' }}
          position="absolute"
          right={3}
          top={3}
          onClick={onClose}
        />
      </Flex>
      <Flex
        flexDir="column"
        h="full"
        flex={1}
        direction="column"
        pos="relative"
        maxH="calc(100vh - 150px)"
        overflowY="auto"
      >
        <Stack spacing={0.5}>
          {LINK_ITEMS.map((link) => {
            if (link.children) {
              return (
                <CustomAccordion
                  key={link.name + link.path}
                  accordionItems={[
                    {
                      accordionButtonProps: { pl: 8 },
                      title: ({ isExpanded }) => (
                        <HStack role="group" spacing={4}>
                          <Icon
                            boxSize={5}
                            color={isExpanded ? 'primary' : 'neutral.300'}
                            as={link.icon}
                            flexShrink={0}
                          />
                          <Text
                            fontSize="14px"
                            lineHeight="19px"
                            color={isExpanded ? 'primary' : 'neutral.300'}
                            fontWeight="semibold"
                          >
                            {link.name}
                          </Text>
                        </HStack>
                      ),
                      panel: link.children?.map((child) => (
                        <NavItem key={child.path} icon={child.icon} path={child.path}>
                          {child.name}
                        </NavItem>
                      )),
                    },
                  ]}
                />
              );
            }

            return (
              <NavItem key={link.name} icon={link.icon} path={link.path} onClick={onClose}>
                {link.name}
              </NavItem>
            );
          })}
        </Stack>
        <Box
        // bottom={{ base: 0, md: '23%' }}
        // pos={{ base: 'static', md: 'absolute' }}
        // right={0}
        // left={0}
        >
          <NavItem icon={MdLogout} onClick={logoutMutationResult ? undefined : handleLogout}>
            Đăng xuất
          </NavItem>
        </Box>
      </Flex>
    </Box>
  );
};
