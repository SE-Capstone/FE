import { useMemo } from 'react';

import { Container, Text } from '@chakra-ui/react';
import { useLocation } from 'react-router-dom';

import { useGetListRoleQuery } from '../hooks/queries';
import { ActionMenuTableRoles } from '../widgets';
import { ActionTableRolesWidget } from '../widgets/action-table-roles.widget';

import type { IRole } from '../types';
import type { ColumnsProps } from '@/components/elements';

import { CustomLink, Head, TableComponent } from '@/components/elements';
import { APP_PATHS } from '@/routes/paths/app.paths';

export function ListRolesPage() {
  const { pathname } = useLocation();

  const { listRole, isError, isLoading } = useGetListRoleQuery({});

  const columns = useMemo<ColumnsProps<IRole>>(
    () => [
      {
        header: 'Role',
        columns: [
          {
            key: 'id',
            hasSort: false,
            title: 'STT',
            tableCellProps: { w: 4, pr: 2 },
            Cell(_, index) {
              return <>{index + 1}</>;
            },
          },
          {
            key: 'name',
            title: 'Name',
            hasSort: false,
            Cell({ name, id }) {
              return (
                <CustomLink
                  to={pathname.includes(APP_PATHS.listRoles) ? String(id) : '#'}
                  noOfLines={1}
                >
                  {name || ''}
                </CustomLink>
              );
            },
          },
          {
            key: 'description',
            title: 'Description',
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
            title: 'Permissions',
            hasSort: false,
            Cell({ permissions }) {
              return <>{permissions.length || 0}</>;
            },
          },
        ],
      },
    ],
    [pathname]
  );

  return (
    <>
      <Head title="Roles" />
      <Container maxW="container.2xl" centerContent>
        <ActionTableRolesWidget />
        <TableComponent
          data={listRole}
          groupColumns={columns}
          isLoading={isLoading}
          isError={!!isError}
          additionalFeature={(role) => <ActionMenuTableRoles role={role} />}
        />
      </Container>
    </>
  );
}
