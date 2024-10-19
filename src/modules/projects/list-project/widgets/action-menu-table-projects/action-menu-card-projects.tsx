import { useEffect, useState } from 'react';

import { Icon } from '@chakra-ui/react';
import { HiArchiveBox, HiArchiveBoxXMark } from 'react-icons/hi2';
import { MdVisibility } from 'react-icons/md';
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
      label: project.isVisible ? 'Archive' : 'Unarchive',
      icon: <Icon as={project.isVisible ? HiArchiveBox : HiArchiveBoxXMark} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: project.isVisible ? 'Unarchive project?' : 'Archive project?',
          type: 'warning',
          textConfirm: 'Archive',
          description: project.isVisible
            ? 'This project will be invisible to all members'
            : 'This project will be visible to all members',
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
