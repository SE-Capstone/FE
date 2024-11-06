import { useState } from 'react';

import InlineEdit from '@atlaskit/inline-edit';
import { Box, xcss } from '@atlaskit/primitives';
import RichTextEditor from 'reactjs-tiptap-editor';

import { extensions } from '@/modules/public/pages/rich-text-ex.pages';

const readViewContainerStyles = xcss({
  font: 'font.body',
  paddingBlock: 'space.100',
  paddingInline: 'space.075',
  wordBreak: 'break-word',
});

const InlineEditRichtext = () => {
  const initialValue = 'Default team name value';
  const [editValue, setEditValue] = useState('Pyxis');

  return (
    <Box paddingInlineStart="space.100" paddingInlineEnd="space.600">
      <InlineEdit
        defaultValue={editValue}
        label="Team name"
        keepEditViewOpenOnBlur
        editButtonLabel={editValue || initialValue}
        editView={({ errorMessage }) => (
          <RichTextEditor dark={false} output="html" content="" extensions={extensions} />
        )}
        readView={() => (
          <Box xcss={readViewContainerStyles} testId="read-view">
            {editValue || initialValue}
          </Box>
        )}
        onConfirm={(value) => setEditValue(value)}
      />
    </Box>
  );
};

export default InlineEditRichtext;
