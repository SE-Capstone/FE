import { useEffect, useRef, useState } from 'react';

import type { Editor } from '@tiptap/core';

export interface UseEditorStateReturn {
  isReady: boolean;
  editor: Editor | null;
  editorRef: React.MutableRefObject<{ editor: Editor | null }>;
}

export function useEditorState(isView: boolean = false): UseEditorStateReturn {
  const editorRef = useRef<{ editor: Editor | null }>({ editor: null });
  const [isReady, setIsReady] = useState(false);
  const [editor, setEditor] = useState<Editor | null>(null);

  useEffect(() => {
    if (editorRef.current?.editor) {
      setIsReady(true);
      setEditor(editorRef.current.editor);
      if (isView) {
        editorRef.current.editor.setOptions({
          editable: false,
        });
      }
    }
  }, [editorRef, editorRef.current?.editor, isView]);

  return { isReady, editor, editorRef };
}
