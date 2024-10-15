import { Icon, useDisclosure } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveLabelHook } from '../../hooks/mutations/use-remove-label.hooks';
import { RemoveLabelWidget } from '../remove-label.widget';
import { UpsertLabelWidget } from '../upsert-label.widget';

import type { ILabel } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableLabelsProps {
  label: ILabel;
  listLabel: ILabel[];
}

export function ActionMenuTableLabels({ label, listLabel }: ActionMenuTableLabelsProps) {
  const disclosureModal = useDisclosure();
  const disclosureModalRemoveLabel = useDisclosure();
  const { handleRemoveLabel } = useRemoveLabelHook();

  if (!label || !label.id) return null;

  const menuOptions = [
    {
      label: 'Update',
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!label.id) return;

        disclosureModal.onOpen();
      },
    },
    {
      label: 'Delete',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        if (label.issueCount === 0) {
          return handleRemoveLabel(label);
        }

        disclosureModalRemoveLabel.onOpen();
        return undefined;
      },
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertLabelWidget
        label={label}
        isUpdate
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <RemoveLabelWidget
        listLabel={listLabel}
        label={label}
        isOpen={disclosureModalRemoveLabel.isOpen}
        onClose={disclosureModalRemoveLabel.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
