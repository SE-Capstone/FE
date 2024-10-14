import { useEffect, useState } from 'react';

import { Icon } from '@chakra-ui/react';
import { MdOutlineToggleOff, MdOutlineToggleOn, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useToggleVisibleProjectMutation } from '../../apis/toggle-visible-project.api';

import type { IProject } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableProjectsProps {
  project: IProject;
}
export function ActionMenuTableProjects({ project }: ActionMenuTableProjectsProps) {
  const { permissions } = useAuthentication();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending: isLoading } = useToggleVisibleProjectMutation({
    closeAlert,
  });

  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading]);

  if (!project || !project.id) return null;

  const menuOptions = [
    permissions[PermissionEnum.GET_DETAIL_PROJECT] && {
      label: 'View detail',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/projects/${project.id}`),
    },
    permissions[PermissionEnum.TOGGLE_VISIBLE_PROJECT] && {
      label: project.isVisible ? 'Toggle invisible' : 'Toggle visible',
      icon: <Icon as={project.isVisible ? MdOutlineToggleOff : MdOutlineToggleOn} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Archive project?',
          type: 'warning',
          textConfirm: 'Archive',
          description: `Are you sure to change project to "${
            project.isVisible ? 'Invisible' : 'Visible'
          }"?`,
          onHandleConfirm() {
            if (!project.id) return;
            mutate(project.id);
          },
        });
      },
    },
  ].filter(Boolean);

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} isDotVertical />}
    </ActionMenuTable>
  );
}
