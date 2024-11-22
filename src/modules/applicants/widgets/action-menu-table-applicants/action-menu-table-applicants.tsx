import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt } from 'react-icons/md';

import { useRemoveApplicantHook } from '../../hooks/mutations/use-remove-applicant.hooks';

import type { IApplicant } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableApplicantsProps {
  applicant: IApplicant;
}

export function ActionMenuTableApplicants({ applicant }: ActionMenuTableApplicantsProps) {
  const { t } = useTranslation();
  const { handleRemoveApplicant } = useRemoveApplicantHook(applicant.id);

  if (!applicant || !applicant.id) return null;

  // Todo: permissions
  const menuOptions = [
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {},
    },
    {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemoveApplicant(applicant),
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
