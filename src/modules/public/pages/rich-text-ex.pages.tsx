/* eslint-disable react/button-has-type */

import { useCallback } from 'react';

import { Container } from '@chakra-ui/react';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
// import Dropcursor from '@tiptap/extension-dropcursor';
import Gapcursor from '@tiptap/extension-gapcursor';
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import FileHandler from '@tiptap-pro/extension-file-handler';
import { all, createLowlight } from 'lowlight';
import '../scss/style.scss';

const lowlight = createLowlight(all);
// define your extension array
const extensions = [
  StarterKit,
  CodeBlockLowlight.configure({
    lowlight,
  }),
  TextAlign.configure({
    types: ['heading', 'paragraph'],
  }),
  Highlight,
  Gapcursor,
  Table.configure({
    resizable: true,
  }),
  TableRow,
  TableHeader,
  TableCell,
  Image,
  Link.configure({
    openOnClick: false,
    autolink: true,
    defaultProtocol: 'https',
  }),
  Placeholder,
  FileHandler.configure({
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp'],
    onDrop: (currentEditor, files, pos) => {
      files.forEach((file) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(pos, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
    onPaste: (currentEditor, files, htmlContent) => {
      files.forEach((file) => {
        if (htmlContent) {
          // if there is htmlContent, stop manual insertion & let other extensions handle insertion via inputRule
          // you could extract the pasted file from this url string and upload it to a server for example
          console.log(htmlContent); // eslint-disable-line no-console
          return false;
        }

        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);
        fileReader.onload = () => {
          currentEditor
            .chain()
            .insertContentAt(currentEditor.state.selection.anchor, {
              type: 'image',
              attrs: {
                src: fileReader.result,
              },
            })
            .focus()
            .run();
        };
      });
    },
  }),
];
// const extensions = [Document, Paragraph, Text, Code, Typography];

const content = '<p>Hello World!</p>';

// const doc = new Y.Doc();

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          className={editor.isActive('bold') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          Bold
        </button>
        <button
          className={editor.isActive('italic') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          Italic
        </button>
        <button
          className={editor.isActive('strike') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          Strike
        </button>
        <button
          className={editor.isActive('code') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>Clear marks</button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>Clear nodes</button>
        <button
          className={editor.isActive('paragraph') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().setParagraph().run()}
        >
          Paragraph
        </button>
        <button
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        >
          H1
        </button>
        <button
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </button>
        <button
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </button>
        <button
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        >
          H4
        </button>
        <button
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
        >
          H5
        </button>
        <button
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
        >
          H6
        </button>
        <button
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          Bullet list
        </button>
        <button
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          Ordered list
        </button>
        <button
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code block
        </button>
        <button
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>Hard break</button>
        <button onClick={() => editor.chain().focus().undo().run()}>Undo</button>
        <button onClick={() => editor.chain().focus().redo().run()}>Redo</button>
        <button
          className="{ 'is-active': editor.isActive('highlight') }"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          Highlight
        </button>
        <button
          className="{ 'is-active': editor.isActive({ textAlign: 'left' }) }"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
        >
          Left
        </button>
        <button
          className="{ 'is-active': editor.isActive({ textAlign: 'center' }) }"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
        >
          Center
        </button>
        <button
          className="{ 'is-active': editor.isActive({ textAlign: 'right' }) }"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
        >
          Right
        </button>
        <button
          className="{ 'is-active': editor.isActive({ textAlign: 'justify' }) }"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        >
          Justify
        </button>
      </div>
    </div>
  );
};

export default function RichTextExample() {
  const editor = useEditor({
    extensions,
    content,
  });

  const setLink = useCallback(() => {
    if (!editor) {
      return null;
    }
    const previousUrl = editor.getAttributes('link').href;
    // eslint-disable-next-line no-alert
    const url = window.prompt('URL', previousUrl);

    // cancelled
    if (url === null) {
      return undefined;
    }

    // empty
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();

      return undefined;
    }

    // update link
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    return undefined;
  }, [editor]);
  if (!editor) {
    return null;
  }
  // useEffect(() => {
  //   const provider = new TiptapCollabProvider({
  //     name: 'secapstone',
  //     appId: '0k355r95',
  //     token: 'FKkdisW82ZVT41UjWFhZzpbJ9HW4euZGzeSgSu33vazj4cpN2bL7RSmAxQV76a6D',
  //     document: doc,
  //   });
  // }, []);

  return (
    <Container mt={5}>
      <MenuBar editor={editor} />
      <div className="button-group">
        <button className={editor.isActive('link') ? 'is-active' : ''} onClick={setLink}>
          Set link
        </button>
        <button
          disabled={!editor.isActive('link')}
          onClick={() => editor.chain().focus().unsetLink().run()}
        >
          Unset link
        </button>
      </div>
      <Container mt={2} border="1px" borderRadius={2} p={2} minHeight="200px">
        <EditorContent editor={editor} cellPadding={5} />
      </Container>
    </Container>
  );
}
