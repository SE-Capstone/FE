import { Icon } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IRole } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { defaultRoles } from '@/configs';
import { useAlertDialogStore } from '@/contexts';

interface ActionMenuTableRolesProps {
  role: IRole;
}
export function ActionMenuTableRoles({ role }: ActionMenuTableRolesProps) {
  const isDefaultRole = defaultRoles.includes(role?.name || '');
  const navigate = useNavigate();

  // const { removeRoleResult, handleRemoveRole } = useRemoveRoleHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removeRoleResult.loading);

  if (!role || !role.id) return null;

  const menuOptions = [
    {
      label: 'View detail',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/roles/${role.id}`),
    },
    !isDefaultRole && {
      label: 'Delete',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Delete',
          description: `Are you sure to delete role "${role.name}"?`,
          onHandleConfirm() {
            // TODO
            // if (!role.id) return;
            // handleRemoveRole(role.id, closeAlert);
          },
        });
      },
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
