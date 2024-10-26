import { useEffect, useState } from 'react';

import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdVisibility } from 'react-icons/md';
import { SlUserFollowing, SlUserUnfollow } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';

import { useToggleUserStatusMutation } from '../../apis/toggle-user-status.api';

import type { IUser } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum, UserStatusEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableUsersProps {
  user: IUser;
}

export function ActionMenuTableUsers({ user }: ActionMenuTableUsersProps) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending: isLoading } = useToggleUserStatusMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (!user || !user.id) return null;

  const menuOptions = [
    // Todo: fix
    permissions[PermissionEnum.GET_LIST_USER] && {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/users/${user.id}`),
    },
    {
      label: user.status === UserStatusEnum.Active ? t('actions.inactive') : t('actions.active'),
      icon: (
        <Icon
          as={user.status === UserStatusEnum.Active ? SlUserUnfollow : SlUserFollowing}
          boxSize={5}
        />
      ),
      onClick: () => {
        openAlert({
          title:
            user.status === UserStatusEnum.Active
              ? `${t('actions.inactive')} ${t('common.user').toLowerCase()}`
              : `${t('actions.active')} ${t('common.user').toLowerCase()}`,
          type: 'warning',
          textConfirm:
            user.status === UserStatusEnum.Active ? t('actions.inactive') : t('actions.active'),
          description:
            user.status === UserStatusEnum.Active
              ? t('actions.disableUser')
              : t('actions.enableUser'),
          onHandleConfirm() {
            if (!user.id) return;
            mutate({
              body: { userId: user.id },
            });
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
