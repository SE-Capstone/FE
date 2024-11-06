import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useRemoveIssueHook } from '../../hooks/mutations/use-remove-issue.hooks';

import type { IIssue } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';

interface ActionMenuTableIssuesProps {
  issue: IIssue;
}

export function ActionMenuTableIssues({ issue }: ActionMenuTableIssuesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { handleRemoveIssue } = useRemoveIssueHook(issue.id);

  if (!issue || !issue.id) return null;

  const menuOptions = [
    {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`issues/${issue.id}`),
    },
    {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => navigate(`issues/${issue.id}/edit`),
    },
    {
      type: 'danger',
      label: t('actions.delete'),
      icon: <Icon as={BiTrash} boxSize={5} />,
      onClick: () => handleRemoveIssue(issue),
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} />}
    </ActionMenuTable>
  );
}
