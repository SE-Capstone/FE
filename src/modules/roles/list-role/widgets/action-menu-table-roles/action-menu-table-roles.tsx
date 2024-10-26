import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IRole } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableRolesProps {
  role: IRole;
}
export function ActionMenuTableRoles({ role }: ActionMenuTableRolesProps) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const navigate = useNavigate();

  // const { removeRoleResult, handleRemoveRole } = useRemoveRoleHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removeRoleResult.loading);

  if (!role || !role.id) return null;

  const menuOptions = [
    permissions[PermissionEnum.GET_ROLE] && {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/roles/${role.id}`),
    },
    // Todo: fix
    permissions[PermissionEnum.ADD_ROLE] && {
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: t('common.delete'),
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
