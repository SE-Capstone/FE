import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import AppProvider from '@atlaskit/app-provider';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { reorder } from '@atlaskit/pragmatic-drag-and-drop/reorder';
import { triggerPostMoveFlash } from '@atlaskit/pragmatic-drag-and-drop-flourish/trigger-post-move-flash';
import { extractClosestEdge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { getReorderDestinationIndex } from '@atlaskit/pragmatic-drag-and-drop-hitbox/util/get-reorder-destination-index';
import * as liveRegion from '@atlaskit/pragmatic-drag-and-drop-live-region';
import { Box, Button, Text, useDisclosure } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';
import invariant from 'tiny-invariant';

import Connector from '../signalR-connection';
import { type ColumnMap, type ColumnType, type Issue, useGetBasicData } from './data';
import { ActionTableKanbanWidget } from '../action-table-kanban.widget';
import Board from './pieces/board/board';
import { BoardContext, type BoardContextValue } from './pieces/board/board-context';
import BoardSkeleton from './pieces/board/board-skeleton';
import { Column } from './pieces/board/column';
import { createRegistry } from './pieces/board/registry';

import type { ILabel } from '@/modules/labels/types';
import type { IPhase } from '@/modules/phases/types';
import type { IStatus } from '@/modules/statuses/types';
import type { Edge } from '@atlaskit/pragmatic-drag-and-drop-hitbox/types';

import { ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { getAccessToken } from '@/libs/helpers';
import { useGetListLabelQuery } from '@/modules/labels/hooks/queries';
import { useGetListPhaseQuery } from '@/modules/phases/hooks/queries';
import { useGetListStatusQuery } from '@/modules/statuses/hooks/queries';
import { UpsertStatusWidget } from '@/modules/statuses/widgets';

type Outcome =
  | {
      type: 'column-reorder';
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: 'card-reorder';
      columnId: string;
      startIndex: number;
      finishIndex: number;
    }
  | {
      type: 'card-move';
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn: number;
    };

type Trigger = 'pointer' | 'keyboard';

type Operation = {
  trigger: Trigger;
  outcome: Outcome;
};

type BoardState = {
  columnMap: ColumnMap;
  orderedColumnIds: string[];
  lastOperation: Operation | null;
};

export default function KanbanWidget() {
  const { projectId } = useParams();
  const accessToken = getAccessToken();
  const [shadowColumnMap, setShadowColumnMap] = useState<ColumnMap>({});
  const { columnMap, orderedColumnIds, isLoading, refetch, isRefetching } = useGetBasicData();
  const {
    listStatus,
    isLoading: isLoading3,
    refetch: refetchStatus,
    isRefetching: isRefetchingStatus,
  } = useGetListStatusQuery({
    params: {
      projectId: projectId || '',
    },
  });

  useEffect(() => {
    if (JSON.stringify(columnMap) !== JSON.stringify(shadowColumnMap)) {
      setShadowColumnMap(columnMap);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnMap]);

  const [tabId, setTabId] = useState<string | null>(null);

  const { sendMessage, orderStatusEvents, sendMessageCard, orderCardEvents, connection } =
    Connector(accessToken || '', projectId || '');

  useEffect(() => {
    if (sessionStorage.getItem('refreshKanban') === 'true') {
      refetch().then(() => sessionStorage.setItem('refreshKanban', 'false'));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const storedTabId = sessionStorage.getItem('tabId');
    orderStatusEvents(() => {
      if (!storedTabId || storedTabId !== tabId) {
        refetch();
      }
    });
    orderCardEvents(() => {
      refetchStatus();
      if (!storedTabId || storedTabId !== tabId) {
        refetch();
      }
    });

    return () => {
      // Unsubscribe from the event when the component unmounts
      connection.off('StatusOrderResponse');
      connection.off('IssueOrderResponse');
    };
  });

  const [data, setData] = useState<BoardState>(() => ({
    columnMap,
    orderedColumnIds,
    lastOperation: null,
  }));

  useEffect(() => {
    if ((!isLoading || !isRefetching) && columnMap && orderedColumnIds) {
      setData({
        columnMap,
        orderedColumnIds,
        lastOperation: null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, isRefetching, shadowColumnMap]);

  const stableData = useRef(data);
  useEffect(() => {
    stableData.current = data;
  }, [data]);

  const [registry] = useState(createRegistry);

  const { lastOperation } = data;

  useEffect(() => {
    if (lastOperation === null) {
      return;
    }
    const { outcome, trigger } = lastOperation;

    if (outcome.type === 'column-reorder') {
      const { startIndex, finishIndex } = outcome;

      const { columnMap, orderedColumnIds } = stableData.current;
      const sourceColumn = columnMap[orderedColumnIds[finishIndex]];

      const entry = registry.getColumn(sourceColumn.columnId);
      triggerPostMoveFlash(entry.element);

      liveRegion.announce(
        `You've moved ${sourceColumn.title} from position ${startIndex + 1} to position ${
          finishIndex + 1
        } of ${orderedColumnIds.length}.`
      );

      return;
    }

    if (outcome.type === 'card-reorder') {
      const { columnId, startIndex, finishIndex } = outcome;

      const { columnMap } = stableData.current;
      const column = columnMap[columnId];
      const item = column.items[finishIndex];

      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

      if (trigger !== 'keyboard') {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.title} from position ${startIndex + 1} to position ${
          finishIndex + 1
        } of ${column.items.length} in the ${column.title} column.`
      );

      return;
    }

    if (outcome.type === 'card-move') {
      const { finishColumnId, itemIndexInStartColumn, itemIndexInFinishColumn } = outcome;

      const data = stableData.current;
      const destinationColumn = data.columnMap[finishColumnId];
      const item = destinationColumn.items[itemIndexInFinishColumn];

      const finishPosition =
        typeof itemIndexInFinishColumn === 'number'
          ? itemIndexInFinishColumn + 1
          : destinationColumn.items.length;

      const entry = registry.getCard(item.id);
      triggerPostMoveFlash(entry.element);

      if (trigger !== 'keyboard') {
        return;
      }

      liveRegion.announce(
        `You've moved ${item.title} from position ${
          itemIndexInStartColumn + 1
        } to position ${finishPosition} in the ${destinationColumn.title} column.`
      );

      /**
       * Because the card has moved column, it will have remounted.
       * This means we need to manually restore focus to it.
       */
      entry.actionMenuTrigger.focus();
    }
  }, [lastOperation, registry]);

  useEffect(() => liveRegion.cleanup(), []);

  const getColumns = useCallback(() => {
    const { columnMap, orderedColumnIds } = stableData.current;
    return orderedColumnIds.map((columnId) => columnMap[columnId]);
  }, []);

  const reorderColumn = useCallback(
    ({
      startIndex,
      finishIndex,
      trigger = 'keyboard',
    }: {
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const storedTabId = sessionStorage.getItem('tabId');
        if (!storedTabId || !tabId) {
          const tabId = Date.now().toString(); // Generate a unique ID (could use a library for unique IDs)
          setTabId(tabId);
          sessionStorage.setItem('tabId', tabId);
        }
        const outcome: Outcome = {
          type: 'column-reorder',
          columnId: data.orderedColumnIds[startIndex],
          startIndex,
          finishIndex,
        };

        const result = {
          ...data,
          orderedColumnIds: reorder({
            list: data.orderedColumnIds,
            startIndex,
            finishIndex,
          }),
          lastOperation: {
            outcome,
            trigger,
          },
        };

        if (startIndex !== finishIndex) {
          sendMessage({
            projectId: projectId || '',
            statusId: outcome.columnId,
            position: outcome.finishIndex,
          });
        }
        return result;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const reorderCard = useCallback(
    ({
      columnId,
      startIndex,
      finishIndex,
      trigger = 'keyboard',
    }: {
      columnId: string;
      startIndex: number;
      finishIndex: number;
      trigger?: Trigger;
    }) => {
      setData((data) => {
        const storedTabId = sessionStorage.getItem('tabId');
        if (!storedTabId || !tabId) {
          const tabId = Date.now().toString(); // Generate a unique ID (could use a library for unique IDs)
          setTabId(tabId);
          sessionStorage.setItem('tabId', tabId);
        }

        const sourceColumn = data.columnMap[columnId];
        const updatedItems = reorder({
          list: sourceColumn.items,
          startIndex,
          finishIndex,
        });
        const item: Issue = sourceColumn.items[startIndex];
        const updatedSourceColumn: ColumnType = {
          ...sourceColumn,
          items: updatedItems,
        };

        const updatedMap: ColumnMap = {
          ...data.columnMap,
          [columnId]: updatedSourceColumn,
        };

        const outcome: Outcome | null = {
          type: 'card-reorder',
          columnId,
          startIndex,
          finishIndex,
        };

        const result = {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            trigger,
            outcome,
          },
        };

        if (startIndex !== finishIndex) {
          sendMessageCard({
            projectId: projectId || '',
            issueId: item.id,
            statusId: sourceColumn.columnId,
            position: finishIndex,
          });
        }

        return result;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const moveCard = useCallback(
    ({
      startColumnId,
      finishColumnId,
      itemIndexInStartColumn,
      itemIndexInFinishColumn,
      trigger = 'keyboard',
    }: {
      startColumnId: string;
      finishColumnId: string;
      itemIndexInStartColumn: number;
      itemIndexInFinishColumn?: number;
      trigger?: 'pointer' | 'keyboard';
    }) => {
      // invalid cross column movement
      if (startColumnId === finishColumnId) {
        return;
      }
      setData((data) => {
        const storedTabId = sessionStorage.getItem('tabId');
        sessionStorage.setItem('refreshKanban', 'true');
        sessionStorage.setItem('refreshIssue', 'true');
        if (!storedTabId || !tabId) {
          const tabId = Date.now().toString(); // Generate a unique ID (could use a library for unique IDs)
          setTabId(tabId);
          sessionStorage.setItem('tabId', tabId);
        }

        const sourceColumn = data.columnMap[startColumnId];
        const destinationColumn = data.columnMap[finishColumnId];

        const item: Issue = sourceColumn.items[itemIndexInStartColumn];

        const destinationItems = Array.from(destinationColumn.items);

        // Going into the first position if no index is provided
        const newIndexInDestination = itemIndexInFinishColumn ?? 0;
        destinationItems.splice(newIndexInDestination, 0, item);

        const updatedMap = {
          ...data.columnMap,
          [startColumnId]: {
            ...sourceColumn,
            items: sourceColumn.items.filter((i) => i.id !== item.id),
          },
          [finishColumnId]: {
            ...destinationColumn,
            items: destinationItems,
          },
        };

        const outcome: Outcome | null = {
          type: 'card-move',
          finishColumnId,
          itemIndexInStartColumn,
          itemIndexInFinishColumn: newIndexInDestination,
        };

        const result = {
          ...data,
          columnMap: updatedMap,
          lastOperation: {
            outcome,
            trigger,
          },
        };

        sendMessageCard({
          projectId: projectId || '',
          issueId: item.id,
          statusId: outcome.finishColumnId,
          position: outcome.itemIndexInFinishColumn,
        });

        return result;
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const [instanceId] = useState(() => Symbol('instance-id'));

  useEffect(
    () =>
      combine(
        monitorForElements({
          canMonitor({ source }) {
            return source.data.instanceId === instanceId;
          },
          onDrop(args) {
            const { location, source } = args;
            // didn't drop on anything
            if (!location.current.dropTargets.length) {
              return;
            }
            // need to handle drop

            // 1. remove element from original position
            // 2. move to new position

            if (source.data.type === 'column') {
              const startIndex: number = data.orderedColumnIds.findIndex(
                (columnId) => columnId === source.data.columnId
              );

              const target = location.current.dropTargets[0];
              const indexOfTarget: number = data.orderedColumnIds.findIndex(
                (id) => id === target.data.columnId
              );
              const closestEdgeOfTarget: Edge | null = extractClosestEdge(target.data);

              const finishIndex = getReorderDestinationIndex({
                startIndex,
                indexOfTarget,
                closestEdgeOfTarget,
                axis: 'horizontal',
              });

              reorderColumn({ startIndex, finishIndex, trigger: 'pointer' });
            }
            // Dragging a card
            if (source.data.type === 'card') {
              const { itemId } = source.data;
              invariant(typeof itemId === 'string');
              // TODO: these lines not needed if item has columnId on it
              const [, startColumnRecord] = location.initial.dropTargets;
              const sourceId = startColumnRecord.data.columnId;
              invariant(typeof sourceId === 'string');
              const sourceColumn = data.columnMap[sourceId];
              const itemIndex = sourceColumn.items.findIndex((item) => item.id === itemId);

              if (location.current.dropTargets.length === 1) {
                const [destinationColumnRecord] = location.current.dropTargets;
                const destinationId = destinationColumnRecord.data.columnId;
                invariant(typeof destinationId === 'string');
                const destinationColumn = data.columnMap[destinationId];
                invariant(destinationColumn);

                // reordering in same column
                if (sourceColumn === destinationColumn) {
                  const destinationIndex = getReorderDestinationIndex({
                    startIndex: itemIndex,
                    indexOfTarget: sourceColumn.items.length - 1,
                    closestEdgeOfTarget: null,
                    axis: 'vertical',
                  });
                  reorderCard({
                    columnId: sourceColumn.columnId,
                    startIndex: itemIndex,
                    finishIndex: destinationIndex,
                    trigger: 'pointer',
                  });
                  return;
                }

                // moving to a new column
                moveCard({
                  itemIndexInStartColumn: itemIndex,
                  startColumnId: sourceColumn.columnId,
                  finishColumnId: destinationColumn.columnId,
                  trigger: 'pointer',
                });
                return;
              }

              // dropping in a column (relative to a card)
              if (location.current.dropTargets.length === 2) {
                const [destinationCardRecord, destinationColumnRecord] =
                  location.current.dropTargets;
                const destinationColumnId = destinationColumnRecord.data.columnId;
                invariant(typeof destinationColumnId === 'string');
                const destinationColumn = data.columnMap[destinationColumnId];

                const indexOfTarget = destinationColumn.items.findIndex(
                  (item) => item.id === destinationCardRecord.data.itemId
                );
                const closestEdgeOfTarget: Edge | null = extractClosestEdge(
                  destinationCardRecord.data
                );

                // case 1: ordering in the same column
                if (sourceColumn === destinationColumn) {
                  const destinationIndex = getReorderDestinationIndex({
                    startIndex: itemIndex,
                    indexOfTarget,
                    closestEdgeOfTarget,
                    axis: 'vertical',
                  });
                  reorderCard({
                    columnId: sourceColumn.columnId,
                    startIndex: itemIndex,
                    finishIndex: destinationIndex,
                    trigger: 'pointer',
                  });
                  return;
                }

                // case 2: moving into a new column relative to a card

                const destinationIndex =
                  closestEdgeOfTarget === 'bottom' ? indexOfTarget + 1 : indexOfTarget;

                moveCard({
                  itemIndexInStartColumn: itemIndex,
                  startColumnId: sourceColumn.columnId,
                  finishColumnId: destinationColumn.columnId,
                  itemIndexInFinishColumn: destinationIndex,
                  trigger: 'pointer',
                });
              }
            }
          },
        })
      ),
    [data, instanceId, moveCard, reorderCard, reorderColumn]
  );

  const [labels, setLabels] = useState<ILabel[]>([]);
  const [statuses, setStatuses] = useState<IStatus[]>([]);
  const [phases, setPhases] = useState<IPhase[]>([]);
  const { listLabel, isLoading: isLoading2 } = useGetListLabelQuery({
    params: {
      projectId: projectId || '',
    },
  });

  const { listPhase, isLoading: isLoading5 } = useGetListPhaseQuery({
    params: {
      projectId: projectId || '',
    },
  });

  useEffect(() => {
    if (listLabel && JSON.stringify(listLabel) !== JSON.stringify(labels)) {
      setLabels(listLabel);
    }
  }, [labels, listLabel]);

  useEffect(() => {
    if (listStatus && JSON.stringify(listStatus) !== JSON.stringify(statuses)) {
      setStatuses(listStatus);
    }
  }, [listStatus, statuses]);

  useEffect(() => {
    if (listPhase && JSON.stringify(listPhase) !== JSON.stringify(phases)) {
      setPhases(listPhase);
    }
  }, [listPhase, phases]);

  const contextValue: BoardContextValue = useMemo(
    () => ({
      getColumns,
      reorderColumn,
      reorderCard,
      moveCard,
      registerCard: registry.registerCard,
      registerColumn: registry.registerColumn,
      instanceId,
    }),
    [getColumns, reorderColumn, reorderCard, registry, moveCard, instanceId]
  );

  const { permissions } = useProjectContext();
  const disclosureModal = useDisclosure();
  const canCreate = permissions.includes(ProjectPermissionEnum.IsProjectConfigurator);

  return (
    <>
      <ActionTableKanbanWidget
        listLabel={labels}
        listPhase={phases}
        listStatus={statuses}
        projectId={projectId || ''}
      />
      {isLoading || isLoading2 || isLoading3 || isLoading5 || isRefetching ? (
        <BoardSkeleton />
      ) : (
        <AppProvider>
          <BoardContext.Provider value={contextValue}>
            {data.orderedColumnIds.length > 0 ? (
              <Board>
                {data.orderedColumnIds.map((columnId) => (
                  <Column
                    key={columnId}
                    column={data.columnMap[columnId]}
                    isRefetching={isRefetchingStatus}
                    listStatus={statuses}
                  />
                ))}
                {canCreate && (
                  <>
                    <Button fontSize="28px" onClick={disclosureModal.onOpen}>
                      +
                    </Button>
                    <UpsertStatusWidget
                      isOpen={disclosureModal.isOpen}
                      isDefault={false}
                      onClose={disclosureModal.onClose}
                    />
                  </>
                )}
              </Board>
            ) : (
              <Box w="full" bg="white" p={5} rounded={2} textAlign="center">
                <Text fontSize="20px">No data</Text>
              </Box>
            )}
          </BoardContext.Provider>
        </AppProvider>
      )}
    </>
  );
}
