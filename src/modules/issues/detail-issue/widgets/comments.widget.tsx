import { useState } from 'react';

import { Button, Stack } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from 'reactjs-tiptap-editor';

import { UserWithAvatar } from '../../list-issue/components/user-with-avatar';
import { useEditorState } from '../../list-issue/hooks/use-editor-state';

import { useAuthentication } from '@/modules/profile/hooks';
import { extensions } from '@/modules/public/pages/rich-text-ex.pages';

export const CommentWidget = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuthentication();
  const [content, setContent] = useState('');
  const { editor, editorRef } = useEditorState();

  const onChangeContent = (value: any) => {
    setContent(value);
  };

  return (
    <Stack>
      <UserWithAvatar
        image={currentUser?.avatar || ''}
        label={currentUser?.fullName || ''}
        size={10}
        stackProps={{ marginBottom: '10px' }}
      />
      <RichTextEditor
        ref={editorRef}
        dark={false}
        label={t('fields.description')}
        output="html"
        content={content}
        extensions={extensions}
        onChangeContent={onChangeContent}
      />
      <Stack align="end">
        <Button type="submit">{t('common.submit')}</Button>
      </Stack>
    </Stack>
  );
};
