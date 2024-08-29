import { Badge } from '@chakra-ui/react';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

import { ROLES_LABEL, RolesEnum } from '@/configs';

const BADGE_ROLE_COLOR_MAP: Record<string, ThemingProps['colorScheme']> = {
  ...Object.fromEntries(
    Object.values(RolesEnum)
      .filter((role) => role !== 'ADMIN')
      .map((role) => [role, 'blue'])
  ),
  ADMIN: 'green',
  HR: 'purple',
  ACCOUNTANT: 'orange',
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
