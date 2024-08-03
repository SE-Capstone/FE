/* eslint-disable eslint-comments/no-unlimited-disable */
import React, { useCallback, useEffect } from 'react';

import { Box, HStack, Icon, Image, Spinner, Stack, StackDivider, Text } from '@chakra-ui/react';
import { BiCrop, BiImageAdd, BiPencil, BiTrash } from 'react-icons/bi';
import { MdRemoveRedEye } from 'react-icons/md';

import { PreviewImage } from '../preview-image';

import type { StackProps, ImageProps } from '@chakra-ui/react';

import { PopupEditImage } from '@/components/widgets';
import { MAX_SIZE_IMAGE, REGEX_FILE_TYPE_IMAGES } from '@/configs';
import { notify } from '@/libs/helpers';

interface ImagePreviewProps {
  src: string;
  file: File;

  id?: number | null;

  hasDelete?: boolean;
  hasEdit?: boolean;
  hasCrop?: boolean;

  imageProps?: ImageProps;
  wrapperProps?: StackProps;
}
function BoxWrapper(props: StackProps) {
  return (
    <Stack
      spacing={0.5}
      w={30}
      h={30}
      align="center"
      justify="center"
      rounded={1}
      cursor="pointer"
      position="relative"
      role="group"
      {...props}
    />
  );
}

const MAX_FILES = 10;

interface ImagesUploadProps {
  isMultiple?: boolean;
  initImages: Omit<ImagePreviewProps, 'file'>[];
  handleUploadFiles: (files: File[]) => void;
  handleRemoveImage?: (id: number, onSuccess?: () => void) => void;
  loading?: boolean;
  accept?: string;
  maxFiles?: number;
}
export function ImagesUpload(props: ImagesUploadProps) {
  const {
    isMultiple = false,
    loading = false,
    initImages,
    handleUploadFiles,
    handleRemoveImage,
    accept = 'image/*',
    maxFiles = MAX_FILES,
  } = props;

  const [filePreview, setFilePreview] = React.useState<ImagePreviewProps[]>([]);

  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initImages || !initImages?.length) return;

    const listNewFiles = initImages.reduce<ImagePreviewProps[]>((acc, { src, ...rest }) => {
      acc.push({
        file: new File([src], src),
        src,
        ...rest,
      });
      return acc;
    }, []);
    setFilePreview(listNewFiles);
  }, [initImages]);

  useEffect(
    () => () => {
      filePreview.forEach(({ src }) => URL.revokeObjectURL(src));
    },
    [filePreview]
  );

  const handleClickOpenFile = React.useCallback(() => {
    inputRef.current?.click();
  }, []);

  const onDeleteFile = useCallback(
    function (e: React.MouseEvent<SVGElement>, index: number, id?: number) {
      e.stopPropagation();

      if (id && handleRemoveImage) {
        handleRemoveImage(id, () => {
          URL.revokeObjectURL(filePreview[index].src);

          setFilePreview((prev) => prev.filter((_, i) => i !== index));
        });
      }
    },
    [filePreview, handleRemoveImage]
  );

  function handleFilesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { files } = e.target;

    if (!files || !files.length) return;

    if (files.length > MAX_FILES - filePreview.length) {
      notify({ type: 'error', message: `Chỉ được chọn tối đa ${MAX_FILES} ảnh.` });
      return;
    }

    const isValidFileSize = [...files].every((file) => file.size <= MAX_SIZE_IMAGE);

    if (!isValidFileSize) {
      notify({ type: 'error', message: 'Ảnh không quá 5MB.' });
      return;
    }

    const isValidFileImages =
      accept === 'image/*' && [...files].some((file) => file.name.match(REGEX_FILE_TYPE_IMAGES));

    if (!isValidFileImages) {
      notify({
        type: 'error',
        message: 'Ảnh không hợp lệ. Bao gồm: .png, .jpg, .jpeg, .heic, .heif',
      });

      return;
    }

    const listNewFiles = [...files].reduce<ImagePreviewProps[]>((acc, file) => {
      const fileUrl = URL.createObjectURL(file);

      acc.push({
        file,
        src: fileUrl,
      });
      return acc;
    }, []);

    handleUploadFiles(listNewFiles.map(({ file }) => file));

    setFilePreview((prev) => [...prev, ...listNewFiles]);

    // Trick to select same file again: https://stackoverflow.com/questions/39484895/how-to-allow-input-type-file-to-select-the-same-file-in-react-component
    // @ts-ignore
    e.target.value = null;
  }

  function handleEditFile() {
    handleClickOpenFile();
  }

  return (
    <HStack flexWrap="wrap" gap={3} spacing={0}>
      {filePreview.length > 0
        ? filePreview.map(
            ({ src, id, hasDelete = true, hasCrop = false, hasEdit = true, imageProps }, index) => (
              <BoxWrapper key={index} border={loading ? '1px solid #ccc' : undefined}>
                {loading ? (
                  <Spinner size="md" />
                ) : (
                  <>
                    <Image
                      src={src}
                      pos="absolute"
                      top={0}
                      left={0}
                      bg="transparent 50% no-repeat"
                      bgSize="contain"
                      w="full"
                      h="inherit"
                      rounded={1}
                      {...imageProps}
                    />

                    <Box
                      pos="absolute"
                      left={0}
                      right={0}
                      bottom={0}
                      display="none"
                      _groupHover={
                        // hasCrop || hasDelete || hasEdit ? { display: 'block' } : undefined
                        { display: 'block' }
                      }
                    >
                      <HStack
                        w="full"
                        justify="space-around"
                        bg="rgba(0,0,0,.3)"
                        divider={<StackDivider color="white" />}
                        p={1}
                        spacing={0.5}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {hasCrop && (
                          <PopupEditImage
                            cropperImageProps={{
                              initSrc: src,
                              getCroppedFile(img) {
                                setFilePreview((prev) => {
                                  const clonePrev = [...prev];
                                  // console.log('clonePrev: ', clonePrev[index].src);

                                  clonePrev[index] = {
                                    ...clonePrev[index],
                                    src: img,
                                    file: new File([img], clonePrev[index].file.name),
                                  };

                                  // console.log('after crop', img);
                                  // console.log('after crop', new File([img], clonePrev[index].file.name));

                                  handleUploadFiles(clonePrev.map(({ file }) => file));

                                  return clonePrev;
                                });
                              },
                            }}
                          >
                            <Icon as={BiCrop} boxSize={4} color="white" />
                          </PopupEditImage>
                        )}

                        <PreviewImage>
                          {({ openPreview }) => (
                            <Icon
                              as={MdRemoveRedEye}
                              boxSize={4}
                              color="white"
                              shadow="md"
                              onClick={(e) => {
                                e.preventDefault();
                                openPreview(src, '');
                              }}
                            />
                          )}
                        </PreviewImage>

                        {hasEdit && (
                          <Icon
                            as={BiPencil}
                            boxSize={4}
                            color="white"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditFile();
                            }}
                          />
                        )}

                        {hasDelete ? (
                          <Icon
                            as={BiTrash}
                            boxSize={4}
                            color="white"
                            onClick={(e) => onDeleteFile(e, index, id || undefined)}
                          />
                        ) : null}
                      </HStack>
                    </Box>
                  </>
                )}
              </BoxWrapper>
            )
          )
        : null}
      {filePreview.length >= maxFiles ? null : (
        <BoxWrapper
          border="1px"
          borderStyle="dashed"
          borderColor="orange.300"
          _hover={{
            borderColor: 'orange.500',
          }}
          onClick={!loading ? handleClickOpenFile : undefined}
        >
          {loading ? (
            <Spinner size="md" />
          ) : (
            <Stack align="center" justify="center">
              <Icon as={BiImageAdd} boxSize={4} />
              <Text fontSize="xxs" lineHeight={4} textAlign="center">
                Thêm hình ảnh {isMultiple ? `${filePreview.length}/${MAX_FILES}` : ''}
              </Text>
            </Stack>
          )}
        </BoxWrapper>
      )}

      <input
        ref={inputRef}
        type="file"
        disabled={loading}
        hidden
        multiple={isMultiple}
        onChange={handleFilesChange}
      />
    </HStack>
  );
}
