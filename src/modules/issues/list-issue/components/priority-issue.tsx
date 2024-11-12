import { Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { FaAnglesUp, FaAngleUp, FaAnglesDown, FaAngleDown, FaEquals } from 'react-icons/fa6';

import { IssuePriorityEnum } from '../types';

import { ISSUE_PRIORITY_VALUES } from '@/configs';

interface PriorityIssueProps {
  priority: IssuePriorityEnum;
  hideText?: boolean;
}

const PriorityIcon = (priority: IssuePriorityEnum) => {
  switch (priority) {
    case IssuePriorityEnum.Highest:
      return <FaAnglesUp color="#E65D3E" />;
    case IssuePriorityEnum.High:
      return <FaAngleUp color="#fc5630" />;
    case IssuePriorityEnum.Medium:
      return <FaEquals color="orange" />;
    case IssuePriorityEnum.Low:
      return <FaAngleDown color="#0065ff" />;
    case IssuePriorityEnum.Lowest:
      return <FaAnglesDown color="#146BE8" />;
    default:
      return <FaEquals color="orange" />;
  }
};

export function PriorityIssue(props: PriorityIssueProps) {
  const { priority, hideText } = props;
  const { t } = useTranslation();

  return (
    <Stack flexDir="row" gap={!hideText ? 2 : 0} alignItems="center">
      {PriorityIcon(priority)}
      {!hideText && <Text>{ISSUE_PRIORITY_VALUES(t)[priority]}</Text>}
    </Stack>
  );
}
