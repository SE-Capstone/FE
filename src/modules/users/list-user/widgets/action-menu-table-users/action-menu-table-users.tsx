import { Icon } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IUser } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableUsersProps {
  user: IUser;
}
export function ActionMenuTableUsers({ user }: ActionMenuTableUsersProps) {
  const { permissions } = useAuthentication();
  const navigate = useNavigate();

  // const { removeUserResult, handleRemoveUser } = useRemoveUserHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removeUserResult.loading);

  if (!user || !user.id) return null;

  const menuOptions = [
    // Todo: fix
    permissions[PermissionEnum.GET_LIST_USER] && {
      label: 'View detail',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/users/${user.id}`),
    },
    // Todo: fix
    permissions[PermissionEnum.GET_LIST_USER] && {
      label: 'Delete',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Delete',
          description: `Are you sure to delete user "${user.fullName}"?`,
          onHandleConfirm() {
            // TODO
            // if (!user.id) return;
            // handleRemoveUser(user.id, closeAlert);
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
