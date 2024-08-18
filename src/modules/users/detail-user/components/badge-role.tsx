import { Badge } from '@chakra-ui/react';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { ROLES_LABEL, type RolesEnum } from '@/configs';

const BADGE_ROLE_COLOR_MAP: Record<`${RolesEnum}`, ThemingProps['colorScheme']> = {
  ADMIN: 'blue',
  HR: 'purple',
  ACCOUNTANT: 'teal',
  EMPLOYEE: 'orange',
  TEAM_LEAD: 'green',
};

interface BadgeRoleProps extends BadgeProps {
  role: RolesEnum;
}

export function BadgeRole(props: BadgeRoleProps) {
  const { role, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={BADGE_ROLE_COLOR_MAP[role]}>
      {ROLES_LABEL[role] || role}
    </Badge>
  );
}
