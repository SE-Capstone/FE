import { Badge } from '@chakra-ui/react';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { UserStatusEnum, type RolesEnum, USER_STATUS_LABEL } from '@/configs';

const BADGE_STATUS_COLOR_MAP: Record<UserStatusEnum, ThemingProps['colorScheme']> = {
  [UserStatusEnum.Active]: 'green',
  [UserStatusEnum.Inactive]: 'red',
};

interface BadgeRoleProps extends BadgeProps {
  role: RolesEnum;
}

export function BadgeStatus(props: BadgeRoleProps) {
  const { role, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={BADGE_STATUS_COLOR_MAP[role]}>
      {USER_STATUS_LABEL[role] || role}
    </Badge>
  );
}
