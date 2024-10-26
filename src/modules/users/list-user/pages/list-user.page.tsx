import { useMemo } from 'react';

import { Container } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { BadgeRole } from '../../detail-user/components';
import { BadgeStatus } from '../../detail-user/components/badge-status';
import { useUsersQueryFilterStateContext } from '../contexts';
import { useGetListUserQuery } from '../hooks/queries';
import { ActionMenuTableUsers, ActionTableUsersWidget } from '../widgets';

import type { IUser } from '../types';
import type { ColumnsProps } from '@/components/elements';
import type { RolesEnum } from '@/configs';

import { CustomLink, Head, TableComponent } from '@/components/elements';
import { GENDER_VALUES } from '@/configs';
import { getNumericalOrder } from '@/libs/helpers';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListUserPage() {
  const { t } = useTranslation();
  const { usersQueryState } = useUsersQueryFilterStateContext();
  const { pathname } = useLocation();

  const { listUser, meta, isError, isLoading, handlePaginate } = useGetListUserQuery({
    params: usersQueryState.filters,
  });

  const columns = useMemo<ColumnsProps<IUser>>(
    () => [
      {
        header: 'User',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return (
                <>
                  {getNumericalOrder({
                    page: meta.pageIndex,
                    perPage: meta.pageSize,
                    index,
                  })}
                </>
              );
            },
          },
          // {
          //   key: 'avatar',
          //   title: 'Avatar',
          //   hasSort: false,
          //   Cell({ avatar, fullName }) {
          //     return avatar ? (
          //       <Avatar
          //         src={avatar}
          //         name={fullName || ''}
          //         boxSize={16}
          //         rounded="full"
          //         showBorder
          //         borderColor="gray.200"
          //         borderWidth="1px"
          //       />
          //     ) : (
          //       <>No image</>
          //     );
          //   },
          // },
          {
            key: 'fullName',
            title: t('fields.fullName'),
            hasSort: false,
            Cell({ fullName, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listUser) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {fullName || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'aliasName',
            title: t('fields.aliasName'),
            hasSort: false,
            Cell({ userName }) {
              return <>{userName || ''}</>;
            },
          },
          {
            key: 'email',
            title: t('fields.email'),
            hasSort: false,
            Cell({ email, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listUser) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {email}
                </CustomLink>
              );
            },
          },
          {
            key: 'gender',
            title: t('fields.gender'),
            hasSort: false,
            Cell({ gender }) {
              return <>{gender ? GENDER_VALUES(t)[gender] || 'N/A' : ''}</>;
            },
          },
          {
            key: 'phone',
            title: t('fields.phone'),
            hasSort: false,
          },
          {
            key: 'role',
            title: t('fields.role'),
            hasSort: false,
            Cell({ roleName }) {
              return <BadgeRole role={roleName as unknown as RolesEnum} />;
            },
          },
          {
            key: 'status',
            title: t('fields.status'),
            hasSort: false,
            Cell({ status }) {
              return <BadgeStatus status={status} />;
            },
          },
        ],
      },
    ],
    [meta.pageIndex, meta.pageSize, pathname, t]
  );

  return (
    <>
      <Head title="Users" />
      <Container maxW="container.2xl" centerContent>
        <ActionTableUsersWidget />
        <TableComponent
          currentPage={meta.pageIndex}
          perPage={meta.pageSize}
          data={listUser}
          groupColumns={columns}
          totalCount={meta.totalCount}
          isLoading={isLoading}
          isError={!!isError}
          additionalFeature={(user) => <ActionMenuTableUsers user={user} />}
          onPageChange={handlePaginate}
        />
      </Container>
    </>
  );
}
