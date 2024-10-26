import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';

import type { IPosition } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';

interface ActionMenuTablePositionsProps {
  position: IPosition;
}
export function ActionMenuTablePositions({ position }: ActionMenuTablePositionsProps) {
  const { t } = useTranslation();
  // const { removePositionResult, handleRemovePosition } = useRemovePositionHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removePositionResult.loading);

  if (!position || !position.id) return null;

  const menuOptions = [
    {
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: t('actions.delete'),
          description: `${t('actions.confirmDelete')} ${t('common.position').toLowerCase()} "${
            position.name
          }"?`,
          onHandleConfirm() {
            // TODO
            // if (!position.id) return;
            // handleRemovePosition(position.id, closeAlert);
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
