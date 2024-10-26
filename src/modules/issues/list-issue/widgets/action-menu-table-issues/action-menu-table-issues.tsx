import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import type { IIssue } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableIssuesProps {
  issue: IIssue;
}

export function ActionMenuTableIssues({ issue }: ActionMenuTableIssuesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!issue || !issue.id) return null;

  const menuOptions = [
    {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/issues/${issue.id}`),
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
