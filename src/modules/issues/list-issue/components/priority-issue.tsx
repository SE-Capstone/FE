import { Stack } from '@chakra-ui/react';
import { FaAnglesUp, FaAngleUp, FaAnglesDown, FaAngleDown, FaEquals } from 'react-icons/fa6';

import { IssuePriorityEnum } from '../types';

import { ISSUE_PRIORITY_VALUES } from '@/configs';

interface PriorityIssueProps {
  priority: IssuePriorityEnum;
}

const PriorityIcon = (priority: IssuePriorityEnum) => {
  switch (priority) {
    case IssuePriorityEnum.Highest:
      return <FaAnglesUp color="red" />;
    case IssuePriorityEnum.High:
      return <FaAngleUp color="red" />;
    case IssuePriorityEnum.Medium:
      return <FaEquals color="orange" />;
    case IssuePriorityEnum.Low:
      return <FaAngleDown color="primary" />;
    case IssuePriorityEnum.Lowest:
      return <FaAnglesDown color="primary" />;
    default:
      return <FaEquals color="primary" />;
  }
};

export function PriorityIssue(props: PriorityIssueProps) {
  const { priority } = props;

  return (
    <Stack flexDir="row" gap={1}>
      {PriorityIcon(priority)}
      {ISSUE_PRIORITY_VALUES[priority]}
    </Stack>
  );
}
