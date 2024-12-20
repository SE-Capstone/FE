import { useMemo, useState } from 'react';

import {
  Box,
  Button,
  CloseButton,
  Flex,
  HStack,
  Icon,
  Image,
  Stack,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { AiOutlineIdcard } from 'react-icons/ai';
import { BsWindowDock } from 'react-icons/bs';
import {
  MdOutlineLayers,
  MdOutlineCategory,
  MdOutlineHome,
  MdOutlinePeopleAlt,
  MdOutlineSettings,
  MdArrowBackIosNew,
  MdArrowForwardIos,
} from 'react-icons/md';
import { PiUserSquareLight } from 'react-icons/pi';
import { RiFolderUserLine } from 'react-icons/ri';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

import { NavItem, type NavItemProps } from './nav-item';

import type { BoxProps } from '@chakra-ui/react';

import { IMAGE_URLS } from '@/assets/images';
import { PermissionEnum } from '@/configs';
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
  const { t } = useTranslation();
  const location = useLocation();
  const { permissions } = useAuthentication();
  const [collapsed, setCollapsed] = useState(false);

  const LINK_ITEMS: Array<LinkItemProps> = useMemo(
    () =>
      [
        {
          name: t('common.home'),
          icon: MdOutlineHome,
          path: APP_PATHS.HOME,
        },
        (permissions[PermissionEnum.GET_LIST_USER] ||
          permissions[PermissionEnum.GET_SKILL] ||
          permissions[PermissionEnum.GET_POSITION] ||
          permissions[PermissionEnum.GET_APPLICANT] ||
          permissions[PermissionEnum.GET_SKILL_USER]) && {
          name: t('common.hr'),
          icon: MdOutlinePeopleAlt,
          path: undefined,
          children: [
            permissions[PermissionEnum.GET_LIST_USER] && {
              name: t('common.users'),
              icon: MdOutlineCategory,
              path: APP_PATHS.listUser,
            },
            permissions[PermissionEnum.GET_POSITION] && {
              name: t('common.positions'),
              icon: MdOutlineLayers,
              path: APP_PATHS.listPosition,
            },
            (permissions[PermissionEnum.GET_SKILL] ||
              permissions[PermissionEnum.GET_SKILL_USER]) && {
              name: t('common.skills'),
              icon: RiFolderUserLine,
              path: APP_PATHS.listSkill,
            },
            permissions[PermissionEnum.GET_APPLICANT] && {
              name: t('common.applicants'),
              icon: PiUserSquareLight,
              path: APP_PATHS.listApplicant,
            },
          ].filter(Boolean),
        },
        permissions[PermissionEnum.READ_LIST_ROLE] && {
          name: t('common.roles'),
          icon: AiOutlineIdcard,
          path: '/roles',
        },
        {
          name: t('common.projects'),
          icon: BsWindowDock,
          path: '/projects',
        },
        (permissions[PermissionEnum.READ_DEFAULT_LABEL] ||
          permissions[PermissionEnum.READ_DEFAULT_STATUS]) && {
          name: t('common.settings'),
          icon: MdOutlineSettings,
          path: '/settings',
        },
      ].filter(Boolean),
    [permissions, t]
  );

  return (
    <Stack>
      <Sidebar
        toggled={isOpen}
        collapsed={useBreakpointValue({ base: false, lg: collapsed })}
        style={{
          height: '100%',
          paddingBottom: useBreakpointValue({ base: '0px', lg: '50px', xl: '50px' }),
        }}
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
                        ml="-1px"
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
                        width: 'auto',
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
                          component={<Box />}
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
                  component={<Box />}
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
                    key={link.name}
                    m={0}
                    icon={link.icon}
                    path={link.path}
                    onClick={onClose}
                  >
                    {link.name}
                  </NavItem>
                </MenuItem>
              );
            })}
            {/* <MenuItem
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
          </MenuItem> */}
          </Stack>
        </Menu>
      </Sidebar>
      <Button
        position="absolute"
        bottom={0}
        width={collapsed ? `70px` : '249px'}
        transition="all 0.3s ease"
        borderRadius="none"
        hidden={useBreakpointValue({ base: true, lg: false, xl: false })}
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? (
          <Icon boxSize={5} as={MdArrowForwardIos} />
        ) : (
          <Icon boxSize={5} as={MdArrowBackIosNew} />
        )}
      </Button>
    </Stack>
  );
};
