import { Badge } from '@chakra-ui/react';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { UserStatusEnum, USER_STATUS_LABEL } from '@/configs';

const BADGE_STATUS_COLOR_MAP: Record<UserStatusEnum, ThemingProps['colorScheme']> = {
  [UserStatusEnum.Active]: 'green',
  [UserStatusEnum.Inactive]: 'red',
};

interface BadgeRoleProps extends BadgeProps {
  status: UserStatusEnum;
}

export function BadgeStatus(props: BadgeRoleProps) {
  const { status, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={BADGE_STATUS_COLOR_MAP[status]}>
      {USER_STATUS_LABEL[status] || status}
    </Badge>
  );
}
