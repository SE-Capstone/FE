import { useEffect, useState } from 'react';

import { Icon, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { HiArchiveBox, HiArchiveBoxXMark } from 'react-icons/hi2';
import { MdOutlineSystemUpdateAlt, MdVisibility } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

import { useToggleVisibleProjectMutation } from '../../apis/toggle-visible-project.api';
import { UpsertProjectWidget } from '../upsert-project.widget';

import type { IProject } from '../../types';

import { ActionMenuTable, AdditionalFeature } from '@/components/elements';
import { PermissionEnum } from '@/configs';
import { useAlertDialogStore } from '@/contexts';
import { useAuthentication } from '@/modules/profile/hooks';

interface ActionMenuTableProjectsProps {
  project: IProject;
}

export function ActionMenuTableProjects({ project }: ActionMenuTableProjectsProps) {
  const { t } = useTranslation();
  const { permissions } = useAuthentication();
  const disclosureModal = useDisclosure();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const canUpdate = permissions[PermissionEnum.UPDATE_PROJECT];

  const canToggle = permissions[PermissionEnum.TOGGLE_VISIBLE_PROJECT];

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
      label: t('actions.viewDetail'),
      icon: <Icon as={MdVisibility} boxSize={5} />,
      onClick: () => navigate(`/projects/${project.id}`),
    },
    canUpdate && {
      label: t('actions.edit'),
      icon: <Icon as={MdOutlineSystemUpdateAlt} boxSize={5} />,
      onClick: () => {
        if (!project.id) return;

        disclosureModal.onOpen();
      },
    },
    canToggle && {
      type: project.isVisible ? 'warning' : 'danger',
      label: project.isVisible ? t('actions.archive') : t('actions.unarchive'),
      icon: <Icon as={project.isVisible ? HiArchiveBox : HiArchiveBoxXMark} boxSize={5} />,
      onClick: () => {
        openAlert({
          title: project.isVisible
            ? `${t('actions.archive')} ${t('common.project').toLowerCase()}`
            : `${t('actions.unarchive')} ${t('common.project').toLowerCase()}`,
          type: project.isVisible ? 'warning' : 'error',
          textConfirm: project.isVisible ? t('actions.archive') : t('actions.unarchive'),
          description: project.isVisible
            ? t('actions.archiveProject')
            : t('actions.unarchiveProject'),
          onHandleConfirm() {
            if (!project.id) return;
            mutate(project.id);
          },
        });
      },
    },
  ].filter(Boolean);

  return (
    <>
      <UpsertProjectWidget
        project={project}
        isUpdate
        isOpen={disclosureModal.isOpen}
        onClose={disclosureModal.onClose}
      />
      <ActionMenuTable actionMenuItems={menuOptions}>
        {({ isOpen }) => <AdditionalFeature isOpen={isOpen} isDotVertical />}
      </ActionMenuTable>
    </>
  );
}
