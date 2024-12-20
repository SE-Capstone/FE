import { forwardRef, memo, type Ref, useCallback, useEffect, useRef, useState } from 'react';

import { IconButton } from '@atlaskit/button/new';
import DropdownMenu, { DropdownItem, DropdownItemGroup } from '@atlaskit/dropdown-menu';
import mergeRefs from '@atlaskit/ds-lib/merge-refs';
import Heading from '@atlaskit/heading';
// This is the smaller MoreIcon soon to be more easily accessible with the
// ongoing icon project
import MoreIcon from '@atlaskit/icon/glyph/editor/more';
import { combine } from '@atlaskit/pragmatic-drag-and-drop/combine';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { preserveOffsetOnSource } from '@atlaskit/pragmatic-drag-and-drop/element/preserve-offset-on-source';
import { setCustomNativeDragPreview } from '@atlaskit/pragmatic-drag-and-drop/element/set-custom-native-drag-preview';
import { dropTargetForExternal } from '@atlaskit/pragmatic-drag-and-drop/external/adapter';
import {
  attachClosestEdge,
  type Edge,
  extractClosestEdge,
} from '@atlaskit/pragmatic-drag-and-drop-hitbox/closest-edge';
import { DropIndicator } from '@atlaskit/pragmatic-drag-and-drop-react-drop-indicator/box';
import { Box, Stack, xcss } from '@atlaskit/primitives';
import { token } from '@atlaskit/tokens';
import { Badge, Stack as StackCharkra, Text } from '@chakra-ui/react';
import ReactDOM from 'react-dom';
import { useTranslation } from 'react-i18next';
import { IoCalendarOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import invariant from 'tiny-invariant';

import { useBoardContext } from './board-context';
import { useColumnContext } from './column-context';
import { InlineEditCustomSelect } from '../../../editable-dropdown.widget';
import { type Issue } from '../../data';

import type { IIssue } from '@/modules/issues/list-issue/types';

import { ISSUE_PRIORITY_OPTIONS, ProjectPermissionEnum } from '@/configs';
import { useProjectContext } from '@/contexts/project/project-context';
import { BadgeIssue, PriorityIssue } from '@/modules/issues/list-issue/components';
import InlineEditWithIcon from '@/modules/issues/list-issue/components/inline-edit-field-with-icon';
import { UserWithAvatar } from '@/modules/issues/list-issue/components/user-with-avatar';
import { useRemoveIssueHook } from '@/modules/issues/list-issue/hooks/mutations/use-remove-issue.hooks';
import { useAuthentication } from '@/modules/profile/hooks';

type State =
  | { type: 'idle' }
  | { type: 'preview'; container: HTMLElement; rect: DOMRect }
  | { type: 'dragging' };
const idleState: State = { type: 'idle' };
const draggingState: State = { type: 'dragging' };

const baseStyles = xcss({
  width: '100%',
  padding: 'space.100',
  backgroundColor: 'elevation.surface',
  borderRadius: 'border.radius.200',
  position: 'relative',
  ':hover': {
    backgroundColor: 'elevation.surface.hovered',
  },
});

const stateStyles: {
  [Key in State['type']]: ReturnType<typeof xcss> | undefined;
} = {
  idle: xcss({
    cursor: 'grab',
    boxShadow: 'elevation.shadow.raised',
  }),
  dragging: xcss({
    opacity: 0.4,
    boxShadow: 'elevation.shadow.raised',
  }),
  // no shadow for preview - the platform will add it's own drop shadow
  preview: undefined,
};

type CardPrimitiveProps = {
  closestEdge: Edge | null;
  item: Issue;
  columnId: string;
  state: State;
  actionMenuTriggerRef?: Ref<HTMLButtonElement>;
};

function LazyDropdownItems({
  id,
  issue,
  canUpdate,
  canDelete,
}: {
  id: string;
  issue: IIssue;
  canUpdate: boolean;
  canDelete: boolean;
}) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { reorderCard } = useBoardContext();
  const { permissions } = useProjectContext();
  const { columnId, getCardIndex, getNumCards } = useColumnContext();
  const { handleRemoveIssue } = useRemoveIssueHook(issue.id);

  const numCards = getNumCards();
  const startIndex = getCardIndex(id);

  const canMove = permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);

  const moveToTop = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: 0 });
  }, [columnId, reorderCard, startIndex]);

  const moveToBottom = useCallback(() => {
    reorderCard({ columnId, startIndex, finishIndex: numCards - 1 });
  }, [columnId, reorderCard, startIndex, numCards]);

  const isMoveUpDisabled = startIndex === 0;
  const isMoveDownDisabled = startIndex === numCards - 1;

  return (
    <>
      {canMove && (
        <DropdownItemGroup title={t('common.reorder')}>
          <DropdownItem isDisabled={isMoveUpDisabled} onClick={moveToTop}>
            {t('common.moveToTop')}
          </DropdownItem>
          <DropdownItem isDisabled={isMoveDownDisabled} onClick={moveToBottom}>
            {t('common.moveToBottom')}
          </DropdownItem>
        </DropdownItemGroup>
      )}
      <DropdownItemGroup title={t('fields.actions')} hasSeparator={canMove}>
        <DropdownItem onClick={() => navigate(`tasks/${issue.id}`)}>
          {t('actions.viewDetail')}
        </DropdownItem>
        {canUpdate && (
          <DropdownItem onClick={() => navigate(`tasks/${issue.id}/edit`)}>
            {t('actions.edit')}
          </DropdownItem>
        )}
        {canDelete && (
          <DropdownItem onClick={() => handleRemoveIssue(issue)}>
            {t('actions.delete')}
          </DropdownItem>
        )}
      </DropdownItemGroup>
    </>
  );
}

const CardPrimitive = forwardRef<HTMLDivElement, CardPrimitiveProps>(function CardPrimitive(
  { closestEdge, item, state, columnId, actionMenuTriggerRef },
  ref
) {
  const { issue, title, index, dueDate, isLate, statusColor, id, isDone } = item;
  const { members, permissions } = useProjectContext();
  const { currentUser } = useAuthentication();
  const canUpdate =
    currentUser?.id === issue.assignee?.id ||
    currentUser?.id === issue.reporter?.id ||
    permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);
  const canDelete =
    currentUser?.id === issue.reporter?.id ||
    permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);

  return (
    <Stack ref={ref} testId={`item-${id}`} xcss={[baseStyles, stateStyles[state.type]]}>
      <StackCharkra display="flex" flexDir="row" justifyContent="space-between" alignItems="center">
        <Heading size="xsmall" as="span">
          <InlineEditWithIcon
            issue={issue}
            buttonStyle={{
              height: 'auto',
            }}
            textStyle={{ flex: 1 }}
            statusId={columnId}
            isViewOnly={!canUpdate}
          />
        </Heading>
        <DropdownMenu
          trigger={({ triggerRef, ...triggerProps }) => (
            <IconButton
              ref={
                actionMenuTriggerRef
                  ? mergeRefs([triggerRef, actionMenuTriggerRef])
                  : // Workaround for IconButton typing issue
                    mergeRefs([triggerRef])
              }
              icon={MoreIcon}
              label={`Move ${title}`}
              // appearance="default"
              // spacing="compact"
              {...triggerProps}
            />
          )}
        >
          <LazyDropdownItems id={id} issue={issue} canUpdate={canUpdate} canDelete={canDelete} />
        </DropdownMenu>
      </StackCharkra>
      {(issue.label?.title || dueDate) && (
        <StackCharkra mt={2} flexDir="row" justifyContent="start" alignItems="center" gap={2}>
          {issue.label?.title && (
            <Badge variant="outline" colorScheme="gray">
              <Text color="gray.500" fontSize="10px" fontWeight="700">
                {issue.label.title}
              </Text>
            </Badge>
          )}
          {dueDate && (
            <Badge variant="outline" colorScheme={isLate && !isDone ? 'red' : 'gray'}>
              <StackCharkra flexDir="row" alignItems="center" gap={1}>
                <IoCalendarOutline />
                <Text
                  color={isLate && !isDone ? 'red.400' : 'gray.500'}
                  fontSize="10px"
                  fontWeight="700"
                >
                  {dueDate}
                </Text>
              </StackCharkra>
            </Badge>
          )}
        </StackCharkra>
      )}
      <StackCharkra mt={2} flexDir="row" justifyContent="space-between" alignItems="center" gap={2}>
        <BadgeIssue content={`#${index}`} variant="outline" colorScheme={statusColor} />
        <StackCharkra flexDir="row" alignItems="center">
          {canUpdate ? (
            <InlineEditCustomSelect
              options={ISSUE_PRIORITY_OPTIONS.map((value) => ({
                label: <PriorityIssue priority={value} />,
                value,
              }))}
              defaultValue={
                issue?.priority && {
                  label: <PriorityIssue priority={issue.priority} hideText />,
                  value: issue.priority,
                }
              }
              size="sm"
              field="priority"
              issue={issue}
              statusId={columnId}
            />
          ) : (
            <PriorityIssue priority={issue.priority} hideText />
          )}
          {!canUpdate ? (
            <UserWithAvatar
              image={issue.assignee?.avatar || ''}
              size2="sm"
              label={issue.assignee?.userName || ''}
              hideText
            />
          ) : (
            <InlineEditCustomSelect
              size="sm"
              options={members.map((member) => ({
                label: member.userName,
                value: member.id,
                image: member.avatar,
              }))}
              statusId={columnId}
              defaultValue={
                issue.assignee
                  ? {
                      label: issue.assignee.userName,
                      value: issue.assignee.id,
                      image: issue.assignee.avatar,
                    }
                  : {
                      label: '',
                      value: '',
                      image:
                        'https://i.pinimg.com/1200x/bc/43/98/bc439871417621836a0eeea768d60944.jpg',
                    }
              }
              field="assignee"
              issue={issue}
            />
          )}
        </StackCharkra>
      </StackCharkra>

      {closestEdge && <DropIndicator edge={closestEdge} gap={token('space.100', '0')} />}
    </Stack>
  );
});

export const Card = memo(function Card({ item, columnId }: { item: Issue; columnId: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { id } = item;
  const [closestEdge, setClosestEdge] = useState<Edge | null>(null);
  const [state, setState] = useState<State>(idleState);

  const { permissions } = useProjectContext();
  const canUpdate = permissions.includes(ProjectPermissionEnum.IsIssueConfigurator);

  const actionMenuTriggerRef = useRef<HTMLButtonElement>(null);
  const { instanceId, registerCard } = useBoardContext();
  useEffect(() => {
    invariant(actionMenuTriggerRef.current);
    invariant(ref.current);
    return registerCard({
      cardId: id,
      entry: {
        element: ref.current,
        actionMenuTrigger: actionMenuTriggerRef.current,
      },
    });
  }, [registerCard, id]);

  useEffect(() => {
    if (!canUpdate) {
      return undefined;
    }
    const element = ref.current;
    invariant(element);
    return combine(
      draggable({
        element,
        getInitialData: () => ({ type: 'card', itemId: id, instanceId }),
        onGenerateDragPreview: ({ location, source, nativeSetDragImage }) => {
          const rect = source.element.getBoundingClientRect();

          setCustomNativeDragPreview({
            nativeSetDragImage,
            getOffset: preserveOffsetOnSource({
              element,
              input: location.current.input,
            }),
            render({ container }) {
              setState({ type: 'preview', container, rect });
              return () => setState(draggingState);
            },
          });
        },

        onDragStart: () => setState(draggingState),
        onDrop: () => setState(idleState),
      }),
      dropTargetForExternal({
        element,
      }),
      dropTargetForElements({
        element,
        canDrop: ({ source }) =>
          source.data.instanceId === instanceId && source.data.type === 'card',
        getIsSticky: () => true,
        getData: ({ input, element }) => {
          const data = { type: 'card', itemId: id };

          return attachClosestEdge(data, {
            input,
            element,
            allowedEdges: ['top', 'bottom'],
          });
        },
        onDragEnter: (args) => {
          if (args.source.data.itemId !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDrag: (args) => {
          if (args.source.data.itemId !== id) {
            setClosestEdge(extractClosestEdge(args.self.data));
          }
        },
        onDragLeave: () => {
          setClosestEdge(null);
        },
        onDrop: () => {
          setClosestEdge(null);
        },
      })
    );
  }, [instanceId, item, id, canUpdate]);

  return (
    <>
      <CardPrimitive
        ref={ref}
        item={item}
        state={state}
        columnId={columnId}
        closestEdge={closestEdge}
        actionMenuTriggerRef={actionMenuTriggerRef}
      />
      {state.type === 'preview' &&
        ReactDOM.createPortal(
          <Box
            style={{
              /**
               * Ensuring the preview has the same dimensions as the original.
               *
               * Using `border-box` sizing here is not necessary in this
               * specific example, but it is safer to include generally.
               */
              boxSizing: 'border-box',
              width: state.rect.width,
              height: state.rect.height,
            }}
          >
            <CardPrimitive item={item} state={state} columnId={columnId} closestEdge={null} />
          </Box>,
          state.container
        )}
    </>
  );
});
