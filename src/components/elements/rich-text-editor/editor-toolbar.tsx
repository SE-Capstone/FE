import BlotFormatter from 'quill-blot-formatter/dist/BlotFormatter';
import { ImageDrop } from 'quill-image-drop-module';
import { Quill } from 'react-quill';

// Custom Undo button icon component for Quill editor. You can import it directly
// from 'quill/assets/icons/undo.svg' but I found that a number of loaders do not
// handle them correctly
const CustomUndo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="6 10 4 12 2 10 6 10" />
    <path className="ql-stroke" d="M8.09,13.91A4.6,4.6,0,0,0,9,14,5,5,0,1,0,4,9" />
  </svg>
);

// Redo button icon component for Quill editor
const CustomRedo = () => (
  <svg viewBox="0 0 18 18">
    <polygon className="ql-fill ql-stroke" points="12 10 14 12 16 10 12 10" />
    <path className="ql-stroke" d="M9.91,13.91A4.6,4.6,0,0,1,9,14a5,5,0,1,1,5-5" />
  </svg>
);

// Undo and redo functions for Custom Toolbar
export function undoChange() {
  // @ts-ignore
  this.quill.history.undo();
}

export function redoChange() {
  // @ts-ignore
  this.quill.history.redo();
}

// Add sizes to whitelist and register them
const Size = Quill.import('formats/size');
Size.whitelist = ['extra-small', 'small', 'medium', 'large'];
Quill.register(Size, true);
// Add fonts to whitelist and register them
const Font = Quill.import('formats/font');
Font.whitelist = ['arial', 'comic-sans', 'courier-new', 'georgia', 'helvetica', 'lucida'];
Quill.register(Font, true);

// Blot formatter module
Quill.register('modules/blotFormatter', BlotFormatter);

// Image Drop module
Quill.register('modules/imageDrop', ImageDrop);

// Modules object for setting up the Quill editor

// Formats objects for setting up the Quill editor
export const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'align',
  'strike',
  'script',
  'blockquote',
  'background',
  'list',
  'bullet',
  'indent',
  'link',
  'image',
  'color',
  'code-block',
];

// Quill Toolbar component
export const EditorToolbar = () => (
  <div id="toolbar">
    <span className="ql-formats">
      <select className="ql-font" defaultValue="arial">
        <option value="arial">Arial</option>
        <option value="comic-sans">Comic Sans</option>
        <option value="courier-new">Courier New</option>
        <option value="georgia">Georgia</option>
        <option value="helvetica">Helvetica</option>
        <option value="lucida">Lucida</option>
      </select>
      <select className="ql-size" defaultValue="small">
        <option value="small">Size 1</option>
        <option value="medium">Size 2</option>
        <option value="large">Size 3</option>
      </select>
      <select className="ql-header" defaultValue="false">
        <option value="1">Heading 1</option>
        <option value="2">Heading 2</option>
        <option value="3">Heading 3</option>
        <option value="4">Heading 4</option>
        <option value="5">Heading 5</option>
        <option value="6">Heading 6</option>
        <option value="false">Normal</option>
      </select>
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-bold" />
      <button type="button" className="ql-italic" />
      <button type="button" className="ql-underline" />
      <button type="button" className="ql-strike" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-list" value="ordered" />
      <button type="button" className="ql-list" value="bullet" />
      <button type="button" className="ql-indent" value="-1" />
      <button type="button" className="ql-indent" value="+1" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-script" value="super" />
      <button type="button" className="ql-script" value="sub" />
      <button type="button" className="ql-blockquote" />
      <button type="button" className="ql-direction" />
    </span>
    <span className="ql-formats">
      <select className="ql-align" />
      <select className="ql-color" />
      <select className="ql-background" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-link" />
      <button type="button" className="ql-image" />
      {/* <button type="button" className="ql-video" /> */}
      {/* <button type="button" className="ql-emoji" /> */}
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-formula" />
      <button type="button" className="ql-code-block" />
      <button type="button" className="ql-clean" />
    </span>
    <span className="ql-formats">
      <button type="button" className="ql-undo">
        <CustomUndo />
      </button>
      <button type="button" className="ql-redo">
        <CustomRedo />
      </button>
    </span>
  </div>
);
