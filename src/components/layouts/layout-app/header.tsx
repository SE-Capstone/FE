import {
  Avatar,
  Heading,
  HStack,
  Stack,
  Skeleton,
  SkeletonCircle,
  Text,
  Tooltip,
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

import { getStorageUrl } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function HeaderApp() {
  const { fullName, isLoading, currentUser } = useAuthentication();

  const location = useLocation();

  const { pathname } = location;

  const TITLE_ROUTES = {
    [APP_PATHS.HOME]: 'Trang chủ',
    [APP_PATHS.listUsers]: 'Người dùng',
    [APP_PATHS.listProducts]: 'Sản phẩm',
  } as const;

  const title = TITLE_ROUTES[pathname];

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
        <HStack spacing={4} as={Link} to="/profile">
          <SkeletonCircle size="11" rounded="full" isLoaded={!isLoading}>
            <Tooltip label="Đi đến trang cá nhân">
              <Avatar
                name={fullName}
                src={getStorageUrl(currentUser?.avatar as string, 'image')}
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
                  <Text color="white">Tài khoản bách gia phát</Text>
                  <Text color="#a4a8ac">{fullName}</Text>
                  <Text color="#a4a8ac">{currentUser?.phone}</Text>
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
        </HStack>
      </HStack>
    </HStack>
  );
}
