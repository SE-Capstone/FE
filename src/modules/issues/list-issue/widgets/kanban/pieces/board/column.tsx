import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, {
  type CustomTriggerProps,
  DropdownItem,
  DropdownItemGroup,
} from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Heading from '@atlaskit/heading';
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { easeInOut } from '@atlaskit/motion/curves';
import { mediumDurationMs } from '@atlaskit/motion/durations';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { autoScrollForElements } from '@atlaskit/pragmatic-drag-and-drop-auto-scroll/element';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Box, Flex, Inline, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { useDisclosure } from '@chakra-ui/react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { MdCheck } from 'react-icons/md';
import invariant from 'tiny-invariant';

import { useBoardContext } from './board-context';
import { Card } from './card';
import { ColumnContext, type ColumnContextProps, useColumnContext } from './column-context';
import { type ColumnType } from '../../data';

import type { IStatus } from '@/modules/statuses/types';

import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { useRemoveStatusHook } from '@/modules/statuses/hooks/mutations/use-remove-status.hooks';
import { RemoveStatusWidget } from '@/modules/statuses/widgets';

const columnStyles = xcss({
  backgroundColor: 'elevation.surface.raised',
  borderRadius: 'border.radius.300',
  transition: `background ${mediumDurationMs}ms ${easeInOut}`,
  position: 'relative',
});

const stackStyles = xcss({
  width: '270px',
  minHeight: '0',
  flexGrow: 1,
});

const scrollContainerStyles = xcss({
  height: '100%',
  overflowY: 'auto',
});

const cardListStyles = xcss({
  boxSizing: 'border-box',
  minHeight: '100%',
  padding: 'space.100',
  gap: 'space.100',
});

const columnHeaderStyles = xcss({
  paddingInlineStart: 'space.200',
  paddingInlineEnd: 'space.200',
  paddingBlockStart: 'space.100',
  color: 'color.text.subtlest',
  userSelect: 'none',
});

type State =
  | { type: 'idle' }
  | { type: 'is-card-over' }
  | { type: 'is-column-over'; closestEdge: Edge | null }
  | { type: 'generate-safari-column-preview'; container: HTMLElement }
  | { type: 'generate-column-preview' };

// preventing re-renders with stable state objects
const idle: State = { type: 'idle' };
const isCardOver: State = { type: 'is-card-over' };

const stateStyles: {
  [key in State['type']]: ReturnType<typeof xcss> | undefined;
} = {
  idle: xcss({
    cursor: 'grab',
  }),
  'is-card-over': xcss({
    backgroundColor: 'color.background.selected.hovered',
  }),
  'is-column-over': undefined,
  'generate-column-preview': xcss({
    isolation: 'isolate',
  }),
  'generate-safari-column-preview': undefined,
};

const isDraggingStyles = xcss({
  opacity: 0.4,
});

const safariPreviewStyles = xcss({
  width: '250px',
  backgroundColor: 'elevation.surface.sunken',
  borderRadius: 'border.radius',
  padding: 'space.200',
});

function DropdownMenuTrigger({ triggerRef, ...triggerProps }: CustomTriggerProps) {
  return (
    <IconButton
      ref={mergeRefs([triggerRef])}
      appearance="subtle"
      label="Actions"
      spacing="compact"
      icon={MoreIcon}
      {...triggerProps}
    />
  );
}

function SafariColumnPreview({ column }: { column: ColumnType }) {
  return (
    <Box xcss={[columnHeaderStyles, safariPreviewStyles]}>
      <Heading size="xxsmall" as="span">
        {column.title}
      </Heading>
    </Box>
  );
}

function ActionMenuItems({
  status,
  isRefetching,
  onOpen,
}: {
  status?: IStatus;
  isRefetching: boolean;
  onOpen: () => void;
}) {
  const { t } = useTranslation();
  const { columnId } = useColumnContext();
  const { getColumns, reorderColumn } = useBoardContext();
  const { handleRemoveStatus } = useRemoveStatusHook(false);

  const columns = getColumns();
  const startIndex = columns.findIndex((column) => column.columnId === columnId);

  const moveLeft = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex - 1,
    });
  }, [reorderColumn, startIndex]);

  const moveRight = useCallback(() => {
    reorderColumn({
      startIndex,
      finishIndex: startIndex + 1,
    });
  }, [reorderColumn, startIndex]);

  const isMoveLeftDisabled = startIndex === 0;
  const isMoveRightDisabled = startIndex === columns.length - 1;

  return (
    <DropdownItemGroup>
      <DropdownItem isDisabled={isMoveLeftDisabled} onClick={moveLeft}>
        Move left
      </DropdownItem>
      <DropdownItem isDisabled={isMoveRightDisabled} onClick={moveRight}>
        Move right
      </DropdownItem>
      {status && (
        <DropdownItemGroup title={t('fields.actions')}>
          <DropdownItem
            isDisabled={isRefetching}
            onClick={() => {
              if (status.issueCount === 0) {
                return handleRemoveStatus(status);
              }

              onOpen();
              return undefined;
            }}
          >
            {t('actions.delete')}
          </DropdownItem>
        </DropdownItemGroup>
      )}
    </DropdownItemGroup>
  );
}

function ActionMenu({
  id,
  listStatus,
  isRefetching,
}: {
  id: string;
  listStatus: IStatus[];
  isRefetching: boolean;
}) {
  const disclosureModalRemoveStatus = useDisclosure();
  const status = listStatus.find((s) => s.id === id);

  return (
    <>
      <DropdownMenu trigger={DropdownMenuTrigger}>
        <ActionMenuItems
          status={status}
          isRefetching={isRefetching}
          onOpen={disclosureModalRemoveStatus.onOpen}
        />
      </DropdownMenu>
      {status && (
        <RemoveStatusWidget
          listStatus={listStatus}
          status={status}
          isDefault={false}
          isOpen={disclosureModalRemoveStatus.isOpen}
          onClose={disclosureModalRemoveStatus.onClose}
        />
      )}
    </>
  );
}

export const Column = memo(function Column({
  column,
  listStatus,
  isRefetching,
}: {
  column: ColumnType;
  listStatus: IStatus[];
  isRefetching: boolean;
}) {
  const { columnId } = column;
  const columnRef = useRef<HTMLDivElement | null>(null);
  const columnInnerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);
  const scrollableRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<State>(idle);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const { instanceId, registerColumn } = useBoardContext();

  const { permissions } = useProjectContext();
  const canUpdate = permissions.includes(ProjectPermissionEnum.IsProjectConfigurator);

  useEffect(() => {
    if (!canUpdate) {
      return undefined;
    }
    invariant(columnRef.current);
    invariant(columnInnerRef.current);
    invariant(headerRef.current);
    invariant(scrollableRef.current);
    return combine(
      registerColumn({
        columnId,
        entry: {
          element: columnRef.current,
        },
      }),
      draggable({
        element: columnRef.current,
        dragHandle: headerRef.current,
        getInitialData: () => ({ columnId, type: 'column', instanceId }),
        onGenerateDragPreview: ({ nativeSetDragImage }) => {
          const isSafari: boolean =
            navigator.userAgent.includes('AppleWebKit') && !navigator.userAgent.includes('Chrome');

          if (!isSafari) {
            setState({ type: 'generate-column-preview' });
            return;
          }
          setCustomNativeDragPreview({
            // getOffset: centerUnderPointer,
            render: ({ container }) => {
              setState({
                type: 'generate-safari-column-preview',
                container,
              });
              return () => setState(idle);
            },
            nativeSetDragImage,
          });
        },
        onDragStart: () => {
          setIsDragging(true);
        },
        onDrop() {
          setState(idle);
          setIsDragging(false);
        },
      }),
      dropTargetForElements({
        element: columnInnerRef.current,
        getData: () => ({ columnId }),
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'card',
        getIsSticky: () => true,
        onDragEnter: () => setState(isCardOver),
        onDragLeave: () => setState(idle),
        onDragStart: () => setState(isCardOver),
        onDrop: () => setState(idle),
      }),
      dropTargetForElements({
        element: columnRef.current,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'column',
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = {
            columnId,
          };
          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['left', 'right'],
          });
        },
        onDragEnter: (args) => {
          setState({
            type: 'is-column-over',
            closestEdge: extractClosestEdge(args.self.data),
          });
        },
        onDrag: (args) => {
          // skip react re-render if edge is not changing
          setState((current) => {
            const closestEdge: Edge | null = extractClosestEdge(args.self.data);
            if (current.type === 'is-column-over' && current.closestEdge === closestEdge) {
              return current;
            }
            return {
              type: 'is-column-over',
              closestEdge,
            };
          });
        },
        onDragLeave: () => {
          setState(idle);
        },
        onDrop: () => {
          setState(idle);
        },
      }),
      autoScrollForElements({
        element: scrollableRef.current,
        canScroll: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'card',
      })
    );
  }, [columnId, registerColumn, instanceId, canUpdate]);

  const stableItems = useRef(column.items);
  useEffect(() => {
    stableItems.current = column.items;
  }, [column.items]);

  const getCardIndex = useCallback(
    (id: string) => stableItems.current.findIndex((item) => item.id === id),
    []
  );

  const getNumCards = useCallback(() => stableItems.current.length, []);

  const contextValue: ColumnContextProps = useMemo(
    () => ({ columnId, getCardIndex, getNumCards }),
    [columnId, getCardIndex, getNumCards]
  );

  return (
    <ColumnContext.Provider value={contextValue}>
      <Flex
        ref={columnRef}
        testId={`column-${columnId}`}
        direction="column"
        xcss={[columnStyles, stateStyles[state.type]]}
      >
        <Stack ref={columnInnerRef} xcss={stackStyles}>
          <Stack xcss={[stackStyles, isDragging ? isDraggingStyles : undefined]}>
            <Inline
              ref={headerRef}
              xcss={columnHeaderStyles}
              testId={`column-header-${columnId}`}
              spread="space-between"
              alignBlock="center"
            >
              <Flex>
                <Heading size="xsmall" as="span" testId={`column-header-title-${columnId}`}>
                  {column.title}
                </Heading>
                {column.isDone && <MdCheck size="15px" color="green" />}
              </Flex>
              {canUpdate && (
                <ActionMenu
                  id={column.columnId}
                  listStatus={listStatus}
                  isRefetching={isRefetching}
                />
              )}
            </Inline>
            <Box ref={scrollableRef} xcss={scrollContainerStyles}>
              <Stack xcss={cardListStyles} space="space.100">
                {column.items.map((item) => (
                  <Card key={item.id} item={item} columnId={columnId} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
        {state.type === 'is-column-over' && state.closestEdge && (
          <DropIndicator edge={state.closestEdge} gap={token('space.200', '0')} />
        )}
      </Flex>
      {state.type === 'generate-safari-column-preview'
        ? createPortal(<SafariColumnPreview column={column} />, state.container)
        : null}
    </ColumnContext.Provider>
  );
});
