import React from 'react';

import { Image } from '@chakra-ui/react';

import type { ImageProps } from '@chakra-ui/react';

import { ModalBase } from '@/components/elements';

interface ChildrenRenderProps {
  openPreview: (image: string, title: string) => void;
  closePreview: () => void;
}

export interface PreviewImageProps {
  children: (props: ChildrenRenderProps) => React.ReactNode;
  imagePreviewProps?: ImageProps;
}

export function PreviewImage(props: PreviewImageProps) {
  const { children, imagePreviewProps } = props;
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState('');
  const [previewTitle, setPreviewTitle] = React.useState('');

  const handleCancel = React.useCallback(() => {
    setPreviewOpen(false);
    setPreviewImage('');
    setPreviewTitle('');
  }, []);

  const handleOpen = React.useCallback((image: string, title: string) => {
    setPreviewImage(image);
    setPreviewTitle(title || '');
    setPreviewOpen(true);
  }, []);

  return (
    <>
      {children({
        openPreview: handleOpen,
        closePreview: handleCancel,
      })}
      <ModalBase
        motionPreset="slideInBottom"
        title={previewTitle}
        isOpen={previewOpen}
        onClose={handleCancel}
      >
        <Image
          alt={previewTitle}
          style={{ width: '100%' }}
          objectFit="cover"
          src={previewImage}
          {...imagePreviewProps}
        />
      </ModalBase>
    </>
  );
}
