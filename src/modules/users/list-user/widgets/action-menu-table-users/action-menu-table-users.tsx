import { Icon } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IUser } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';

interface ActionMenuTableUsersProps {
  user: IUser;
}
export function ActionMenuTableUsers({ user }: ActionMenuTableUsersProps) {
  const navigate = useNavigate();

  // const { removeUserResult, handleRemoveUser } = useRemoveUserHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removeUserResult.loading);

  if (!user || !user.id) return null;

  const menuOptions = [
    {
      label: 'Xem chi tiết',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/users/${user.id}`),
    },
    {
      label: 'Xoá',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Xoá người dùng',
          description: `Bạn có chắc chắn muốn xoá người dùng "${user.fullName}"?`,
          onHandleConfirm() {
            // TODO
            // if (!user.id) return;
            // handleRemoveUser(user.id, closeAlert);
          },
        });
      },
    },
  ];

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
