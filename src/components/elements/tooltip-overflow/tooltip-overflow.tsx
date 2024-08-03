import { memo, useEffect, useRef, useState } from 'react';

import { Text, Tooltip } from '@chakra-ui/react';

import type { TextProps } from '@chakra-ui/react';

interface OverflowTooltipProps {
  children: React.ReactNode;
  noOfLines?: TextProps['noOfLines'];
  textProps?: TextProps;
}

export const TooltipOverFlow = memo(
  ({ children, noOfLines = 1, textProps }: OverflowTooltipProps) => {
    const textElementRef = useRef<HTMLParagraphElement>(null);
    const [isOverflown, setIsOverflown] = useState(false);

    useEffect(() => {
      /**
       * Check whether the element is overflow or not
       */
      const element = textElementRef.current;

      const compare = element
        ? element.offsetWidth < element.scrollWidth || element.offsetHeight < element.scrollHeight
        : false;

      setIsOverflown(compare);
    }, []);

    return (
      <Tooltip label={children} isDisabled={!isOverflown} hasArrow placement="top">
        <Text
          ref={textElementRef}
          as="span"
          textAlign="left"
          textOverflow="ellipsis"
          overflow="hidden"
          noOfLines={noOfLines}
          _hover={{ color: 'primary' }}
          {...textProps}
        >
          {children}
        </Text>
      </Tooltip>
    );
  }
);
