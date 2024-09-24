import { useMemo, useState } from 'react';

import { Box, Button, CloseButton, Flex, HStack, Icon, Image } from '@chakra-ui/react';
import { BsWindowDock } from 'react-icons/bs';
import {
  MdLogout,
  MdOutlineCategory,
  MdOutlineHome,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdOutlineNewspaper,
} from 'react-icons/md';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

import type { NavItemProps } from './nav-item';
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

export const SidebarContent = ({ onClose, isOpen, ...rest }: SidebarContentProps) => {
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
      style={{ height: '100%' }}
      customBreakPoint="1024px"
      collapsedWidth="70px"
      onBackdropClick={onClose}
    >
      <Menu
        menuItemStyles={{
          button: {
            // the active class will be added automatically by react router
            // so we can use it to style the active menu item
            [`&.active`]: {
              backgroundColor: '#13395e',
              color: '#b6c8d9',
            },
          },
        }}
      >
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
        {LINK_ITEMS.map((link) => {
          if (link.children) {
            return (
              <SubMenu
                key={link.name + link.path}
                label={link.name}
                icon={
                  <Icon
                    mr="4"
                    boxSize={5}
                    _groupHover={{
                      color: 'white',
                    }}
                    as={MdOutlineHome}
                  />
                }
              >
                {link.children?.map((child) => (
                  <MenuItem
                    key={child.path}
                    icon={
                      <Icon
                        mr="4"
                        boxSize={5}
                        _groupHover={{
                          color: 'white',
                        }}
                        as={child.icon}
                      />
                    }
                    component={<Link to={child.path ?? '#'} />}
                  >
                    {child.name}
                  </MenuItem>
                ))}
              </SubMenu>
            );
          }

          return (
            <MenuItem
              key={link.name}
              icon={
                <Icon
                  mr="4"
                  boxSize={5}
                  _groupHover={{
                    color: 'white',
                  }}
                  as={link.icon}
                />
              }
              component={<Link to={link.path ?? '#'} />}
            >
              {link.name}
            </MenuItem>
          );
        })}
      </Menu>
      <Button hidden={isOpen} onClick={() => setCollapsed(!collapsed)} />
    </Sidebar>
  );
};
