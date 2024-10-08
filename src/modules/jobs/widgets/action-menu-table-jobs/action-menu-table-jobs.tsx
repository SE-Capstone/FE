import { Icon } from '@chakra-ui/react';
import { BiTrash } from 'react-icons/bi';

import type { IJob } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';

interface ActionMenuTableJobsProps {
  job: IJob;
}
export function ActionMenuTableJobs({ job }: ActionMenuTableJobsProps) {
  // const { removeJobResult, handleRemoveJob } = useRemoveJobHook();

  const { openAlert } = useAlertDialogStore(false);
  // const { openAlert, closeAlert } = useAlertDialogStore(removeJobResult.loading);

  if (!job || !job.id) return null;

  const menuOptions = [
    {
      label: 'Delete',
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Delete',
          description: `Are you sure to delete job "${job.title}"?`,
          onHandleConfirm() {
            // TODO
            // if (!job.id) return;
            // handleRemoveJob(job.id, closeAlert);
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
