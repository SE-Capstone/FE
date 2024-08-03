import type React from 'react';

import { Tag, TagCloseButton, TagLabel, Text, Tooltip } from '@chakra-ui/react';

import type { TagProps } from '@chakra-ui/react';

export interface CustomTagProps extends TagProps {
  label: React.ReactNode;
  onDeleteTag?: () => void;
}

export function CustomTag(props: CustomTagProps) {
  const { label, onDeleteTag, ...restProps } = props;

  return (
    <Tag bg="secondary" color="textColor" rounded="full" width="max-content" {...restProps}>
      <Tooltip label={label} placement="top">
        <TagLabel as={Text} fontWeight="medium" noOfLines={1} flex={1} textOverflow="ellipsis">
          {label}
        </TagLabel>
      </Tooltip>
      {onDeleteTag && <TagCloseButton onClick={onDeleteTag} />}
    </Tag>
  );
}
