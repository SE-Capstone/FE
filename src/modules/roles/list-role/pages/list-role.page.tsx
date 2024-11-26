import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

import { useRolesQueryFilterStateContext } from '../contexts';
import { useGetListRoleQuery } from '../hooks/queries';
import { ActionMenuTableRoles } from '../widgets';
import { ActionTableRolesWidget } from '../widgets/action-table-roles.widget';

import type { IRole } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, StateHandler, TableComponent } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { BadgeIssue as BagdeRole } from '@/modules/issues/list-issue/components';
import { useAuthentication } from '@/modules/profile/hooks';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListRolePage() {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { rolesQueryState, resetRolesQueryState } = useRolesQueryFilterStateContext();
  const { permissions } = useAuthentication();
  const { listRole, isError, isLoading } = useGetListRoleQuery({
    params: rolesQueryState.filters,
  });

  const columns = useMemo<ColumnsProps<IRole>>(
    () => [
      {
        header: 'Role',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: '#',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return <>{index + 1}</>;
            },
          },
          {
            key: 'name',
            title: t('fields.name'),
            hasSort: false,
            Cell({ name, color, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listRole) ? String(id) : '#'}
                  noOfLines={1}
                >
                  <BagdeRole content={name} colorScheme={color} />
                </CustomLink>
              );
            },
          },
          {
            key: 'description',
            title: t('fields.description'),
            hasSort: false,
            tableCellProps: {
              w: '100%',
            },
            Cell({ description }) {
              return (
                <Text noOfLines={2} whiteSpace="normal">
                  {description || ''}
                </Text>
              );
            },
          },
          {
            key: 'permission',
            title: t('fields.permission'),
            hasSort: false,
            Cell({ permissions }) {
              return <>{permissions.length || 0}</>;
            },
          },
        ],
      },
    ],
    [pathname, t]
  );

  return (
    <>
      <Head title="Roles" />
      <Container maxW="container.2xl" centerContent>
        <StateHandler
          showLoader={isLoading}
          showError={!!isError}
          retryHandler={resetRolesQueryState}
        >
          <ActionTableRolesWidget />
          <TableComponent
            withoutPagination
            data={listRole}
            groupColumns={columns}
            isLoading={isLoading}
            isError={!!isError}
            additionalFeature={(role) =>
              permissions[PermissionEnum.READ_LIST_ROLE] ||
              permissions[PermissionEnum.DELETE_ROLE] ? (
                <ActionMenuTableRoles role={role} />
              ) : undefined
            }
          />
        </StateHandler>
      </Container>
    </>
  );
}
