import { forwardRef, memo, type ReactNode, useEffect } from 'react';

import { autoScrollWindowForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import { Box, xcss } from '@atlaskit/primitives';

import { useBoardContext } from './board-context';

type BoardProps = {
  children: ReactNode;
};

const boardStyles = xcss({
  display: 'flex',
  justifyContent: 'start',
  gap: 'space.200',
  flexDirection: 'row',
  height: '100%',
  overflowY: 'auto',
});

const Board = forwardRef<HTMLDivElement, BoardProps>(({ children }: BoardProps, ref) => {
  const { instanceId } = useBoardContext();

  useEffect(
    () =>
      autoScrollWindowForElements({
        canScroll: ({ source }) => source.data.instanceId === instanceId,
      }),
    [instanceId]
  );

  return (
    <Box ref={ref} xcss={boardStyles}>
      {children}
    </Box>
  );
});

export default memo(Board);
