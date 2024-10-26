import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveStatusHook } from '../../hooks/mutations/use-remove-status.hooks';
import { RemoveStatusWidget } from '../remove-status.widget';
import { UpsertStatusWidget } from '../upsert-status.widget';

import type { IStatus } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableStatusesProps {
  status: IStatus;
  listStatus: IStatus[];
  isDefault?: boolean;
}

export function ActionMenuTableStatuses({
  status,
  listStatus,
  isDefault,
}: ActionMenuTableStatusesProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const disclosureModalRemoveStatus = useDisclosure();
  const { handleRemoveStatus } = useRemoveStatusHook(isDefault);

  if (!status || !status.id) return null;

  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!status.id) return;

        disclosureModal.onOpen();
      },
    },
    {
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        if (status.issueCount === 0 || isDefault) {
          return handleRemoveStatus(status);
        }

        disclosureModalRemoveStatus.onOpen();
        return undefined;
      },
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertStatusWidget
        status={status}
        isUpdate
        isDefault={isDefault}
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <RemoveStatusWidget
        listStatus={listStatus}
        status={status}
        isDefault={isDefault}
        isOpen={disclosureModalRemoveStatus.isOpen}
        onClose={disclosureModalRemoveStatus.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
