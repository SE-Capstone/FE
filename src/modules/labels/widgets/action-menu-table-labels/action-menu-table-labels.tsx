import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';
import { useLocation } from 'react-router-dom';

import { useRemoveLabelHook } from '../../hooks/mutations/use-remove-label.hooks';
import { RemoveLabelWidget } from '../remove-label.widget';
import { UpsertLabelWidget } from '../upsert-label.widget';

import type { ILabel } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableLabelsProps {
  label: ILabel;
  listLabel: ILabel[];
  isDefault?: boolean;
}

export function ActionMenuTableLabels({ label, listLabel, isDefault }: ActionMenuTableLabelsProps) {
  const { t } = useTranslation();
  const { pathname } = useLocation();
  const { permissions } = useAuthentication();
  const disclosureModal = useDisclosure();
  const disclosureModalRemoveLabel = useDisclosure();
  const { handleRemoveLabel } = useRemoveLabelHook(isDefault);

  const canUpdate =
    (permissions[PermissionEnum.UPDATE_LABEL] && pathname.includes('projects')) ||
    (isDefault &&
      permissions[PermissionEnum.UPDATE_DEFAULT_LABEL] &&
      pathname.includes('settings'));
  const canDelete =
    (permissions[PermissionEnum.DELETE_LABEL] && pathname.includes('projects')) ||
    (isDefault &&
      permissions[PermissionEnum.DELETE_DEFAULT_LABEL] &&
      pathname.includes('settings'));

  if (!label || !label.id) return null;

  const menuOptions = [
    canUpdate && {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!label.id) return;

        disclosureModal.onOpen();
      },
    },
    canDelete && {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () =>
        // if (label.issueCount === 0 || isDefault) {
        handleRemoveLabel(label),
      // }

      // disclosureModalRemoveLabel.onOpen();
      // return undefined;
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertLabelWidget
        label={label}
        isUpdate
        isOpen={disclosureModal.isOpen}
        isDefault={isDefault}
        onClose={disclosureModal.onClose}
      />
      <RemoveLabelWidget
        listLabel={listLabel}
        label={label}
        isDefault={isDefault}
        isOpen={disclosureModalRemoveLabel.isOpen}
        onClose={disclosureModalRemoveLabel.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
