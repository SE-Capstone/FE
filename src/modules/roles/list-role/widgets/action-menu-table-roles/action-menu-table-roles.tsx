import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useRemoveRoleHook } from '../../hooks/mutations/use-remove-role.hooks';

import type { IRole } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableRolesProps {
  role: IRole;
}
export function ActionMenuTableRoles({ role }: ActionMenuTableRolesProps) {
  const { t } = useTranslation();
  const { permissions, currentUser } = useAuthentication();
  const navigate = useNavigate();

  const { handleRemoveRole } = useRemoveRoleHook();
  const canDelete =
    permissions[PermissionEnum.DELETE_ROLE] &&
    role?.name !== 'ADMIN' &&
    role?.name !== currentUser?.roleName;

  if (!role || !role.id) return null;

  const menuOptions = [
    permissions[PermissionEnum.READ_LIST_ROLE] && {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/roles/${role.id}`),
    },
    canDelete && {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemoveRole(role),
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
