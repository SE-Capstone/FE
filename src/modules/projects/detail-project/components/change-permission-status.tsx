import { useEffect, useState } from 'react';

import { Switch, Tooltip } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { useUpdateMemberPermissionMutation } from '../apis/update-member-permission';

import type { ProjectMember } from '../../list-project/types';
import type { SwitchProps } from '@chakra-ui/react';

import { useAlertDialogStore } from '@/contexts';

interface ChangeStatusProps extends SwitchProps {
  projectId: string;
  initStatus: boolean;
  isLoading?: boolean;
  member: ProjectMember;
  title: string;
  description: string;
  field: 'isProjectConfigurator' | 'isIssueConfigurator' | 'isCommentConfigurator';
}

export function ChangePermissionStatus(props: ChangeStatusProps) {
  const { initStatus, isLoading, title, description, projectId, member, field, ...rest } = props;
  const { t } = useTranslation();
  const [isInactive, setIsInactive] = useState(initStatus === false);
  const [loading, setLoading] = useState(false);

  const { openAlert, closeAlert } = useAlertDialogStore(loading);
  const { mutate, isPending: isLoadingUpdate } = useUpdateMemberPermissionMutation({
    closeAlert,
    projectId,
    memberId: member.id,
  });

  useEffect(() => {
    setLoading(isLoadingUpdate);
  }, [isLoadingUpdate]);

  function handleChangeSwitch() {
    openAlert({
      title,
      description,
      type: 'warning',
      onHandleConfirm() {
        try {
          mutate({
            body: {
              isProjectConfigurator:
                field === 'isProjectConfigurator'
                  ? !initStatus
                  : member.isProjectConfigurator || false,
              isIssueConfigurator:
                field === 'isIssueConfigurator' ? !initStatus : member.isIssueConfigurator || false,
              isCommentConfigurator:
                field === 'isCommentConfigurator'
                  ? !initStatus
                  : member.isCommentConfigurator || false,
            },
          });
          setIsInactive((prev) => !prev);
        } catch (error) {
          setIsInactive((prev) => !prev);
        }
      },
    });
  }

  return (
    <Tooltip
      label={
        member.isConfigurator
          ? t('actions.memberConfigurator')
          : isInactive
          ? t('actions.active')
          : t('actions.inactive')
      }
      hasArrow
      placement="top"
      shouldWrapChildren
    >
      <Switch
        size="md"
        isDisabled={isLoading || isLoadingUpdate}
        isChecked={!isInactive}
        onChange={handleChangeSwitch}
        {...rest}
      />
    </Tooltip>
  );
}
