import { useMemo, useState } from 'react';

import { Box, Button, CloseButton, Flex, HStack, Icon, Image, Stack, Text } from '@chakra-ui/react';
import { BsWindowDock } from 'react-icons/bs';
import {
  MdLogout,
  MdOutlineCategory,
  MdOutlineHome,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdOutlineNewspaper,
  MdArrowBackIosNew,
  MdArrowForwardIos,
} from 'react-icons/md';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

import { NavItem, type NavItemProps } from './nav-item';

import type { BoxProps } from '@chakra-ui/react';

import { IMAGE_URLS } from '@/assets/images';
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
  isOpen: boolean;
}

export const SidebarContent = ({ onClose, isOpen }: SidebarContentProps) => {
  const location = useLocation();
  const { isLogged, isAdmin } = useAuthentication();
  const [collapsed, setCollapsed] = useState(false);
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
          name: 'Projects',
          icon: BsWindowDock,
          path: '/projects',
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
    <Sidebar
      toggled={isOpen}
      collapsed={collapsed}
      style={{ height: '100%', paddingBottom: collapsed ? '0px' : '40px' }}
      customBreakPoint="1024px"
      collapsedWidth="70px"
      backgroundColor="white"
      onBackdropClick={onClose}
    >
      <Menu>
        <Flex alignItems="center" justify="center" mt={6}>
          <HStack alignItems="center" justify="center" pos="relative" mb={4}>
            <Box role="presentation" as={Link} cursor="pointer" to={APP_PATHS.HOME}>
              <Image
                objectFit="cover"
                boxSize={collapsed ? '50px' : '88px'}
                transition="all 0.3s ease"
                src={IMAGE_URLS.logo}
                alt="Logo"
                mb={1}
                loading="lazy"
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
        <Stack>
          {LINK_ITEMS.map((link) => {
            const isActiveParent =
              link.children && link.children.some((child) => child.path === location.pathname);

            if (link.children) {
              return (
                <SubMenu
                  key={link.name + link.path}
                  className="ps-menu-group"
                  label={
                    <Text
                      fontSize="14px"
                      lineHeight="19px"
                      color={isActiveParent ? 'primary' : 'neutral.300'}
                      fontWeight="semibold"
                    >
                      {link.name}
                    </Text>
                  }
                  icon={
                    <Icon
                      mr="4"
                      boxSize={5}
                      color={isActiveParent ? 'primary' : 'neutral.300'}
                      _groupHover={{
                        color: 'white',
                      }}
                      ml={3}
                      as={link.icon}
                    />
                  }
                  rootStyles={{
                    [`& > div`]: {
                      '&:hover': {
                        transition: 'ease 0.3s',
                      },
                    },
                  }}
                  defaultOpen={isActiveParent}
                >
                  {link.children?.length > 1 && <Stack mb={2} />}
                  <Stack gap={collapsed ? 0 : 2}>
                    {link.children?.map((child) => (
                      <MenuItem
                        key={child.path}
                        rootStyles={{
                          [`& > .ps-menu-button`]: {
                            margin: collapsed ? '6px' : '',
                            height: '100% !important',
                            padding: collapsed ? '0 !important' : '0 20px !important',
                            '&:hover': {
                              backgroundColor: 'white !important',
                            },
                          },
                        }}
                      >
                        <NavItem
                          key={child.path}
                          isTransitionOn={false}
                          m={0}
                          icon={child.icon}
                          path={child.path}
                        >
                          {child.name}
                        </NavItem>
                      </MenuItem>
                    ))}
                  </Stack>
                </SubMenu>
              );
            }

            return (
              <MenuItem
                key={link.name}
                rootStyles={{
                  [`& > .ps-menu-button`]: {
                    padding: '0.5rem !important',
                    '&:hover': {
                      backgroundColor: 'white !important',
                    },
                  },
                }}
              >
                <NavItem key={link.name} m={0} icon={link.icon} path={link.path} onClick={onClose}>
                  {link.name}
                </NavItem>
              </MenuItem>
            );
          })}
          <MenuItem
            rootStyles={{
              [`& > .ps-menu-button`]: {
                padding: '0.5rem !important',
                '&:hover': {
                  backgroundColor: 'white !important',
                },
              },
            }}
          >
            <NavItem
              icon={MdLogout}
              m={0}
              onClick={logoutMutationResult ? undefined : handleLogout}
            >
              Logout
            </NavItem>
          </MenuItem>
        </Stack>
      </Menu>
      <Button
        position="fixed"
        bottom={0}
        width={collapsed ? `70px` : '249px'}
        transition="all 0.3s ease"
        borderRadius="none"
        hidden={isOpen}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Icon boxSize={5} as={MdArrowForwardIos} />
        ) : (
          <Icon boxSize={5} as={MdArrowBackIosNew} />
        )}
      </Button>
    </Sidebar>
  );
};
