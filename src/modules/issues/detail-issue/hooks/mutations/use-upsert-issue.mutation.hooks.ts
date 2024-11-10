import { useCallback } from 'react';

import { useParams } from 'react-router-dom';

import { useUpsertCommentMutation } from '../../apis/upsert-comment.api';

import type { Editor } from '@tiptap/core';

export function useUpsertCommentHook(
  reset?: () => void,
  editor?: Editor | null,
  isUpdate?: boolean,
  id?: string
) {
  const { issueId } = useParams();

  const {
    mutate,
    isPending: isLoading,
    ...restData
  } = useUpsertCommentMutation({ id, isUpdate, reset });

  const handleUpsertComment = useCallback(async () => {
    if (isLoading) return;

    try {
      await mutate({
        body: {
          content: editor?.getHTML() || '',
          issueId: issueId || '',
        },
      });
    } catch (error) {}
  }, [editor, isLoading, mutate, issueId]);

  return {
    handleUpsertComment,
    isLoading,
    ...restData,
  };
}
