import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';

import {
  FormControl,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  Stack,
  Text,
  Icon,
  HStack,
  Tooltip,
} from '@chakra-ui/react';
import { useController, useFormContext } from 'react-hook-form';
import { BiTrash } from 'react-icons/bi';

import type { CustomInputProps } from '../custom-input';
import type { FormLabelProps, StackProps } from '@chakra-ui/react';
import type { FieldValues } from 'react-hook-form';
import type { Control, FieldPathByValue } from 'react-hook-form/dist/types';

import { validateFiles } from '@/libs/helpers';

type FileUploadProps<TFormValues extends FieldValues> = Omit<
  CustomInputProps,
  'name' | 'children'
> & {
  initUrl?: string;

  displayFileName?: boolean;
  types?: Array<'image' | 'video' | 'pdf' | 'word'>;
  acceptedFileTypes?: string;
  control?: Control<TFormValues>;
  name: FieldPathByValue<TFormValues, any>;
  label?: string;
  trigger: (url: string) => React.ReactElement;

  children?: (url: string) => React.ReactNode;

  stackProps?: StackProps;
  labelProps?: FormLabelProps;
};

export const FileUpload = <TFormValues extends FieldValues>({
  name,
  initUrl = '',
  control,
  isRequired = false,
  types = ['image'],
  error,
  displayFileName = false,
  controlProps,
  acceptedFileTypes = 'image/*',
  labelProps,
  label,
  stackProps,
  trigger,
  children,
  ...inputFileProps
}: FileUploadProps<TFormValues>) => {
  const inputRef = React.useRef<HTMLInputElement>() as React.RefObject<HTMLInputElement>;
  const {
    field: { ref: _ref, value: _value, ...field },
  } = useController<TFormValues>({
    name,
    control,
    rules: { required: isRequired },
  });

  const isError = !!error;

  const [filePreview, setFilePreview] = useState(initUrl);
  const [fileName, setFileName] = useState<string | null>(null);

  const { setError, clearErrors } = useFormContext<TFormValues>();

  useEffect(
    () => () => {
      window.URL.revokeObjectURL(filePreview);
    },
    [filePreview]
  );

  const triggerBtn = React.cloneElement(trigger(filePreview), {
    onClick() {
      inputRef.current?.click();
    },
  });

  const childrenClone = children
    ? React.cloneElement(children(filePreview) as ReactElement, {
        onClick: (e?: React.MouseEvent) => {
          e?.preventDefault();
        },
      })
    : undefined;

  function handleDeletePreview(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    e.preventDefault();
    setFilePreview('');
    setFileName(null);
    clearErrors(name);
    field.onChange(null as any);
  }

  return (
    <FormControl
      isInvalid={inputFileProps.isInvalid || !!error}
      isRequired={isRequired}
      {...controlProps}
    >
      <FormLabel
        color="black"
        opacity={0.75}
        fontSize={{ base: 'xs', md: 'sm' }}
        lineHeight="18px"
        fontWeight={500}
        {...labelProps}
      >
        {label && <Text mb={2}>{label}</Text>}
        <Stack pos="relative" spacing={4} {...stackProps} onClick={(e) => e.preventDefault()}>
          {childrenClone}
          <HStack spacing={2} onClick={(e) => e.preventDefault()}>
            {triggerBtn}
            {filePreview && (
              <Tooltip label="Xoá" placement="top" hasArrow onClick={(e) => e.preventDefault()}>
                <IconButton
                  aria-label="DeleteImage"
                  variant="ghost"
                  size="md"
                  shadow="md"
                  icon={<Icon as={BiTrash} boxSize={4} color="red.400" />}
                  onClick={handleDeletePreview}
                />
              </Tooltip>
            )}
          </HStack>
          {displayFileName && fileName && <Text>{fileName}</Text>}
          {isError && <Text color="red.500">{error?.message}</Text>}
        </Stack>
      </FormLabel>
      <InputGroup>
        <Input
          ref={inputRef}
          type="file"
          accept={acceptedFileTypes}
          hidden
          {...inputFileProps}
          {...field}
          onChange={(e) => {
            const file = e.target?.files?.[0];
            if (!file) return;

            const { isValid, message } = validateFiles([file], types);

            if (!isValid) {
              setError(name, { message }, { shouldFocus: true });

              return;
            }

            setFileName(file.name);
            setFilePreview(URL.createObjectURL(file));
            if (error) clearErrors(name);
            field.onChange(file as any);
          }}
        />
      </InputGroup>
    </FormControl>
  );
};
