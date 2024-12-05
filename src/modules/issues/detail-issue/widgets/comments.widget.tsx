/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, Button, Stack, Text } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from 'reactjs-tiptap-editor';

import RichtextView from '../../list-issue/components/richtext-view';
import { UserWithAvatar } from '../../list-issue/components/user-with-avatar';
import { useEditorState } from '../../list-issue/hooks/use-editor-state';
import { useUpsertCommentHook } from '../hooks/mutations';
import { useRemoveCommentHook } from '../hooks/mutations/use-remove-comment.hooks';

import type { IComment } from '../../list-issue/types';

import { formatDateVN } from '@/libs/helpers';
import { useAuthentication } from '@/modules/profile/hooks';
import { extensions } from '@/modules/public/pages/rich-text-ex.pages';

export const CommentWidget = ({
  comment,
  index,
  isEditable = true,
  isComment = true,
}: {
  comment?: IComment;
  index: number;
  isEditable?: boolean;
  isComment?: boolean;
}) => {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment?.content || '');
  const { editor, editorRef } = useEditorState();

  const onChangeContent = (value: any) => {
    setEditValue(value);
  };

  useEffect(() => {
    setEditValue(comment?.content || '');
  }, [comment?.content]);

  const reset = () => {
    setEditValue('');
    if (editor) {
      editor.commands.setContent('');
    }
  };

  const { handleRemoveComment } = useRemoveCommentHook(comment?.id || '');
  const { handleUpsertComment } = useUpsertCommentHook(reset, editor, !!comment?.id, comment?.id);

  const handleSave = () => {
    handleUpsertComment();
  };

  return (
    <Stack key={index} gap={0}>
      <UserWithAvatar
        image={comment ? comment.user.avatar || '' : currentUser?.avatar || ''}
        label={comment ? comment.user.userName || '' : currentUser?.userName || ''}
        size={10}
        date={
          comment?.createdAt &&
          formatDateVN({
            date: comment?.updatedAt || comment?.createdAt,
            format: 'DD-MM-YYYY - HH:mm',
          })
        }
        stackProps={{ marginBottom: '10px' }}
      />
      <Text fontSize="sm" color="gray.500" />
      {isEditable ? (
        <InlineEdit
          defaultValue={editValue}
          keepEditViewOpenOnBlur
          isEditing={isEditing}
          readViewFitContainerWidth
          editButtonLabel={editValue}
          editView={({ errorMessage }) => (
            <RichTextEditor
              ref={editorRef}
              dark={false}
              label={t('common.comment')}
              output="html"
              content={editValue}
              extensions={extensions}
              onChangeContent={onChangeContent}
            />
          )}
          readView={() => (
            <Box
              id={!comment ? 'rich-view2' : 'rich-text-view3'}
              onClick={() => !isComment && setIsEditing(true)}
            >
              <RichtextView id={`richtext-view-${index}`} content={editValue} isComment />
            </Box>
          )}
          onConfirm={(value) => {
            if (JSON.stringify(value) !== JSON.stringify(comment?.content || '')) {
              setEditValue(value);
              handleSave();
            }
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <InlineEdit
          defaultValue={editValue}
          keepEditViewOpenOnBlur
          isEditing={false}
          readViewFitContainerWidth
          editButtonLabel={editValue}
          editView={({ errorMessage }) => <></>}
          readView={() => (
            <Box id={!comment ? 'rich-view2' : 'rich-text-view3'}>
              <RichtextView id={`richtext-view-${index}`} content={editValue} isComment />
            </Box>
          )}
          onConfirm={() => {}}
        />
      )}
      {comment && (
        <Stack display="flex" flexDir="row" alignItems="center" gap={2}>
          {isEditable && (
            <Button
              type="button"
              bg="transparent"
              color="gray.500"
              fontSize="sm"
              p={0}
              _hover={{
                color: 'gray.400',
                bg: 'transparent',
              }}
              onClick={() => setIsEditing(true)}
            >
              {t('actions.edit')}
            </Button>
          )}
          {isEditable && <Text>&#8226;</Text>}
          {isEditable && (
            <Button
              type="button"
              bg="transparent"
              color="gray.500"
              fontSize="sm"
              ml={-1}
              p={0}
              _hover={{
                color: 'gray.400',
                bg: 'transparent',
              }}
              onClick={handleRemoveComment}
            >
              {t('actions.delete')}
            </Button>
          )}
        </Stack>
      )}
    </Stack>
  );
};
