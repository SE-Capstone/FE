import { useEffect, useState } from 'react';

import { Box } from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import RichTextEditor from 'reactjs-tiptap-editor';

import { useEditorState } from '../hooks/use-editor-state';

import { extensions } from '@/modules/public/pages/rich-text-ex.pages';

const RichtextView = ({
  id,
  content,
  isComment,
}: {
  id: string;
  content: any;
  isComment?: boolean;
}) => {
  const { t } = useTranslation();
  const [editValue, setEditValue] = useState(content || '');
  const { editorRef } = useEditorState(true);

  useEffect(() => {
    // eslint-disable-next-line react/destructuring-assignment
    setEditValue(content.content || '');
  }, [content]);

  useEffect(() => {
    document
      ?.getElementById(id)
      ?.childNodes[0]?.childNodes[0]?.childNodes[0]?.childNodes[0].remove();
  }, [id]);

  return (
    <Box id={isComment ? 'rich-text-view2' : 'rich-text-view'}>
      <Box id={id}>
        <RichTextEditor
          ref={editorRef}
          dark={false}
          label={t('fields.description')}
          output="html"
          content={editValue}
          extensions={extensions}
        />
      </Box>
    </Box>
  );
};

export default RichtextView;
