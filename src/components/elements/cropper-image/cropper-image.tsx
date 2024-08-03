import { useRef, useState } from 'react';

import { Skeleton, ButtonGroup, Button, Box, Icon, IconButton } from '@chakra-ui/react';
import 'cropperjs/dist/cropper.css';
import Cropper from 'react-cropper';
import { FiRotateCw } from 'react-icons/fi';
import { TbFlipHorizontal, TbFlipVertical } from 'react-icons/tb';

import type { ReactCropperElement } from 'react-cropper';

export interface CropperImageProps {
  initSrc: string;
  getCroppedFile: (img: string) => void;
}

export function CropperImage(props: CropperImageProps) {
  const { getCroppedFile, initSrc } = props;

  const cropperRef = useRef<ReactCropperElement>(null);
  const [loading, setLoading] = useState(true);
  const [scaleX, setScaleX] = useState(1);
  const [scaleY, setScaleY] = useState(1);

  const handleClick = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    if (!cropper) return;

    const img = cropper.getCroppedCanvas().toDataURL();
    getCroppedFile(img);
  };

  const rotate = () => {
    const imageElement = cropperRef?.current;

    const cropper = imageElement?.cropper;

    if (!cropper) return;

    cropper.rotate(90);
  };

  const flip = (type: 'h' | 'v') => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;

    if (!cropper) return;

    if (type === 'h') {
      cropper.scaleX(scaleX === 1 ? -1 : 1);
      setScaleX(scaleX === 1 ? -1 : 1);
    } else {
      cropper.scaleY(scaleY === 1 ? -1 : 1);
      setScaleY(scaleY === 1 ? -1 : 1);
    }
  };
  return (
    <>
      {loading && <Skeleton width="100%" height={25} />}

      {!loading && (
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <ButtonGroup variant="contained">
            <IconButton
              aria-label="Rotate"
              variant="unstyled"
              icon={<Icon boxSize={5} as={FiRotateCw} onClick={rotate} />}
            />
            <IconButton
              aria-label="Rotate"
              variant="unstyled"
              icon={<Icon boxSize={5} as={TbFlipHorizontal} onClick={() => flip('h')} />}
            />
            <IconButton
              aria-label="Rotate"
              variant="unstyled"
              icon={<Icon boxSize={5} as={TbFlipVertical} onClick={() => flip('v')} />}
            />
          </ButtonGroup>
        </Box>
      )}

      <Cropper
        ref={cropperRef}
        src={initSrc}
        guides={false}
        ready={() => {
          setLoading(false);
        }}
        style={{ height: 400, width: '100%' }}
        // Cropper.js options
        initialAspectRatio={16 / 9}
      />
      <Button
        sx={{
          float: 'right',
          mt: 4,
        }}
        autoFocus
        w={20}
        isDisabled={loading}
        onClick={handleClick}
      >
        Crop
      </Button>
    </>
  );
}
