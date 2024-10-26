import { Badge } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';

import { ProjectStatusEnum } from '../../list-project/types';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { PROJECT_STATUS_VALUES } from '@/configs';

const BADGE_STATUS_COLOR_MAP: Record<ProjectStatusEnum, ThemingProps['colorScheme']> = {
  [ProjectStatusEnum.Completed]: 'green',
  [ProjectStatusEnum.Canceled]: 'orange',
  [ProjectStatusEnum.InProgress]: 'blue',
  [ProjectStatusEnum.NotStarted]: 'gray',
};

interface BadgeRoleProps extends BadgeProps {
  status: ProjectStatusEnum;
}

export function BadgeStatus(props: BadgeRoleProps) {
  const { status, ...badgeProps } = props;
  const { t } = useTranslation();

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={BADGE_STATUS_COLOR_MAP[status]}>
      {PROJECT_STATUS_VALUES(t)[status] || status}
    </Badge>
  );
}
