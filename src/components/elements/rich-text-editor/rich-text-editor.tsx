import React, { useRef } from 'react';

import { Box } from '@chakra-ui/react';
import ReactQuill from 'react-quill';

import { EditorToolbar, formats, redoChange, undoChange } from './editor-toolbar';

import type { DeltaStatic, Sources } from 'quill';

import { notify, readFileToBase64, validateFiles } from '@/libs/helpers';

import 'react-quill/dist/quill.snow.css';

interface RichTextEditorProps {
  isDisabled?: boolean;
  value: string | undefined;
  onEditorChange: (value: string | undefined) => void;
}

export const RichTextEditor = (props: RichTextEditorProps) => {
  const { isDisabled, value, onEditorChange } = props;

  const [state, setState] = React.useState<{ value: string | undefined }>({ value: undefined });

  const quillRef = useRef<ReactQuill>(null);

  React.useEffect(() => {
    setState({ value });
  }, [value]);

  const handleChange = (
    value: string,
    _delta: DeltaStatic,
    _source: Sources,
    quillRef: ReactQuill.UnprivilegedEditor
  ) => {
    const length = quillRef?.getText().trim().length;

    setState({ value });

    onEditorChange(length > 0 ? value : undefined);
  };

  const imageHandler = () => {
    if (!quillRef.current) return;

    const editor = quillRef.current.getEditor();
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input?.files?.[0];

      if (!file) return;

      // max size 500 kb
      const { isValid, message } = validateFiles([file], 'image', 500 * 1024);

      if (!isValid) {
        notify({
          type: 'error',
          message,
        });
        return;
      }

      if (file) {
        readFileToBase64(file)
          .then((base64String) => {
            editor.insertEmbed(editor.getSelection() as unknown as number, 'image', base64String);
          })
          .catch((err) => {
            notify({
              type: 'error',
              message: err.message,
            });
          })
          .finally(() => {
            input.remove();
          });
      }
    };
  };

  const modulesQuill = React.useMemo(
    () => ({
      imageDrop: true,
      toolbar: {
        container: '#toolbar',
        handlers: {
          undo: undoChange,
          redo: redoChange,
          image: imageHandler,
        },
      },
      blotFormatter: {},

      history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
      },
      clipboard: {
        // toggle to add extra line breaks when pasting HTML:
        matchVisual: false,
      },
    }),
    []
  );

  return (
    <Box
      __css={{
        '& .ql-editor': {
          minH: '200px',
        },
        '& .ql-toolbar.ql-snow': {
          borderColor: 'transparent',
        },
        '& .ql-container.ql-snow': {
          borderColor: 'transparent',
          borderTopColor: 'rgb(226,232,240)',
        },
        '& .ql-container.ql-snow:focus': {
          borderColor: 'rgb(226,232,240)',
        },
      }}
      border="1px"
      borderColor="rgb(226,232,240)"
      rounded={2}
    >
      <EditorToolbar />
      <ReactQuill
        ref={quillRef}
        readOnly={isDisabled}
        theme="snow"
        value={state.value}
        placeholder="Write something awesome..."
        modules={modulesQuill}
        formats={formats}
        style={{
          borderColor: 'red',
        }}
        onChange={handleChange}
      />
    </Box>
  );
};
