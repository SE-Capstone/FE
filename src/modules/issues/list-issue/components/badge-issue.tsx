import { Badge } from '@chakra-ui/react';

import type { BadgeProps } from '@chakra-ui/react';

interface BadgeIssueProps extends BadgeProps {
  content: any;
}

export function BadgeIssue(props: BadgeIssueProps) {
  const { content, ...badgeProps } = props;

  return (
    <Badge variant="outline" {...badgeProps} colorScheme="green">
      {content}
    </Badge>
  );
}
