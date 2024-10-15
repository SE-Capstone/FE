import { Icon, useDisclosure } from '@chakra-ui/react';
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
}

export function ActionMenuTableStatuses({ status, listStatus }: ActionMenuTableStatusesProps) {
  const disclosureModal = useDisclosure();
  const disclosureModalRemoveStatus = useDisclosure();
  const { handleRemoveStatus } = useRemoveStatusHook();

  if (!status || !status.id) return null;

  const menuOptions = [
    {
      label: 'Update',
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!status.id) return;

        disclosureModal.onOpen();
      },
    },
    {
      label: 'Delete',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        if (status.issueCount === 0) {
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
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <RemoveStatusWidget
        listStatus={listStatus}
        status={status}
        isOpen={disclosureModalRemoveStatus.isOpen}
        onClose={disclosureModalRemoveStatus.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
