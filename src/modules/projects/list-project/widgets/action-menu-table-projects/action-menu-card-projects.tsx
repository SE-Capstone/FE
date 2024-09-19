import { useEffect, useState } from 'react';

import { Icon } from '@chakra-ui/react';
import { MdOutlineToggleOff, MdOutlineToggleOn, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useToggleVisibleProjectMutation } from '../../apis/toggle-visible-project.api';

import type { IProject } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { useAlertDialogStore } from '@/contexts';

interface ActionMenuTableProjectsProps {
  project: IProject;
}
export function ActionMenuTableProjects({ project }: ActionMenuTableProjectsProps) {
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
    {
      label: 'View detail',
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/projects/${project.id}`),
    },
    {
      label: project.isVisible ? 'Toggle invisible' : 'Toggle visible',
      icon: <Icon as={project.isVisible ? MdOutlineToggleOff : MdOutlineToggleOn} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: 'Update',
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
  ];

  return (
    <ActionMenuTable actionMenuItems={menuOptions}>
      {({ isOpen }) => <AdditionalFeature isOpen={isOpen} isDotVertical />}
    </ActionMenuTable>
  );
}
