import {
  Avatar,
  Heading,
  HStack,
  Stack,
  SkeletonCircle,
  Text,
  Tooltip,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from '@chakra-ui/react';
import { CgProfile } from 'react-icons/cg';
import { MdLogout } from 'react-icons/md';
import { Link, useLocation } from 'react-router-dom';

import { DEFAULT_MESSAGE } from '@/configs';
import { notify } from '@/libs/helpers';
import { useLogoutMutation } from '@/modules/auth/apis/logout.api';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function HeaderApp() {
  const { fullName, isLoading, currentUser, isLogged } = useAuthentication();

  const location = useLocation();

  const { pathname } = location;

  const TITLE_ROUTES = {
    [APP_PATHS.HOME]: 'Home',
    [APP_PATHS.listUser]: 'Users',
  } as const;

  const title = TITLE_ROUTES[pathname];

  const { handleLogout: handleLogoutMutation, isPending: logoutMutationResult } =
    useLogoutMutation();

  async function handleLogout() {
    if (!isLogged) return;

    try {
      handleLogoutMutation();
    } catch (error) {
      notify({
        type: 'error',
        message: DEFAULT_MESSAGE.SOMETHING_WRONG,
      });
    }
  }

  return (
    <HStack
      w="full"
      h="full"
      align="center"
      justify="space-between"
      px={{ base: 4, md: 6 }}
      shadow={{ base: 'none', lg: 'xl' }}
    >
      <Heading
        as="h1"
        fontWeight={700}
        fontSize={{ base: 'xl', sm: '2xl' }}
        sx={{
          lineHeight: '120%',
        }}
      >
        {title}
      </Heading>
      <HStack spacing={{ base: 4, md: 8 }}>
        <Menu isLazy>
          <MenuButton>
            <SkeletonCircle size="10" rounded="full" isLoaded={!isLoading}>
              <Tooltip label="Go to profile">
                <Avatar
                  name={fullName}
                  src={currentUser?.avatar}
                  boxSize="10"
                  objectFit="cover"
                  showBorder
                  borderColor="gray.200"
                />
              </Tooltip>
            </SkeletonCircle>
          </MenuButton>
          <MenuList borderColor="neutral.400" padding={0}>
            <Stack spacing={1} p={2}>
              <MenuItem
                as={Link}
                to="/profile"
                borderRadius={1.5}
                py={2.5}
                className="group"
                icon={<CgProfile fontSize="18px" />}
                color="neutral.300"
                _hover={{
                  color: 'white',
                  background: 'primary',
                }}
              >
                <Text
                  fontSize="14px"
                  lineHeight="19px"
                  color="neutral.300"
                  _groupHover={{
                    color: 'white',
                  }}
                  fontWeight="semibold"
                >
                  Profile
                </Text>
              </MenuItem>
              <MenuItem
                py={2.5}
                borderRadius={1.5}
                icon={<MdLogout fontSize="18px" />}
                color="neutral.300"
                _hover={{
                  color: 'white',
                  background: 'primary',
                }}
                className="group"
                onClick={logoutMutationResult ? undefined : handleLogout}
              >
                <Text
                  fontSize="14px"
                  lineHeight="19px"
                  color="neutral.300"
                  _groupHover={{
                    color: 'white',
                  }}
                  fontWeight="semibold"
                >
                  Logout
                </Text>
              </MenuItem>
            </Stack>
          </MenuList>
        </Menu>
        {/* <HStack spacing={4} as={Link} to="/profile">
          <SkeletonCircle size="11" rounded="full" isLoaded={!isLoading}>
            <Tooltip label="Go to profile">
              <Avatar
                name={fullName}
                src={currentUser?.avatar}
                boxSize="12"
                objectFit="cover"
                showBorder
                borderColor="gray.200"
              />
            </Tooltip>
          </SkeletonCircle>

          <Skeleton isLoaded={!isLoading}>
            <Tooltip
              label={
                <Stack spacing={0.5}>
                  <Text color="white">Account</Text>
                  <Text color="#a4a8ac">{fullName}</Text>
                  <Text color="#a4a8ac">{phoneNumberAutoFormat(currentUser?.phone || '')}</Text>
                </Stack>
              }
            >
              {!!fullName?.trim() && (
                <Text
                  cursor="pointer"
                  color="secondary"
                  fontWeight={700}
                  fontSize="sm"
                  lineHeight="4"
                  minW={{ base: 0, xl: 15 }}
                  display={{ base: 'none', md: 'block' }}
                >
                  {fullName}
                </Text>
              )}
            </Tooltip>
          </Skeleton>
        </HStack> */}
      </HStack>
    </HStack>
  );
}
