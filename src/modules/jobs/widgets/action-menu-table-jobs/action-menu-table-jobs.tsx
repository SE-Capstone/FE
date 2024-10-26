import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveJobHook } from '../../hooks/mutations/use-remove-job.hooks';
import { UpsertJobWidget } from '../upsert-job.widget';

import type { IJob } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableJobsProps {
  job: IJob;
}
export function ActionMenuTableJobs({ job }: ActionMenuTableJobsProps) {
  const { t } = useTranslation();
  const disclosureModal = useDisclosure();
  const { handleRemoveJob } = useRemoveJobHook();

  if (!job || !job.id) return null;

  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!job.id) return;

        disclosureModal.onOpen();
      },
    },
    {
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemoveJob(job),
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertJobWidget
        job={job}
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
