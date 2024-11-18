import { Icon } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { BiTrash } from 'react-icons/bi';
import { MdOutlineSystemUpdateAlt, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useRemoveIssueHook } from '../../hooks/mutations/use-remove-issue.hooks';

import type { IIssue } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableIssuesProps {
  issue: IIssue;
}

export function ActionMenuTableIssues({ issue }: ActionMenuTableIssuesProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { currentUser } = useAuthentication();
  const { permissions } = useProjectContext();
  const { handleRemoveIssue } = useRemoveIssueHook(issue.id);
  const canUpdate =
    currentUser?.id === issue.assignee?.id ||
    permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);
  if (!issue || !issue.id) return null;

  const menuOptions = [
    {
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`issues/${issue.id}`),
    },
    canUpdate && {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => navigate(`issues/${issue.id}/edit`),
    },
    canUpdate && {
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
