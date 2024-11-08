import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemovePositionHook } from '../../hooks/mutations/use-remove-position.hooks';
import { UpsertPositionWidget } from '../upsert-position.widget';

import type { IPosition } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTablePositionsProps {
  position: IPosition;
}
export function ActionMenuTablePositions({ position }: ActionMenuTablePositionsProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { handleRemovePosition } = useRemovePositionHook();

  if (!position || !position.id) return null;

  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!position.id) return;

        disclosureModal.onOpen();
      },
    },
    {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemovePosition(position),
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertPositionWidget
        position={position}
        isUpdate
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
      </ActionMenuTable>
    </>
  );
}
