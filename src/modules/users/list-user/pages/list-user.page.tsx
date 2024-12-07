import { useMemo } from 'react';

import { Avatar } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { BadgeStatus } from '../../detail-user/components/badge-status';
import { useUsersQueryFilterStateContext } from '../contexts';
import { useGetListUserQuery } from '../hooks/queries';
import { ActionMenuTableUsers, ActionTableUsersWidget } from '../widgets';

import type { IUser } from '../types';
import type { ColumnsProps } from '@/components/elements';
import type { RolesEnum } from '@/configs';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { GENDER_VALUES, PermissionEnum } from '@/configs';
import { getNumericalOrder } from '@/libs/helpers';
import { Error403Page } from '@/modules/errors';
import { BadgeIssue } from '@/modules/issues/list-issue/components';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListUserPage() {
  const { t } = useTranslation();
  const { usersQueryState, resetUsersQueryState } = useUsersQueryFilterStateContext();
  const { pathname } = useLocation();
  const { permissions } = useAuthentication();

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
          //   Cell({ avatar, userName }) {
          //     return (
          //       <Avatar
          //         src={avatar}
          //         name={userName || ''}
          //         // boxSize={16}
          //         size="sm"
          //         rounded="full"
          //         showBorder
          //         borderColor="gray.200"
          //         borderWidth="1px"
          //       />
          //     );
          //   },
          // },
          {
            key: 'fullName',
            title: t('fields.fullName'),
            hasSort: false,
            Cell({ fullName, avatar, userName, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listUser) ? String(id) : '#'}
                  noOfLines={1}
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Avatar
                    src={avatar}
                    name={userName || ''}
                    // boxSize={16}
                    size="sm"
                    rounded="full"
                    showBorder
                    borderColor="gray.200"
                    borderWidth="1px"
                  />
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
            Cell({ roleName, roleColor }) {
              return roleName && roleColor ? (
                <BadgeIssue content={roleName as unknown as RolesEnum} colorScheme={roleColor} />
              ) : (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                <></>
              );
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

  if (!permissions[PermissionEnum.GET_LIST_USER]) {
    return <Error403Page />;
  }

  return (
    <>
      <Head title="Users" />
      <StateHandler
        showLoader={isLoading}
        showError={!!isError}
        retryHandler={resetUsersQueryState}
      >
        <ActionTableUsersWidget />
        <TableComponent
          currentPage={meta.pageIndex}
          perPage={meta.pageSize}
          data={listUser}
          groupColumns={columns}
          totalCount={meta.totalCount}
          isLoading={isLoading}
          isError={!!isError}
          showChangeEntries
          additionalFeature={(user) =>
            permissions[PermissionEnum.TOGGLE_USER] ||
            permissions[PermissionEnum.GET_DETAIL_USER] ? (
              <ActionMenuTableUsers user={user} />
            ) : undefined
          }
          onPageChange={handlePaginate}
        />
      </StateHandler>
    </>
  );
}
