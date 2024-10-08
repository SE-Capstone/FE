import { Badge } from '@chakra-ui/react';

import type { BadgeProps, ThemingProps } from '@chakra-ui/react';

interface BadgeIssueProps extends BadgeProps {
  content: any;
  colorScheme: ThemingProps['colorScheme'];
}

export function BadgeIssue(props: BadgeIssueProps) {
  const { content, colorScheme, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme={colorScheme}>
      {content}
    </Badge>
  );
}
