import { Badge } from '@chakra-ui/react';

import { ProjectStatusEnum } from '../../list-project/types';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { PROJECT_STATUS_VALUES } from '@/configs';

const BADGE_STATUS_COLOR_MAP: Record<ProjectStatusEnum, ThemingProps['colorScheme']> = {
  [ProjectStatusEnum.Active]: 'green',
  [ProjectStatusEnum.Inactive]: 'red',
  [ProjectStatusEnum.Pending]: 'telegram',
};

interface BadgeRoleProps extends BadgeProps {
  status: ProjectStatusEnum;
}

export function BadgeStatus(props: BadgeRoleProps) {
  const { status, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={BADGE_STATUS_COLOR_MAP[status]}>
      {PROJECT_STATUS_VALUES[status] || status}
    </Badge>
  );
}
