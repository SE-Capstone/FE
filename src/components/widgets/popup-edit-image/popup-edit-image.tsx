import type { CropperImageProps, ModalBaseProps } from '@/components/elements';
import type { UseDisclosureProps } from '@chakra-ui/react';

import { CropperImage, ModalBase } from '@/components/elements';

export interface PopupEditImageProps {
  children: React.ReactElement;
  cropperImageProps: CropperImageProps;
  modalBaseProps?: Omit<ModalBaseProps, 'triggerButton' | keyof UseDisclosureProps>;
}

export function PopupEditImage(props: PopupEditImageProps) {
  const { children, cropperImageProps, modalBaseProps } = props;
  const { initSrc, getCroppedFile } = cropperImageProps || {};

  return (
    <ModalBase size="xl" title="Crop image" triggerButton={() => children} {...modalBaseProps}>
      {({ onClose }) => {
        const handleCropfile = (img: string) => {
          onClose && onClose();
          getCroppedFile(img);
        };
        return <CropperImage initSrc={initSrc} getCroppedFile={handleCropfile} />;
      }}
    </ModalBase>
  );
}
