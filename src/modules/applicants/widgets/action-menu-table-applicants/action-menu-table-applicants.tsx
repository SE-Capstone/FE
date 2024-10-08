import { Icon } from '@chakra-ui/react';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IApplicant } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableApplicantsProps {
  applicant: IApplicant;
}

export function ActionMenuTableApplicants({ applicant }: ActionMenuTableApplicantsProps) {
  const navigate = useNavigate();

  if (!applicant || !applicant.id) return null;

  const menuOptions = [
    {
      label: 'View detail',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/applicants/${applicant.id}`),
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
