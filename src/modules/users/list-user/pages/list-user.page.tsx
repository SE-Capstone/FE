import { useMemo } from 'react';

import { Avatar, Container } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { BadgeRole } from '../../detail-user/components';
import { useUsersQueryFilterStateContext } from '../contexts';
import { useGetListUserQuery } from '../hooks/queries';
import { ActionMenuTableUsers, ActionTableUsersWidget } from '../widgets';

import type { IUser } from '../types';
import type { ColumnsProps } from '@/components/elements';
import type { RolesEnum } from '@/configs';

import { CustomLink, Head, TableComponent } from '@/components/elements';
import { GENDER_VALUES } from '@/configs';
import { getNumericalOrder, getStorageUrl } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListUsersPage() {
  const { isAdmin } = useAuthentication();
  const { usersQueryState } = useUsersQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listUser, meta, isError, isLoading, handlePaginate } = useGetListUserQuery({});

  const columns = useMemo<ColumnsProps<IUser>>(
    () => [
      {
        header: 'User',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: 'STT',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return (
                <>
                  {getNumericalOrder({
                    page: meta?.currentPage,
                    perPage: meta?.perPage,
                    index,
                  })}
                </>
              );
            },
          },
          {
            key: 'avatar',
            title: 'Avatar',
            hasSort: false,
            Cell({ avatar, fullName }) {
              return avatar ? (
                <Avatar
                  src={getStorageUrl(avatar)}
                  name={fullName || ''}
                  boxSize={16}
                  rounded="full"
                  showBorder
                  borderColor="gray.200"
                  borderWidth="1px"
                />
              ) : (
                <>Chưa có ảnh</>
              );
            },
          },
          {
            key: 'fullName',
            title: 'Full name',
            hasSort: false,
            Cell({ fullName, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listUsers) ? String(id) : '#'}
                  noOfLines={1}
                  onClick={(e) => {
                    !isAdmin && e.preventDefault();
                  }}
                >
                  {fullName || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'email',
            title: 'Email',
            hasSort: false,
            Cell({ email, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listUsers) ? String(id) : '#'}
                  noOfLines={1}
                  onClick={(e) => {
                    !isAdmin && e.preventDefault();
                  }}
                >
                  {email}
                </CustomLink>
              );
            },
          },
          {
            key: 'gender',
            title: 'Gender',
            hasSort: false,
            Cell({ gender }) {
              return <>{gender ? GENDER_VALUES[gender] || 'N/A' : ''}</>;
            },
          },
          {
            key: 'phone',
            title: 'Phone',
            hasSort: false,
          },
          {
            key: 'role',
            title: 'Role',
            hasSort: false,
            Cell({ roleName }) {
              return <BadgeRole role={roleName as unknown as RolesEnum} />;
            },
          },
        ],
      },
    ],
    [isAdmin, meta?.currentPage, meta?.perPage, pathname]
  );

  return (
    <>
      <Head title="Danh sách người dùng" />
      <Container maxW="container.2xl" centerContent>
        <ActionTableUsersWidget />
        <TableComponent
          currentPage={meta?.currentPage}
          perPage={meta?.perPage}
          data={listUser}
          groupColumns={columns}
          totalCount={meta.total}
          isLoading={isLoading}
          isError={!!isError}
          additionalFeature={(user) => <ActionMenuTableUsers user={user} />}
          onPageChange={handlePaginate}
        />
      </Container>
    </>
  );
}
