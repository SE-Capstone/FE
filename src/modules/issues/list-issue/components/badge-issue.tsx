import { Badge } from '@chakra-ui/react';

import type { ThemingProps, BadgeProps } from '@chakra-ui/react';

interface BadgeIssueProps extends BadgeProps {
  content: string | number;
}

export function BadgeIssue(props: BadgeIssueProps) {
  const { content, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme="green">
      {content}
    </Badge>
  );
}
