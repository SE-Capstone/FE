import React, { useEffect } from 'react';

import { Icon, IconButton, Td, Tr, useMergeRefs } from '@chakra-ui/react';
import { useDrag, useDrop } from 'react-dnd';
import { MdOutlineDragIndicator } from 'react-icons/md';

import { CustomNumberInput } from '../form';

import colors from '@/themes/foundations/colors';

function selectBorder(isActive: boolean, canDrop: boolean) {
  const borderStyle: Record<string, string> = {
    borderWidth: '2px',
    borderStyle: 'none',
    borderColor: 'transparent',
  };

  if (isActive) {
    borderStyle.borderColor = colors.primary;
    borderStyle.borderStyle = 'dashed';
  } else if (canDrop) {
    borderStyle.borderColor = colors.spectrum;
  }

  return borderStyle;
}

type Row<ObjectType> = ObjectType & { index: number; order?: number };

export interface DraggableRowProps<ObjectType> {
  row: Row<ObjectType>;
  reorderRow: (draggedRow: Row<ObjectType>, targetRow: Row<ObjectType>) => void;

  children: React.ReactNode;

  hasDraggable?: boolean;
}

function _DraggableRow<ObjectType>(
  props: DraggableRowProps<ObjectType>,
  ref: React.ForwardedRef<any>
) {
  const { children, row, reorderRow, hasDraggable } = props;

  const [order, setOrder] = React.useState<number>(row?.order || 0);
  const [{ isOver, canDrop }, dropRef] = useDrop({
    accept: 'row',
    drop: (draggedRow: Row<ObjectType>) => reorderRow(draggedRow, row),
    canDrop: (draggedRow: Row<ObjectType>) => draggedRow.index !== row.index,
    collect: (monitor) => ({ isOver: monitor.isOver(), canDrop: monitor.canDrop() }),
  });

  const [{ isDragging }, dragRef, previewRef] = useDrag({
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    item: () => row,
    type: 'row',
  });
  const refMerged = useMergeRefs(ref, previewRef);

  const isActive = isOver && canDrop;

  useEffect(() => {
    setOrder(row?.order || 0);
  }, [row?.order]);

  return (
    <Tr
      ref={refMerged}
      _odd={{
        background: '#F4F7F9',
      }}
      style={{ opacity: isDragging ? 0.5 : 1, ...selectBorder(isActive, canDrop) }}
    >
      <>{children}</>
      {hasDraggable && (
        <Td ref={dropRef} px={1} borderY="1px">
          <IconButton
            ref={dragRef}
            variant="unstyled"
            aria-label="drag row"
            icon={<Icon boxSize={6} as={MdOutlineDragIndicator} />}
            type="button"
            display="none"
          />
          <CustomNumberInput
            w={20}
            min={1}
            value={order}
            hiddenStepper
            onChange={(v) => setOrder(+v)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (row.order !== order) reorderRow({ ...row, order }, row);
              }
            }}
            onBlur={() => {
              if (row.order !== order) {
                reorderRow({ ...row, order }, row);
              }
            }}
          />
        </Td>
      )}
    </Tr>
  );
}

export const DraggableRow = React.memo(React.forwardRef(_DraggableRow)) as typeof _DraggableRow;
