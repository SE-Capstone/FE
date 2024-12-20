import { useState } from 'react';

import { Container } from '@chakra-ui/react';
import RichTextEditor, {
  BaseKit,
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock,
  Color,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Image,
  Italic,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SlashCommand,
  Strike,
  Table,
  TextAlign,
  Emoji,
  Katex,
  TextDirection,
} from 'reactjs-tiptap-editor';

import 'reactjs-tiptap-editor/style.css';

export const extensions = [
  BaseKit.configure({
    characterCount: false,
    placeholder: {
      emptyEditorClass: 'is-editor-empty',
      emptyNodeClass: 'is-empty',
      placeholder: 'Add content...',
      showOnlyWhenEditable: false,
      showOnlyCurrent: true,
      includeChildren: false,
    },
  }),
  Blockquote,
  Bold,
  BulletList,
  Code,
  CodeBlock.configure({ defaultTheme: 'dracula' }),
  Color,
  FontFamily,
  FontSize,
  Heading,
  Highlight,
  History,
  HorizontalRule,
  Image.configure({
    upload: (files: File) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onloadend = () => {
          const base64String = reader.result;
          resolve(base64String as any);
        };

        reader.onerror = (error) => {
          reject(error);
        };

        reader.readAsDataURL(files);
      }),
  }),
  Italic,
  LineHeight,
  Link,
  MoreMark,
  OrderedList,
  SlashCommand,
  Strike,
  Table,
  TextAlign,
  Emoji,
  Katex,
  TextDirection,
];

const DEFAULT = '';

export default function RichTextExample() {
  const [content, setContent] = useState(DEFAULT);

  const onChangeContent = (value: any) => {
    setContent(value);
  };

  return (
    <Container mt={5}>
      <RichTextEditor
        dark={false}
        label="Editor"
        output="html"
        content={content}
        extensions={extensions}
        onChangeContent={onChangeContent}
      />
    </Container>
  );
}
