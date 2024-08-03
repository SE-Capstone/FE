import type React from 'react';
import { useState } from 'react';

import { Box, Button } from '@chakra-ui/react';

import type { BoxProps } from '@chakra-ui/react';

export interface ResizeElementProps extends Omit<BoxProps, 'children'> {
  children: (size: { x: number; y: number }) => React.ReactNode;
}

export function ResizeElement({ children, ...stackProps }: ResizeElementProps) {
  const [size, setSize] = useState({ x: 1000, y: 300 });

  const handler = (mouseDownEvent: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const startSize = size;

    const startPosition = { x: mouseDownEvent.pageX, y: mouseDownEvent.pageY };

    function onMouseMove(mouseMoveEvent: MouseEvent) {
      setSize(() => ({
        x: -mouseMoveEvent.pageX + startSize.x + startPosition.x,
        y: startSize.y - startPosition.y + mouseMoveEvent.pageY,
      }));
    }
    function onMouseUp() {
      document.body.removeEventListener('mousemove', onMouseMove);
      // uncomment the following line if not using `{ once: true }`
      // document.body.removeEventListener("mouseup", onMouseUp);
    }

    document.body.addEventListener('mousemove', onMouseMove);
    document.body.addEventListener('mouseup', onMouseUp, { once: true });
  };

  return (
    <Box {...stackProps}>
      <Button
        variant="unstyled"
        pos="absolute"
        top="50%"
        left={0}
        transform="translate(-50%,-50%)"
        cursor="col-resize"
        onMouseDown={handler}
      >
        {/* <ExpandIcon /> */}
        Resize
      </Button>
      {children(size)}
    </Box>
  );
}
