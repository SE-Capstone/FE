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
import type { StackProps } from '@chakra-ui/react';
import type { FieldValues } from 'react-hook-form';
import type { Control, FieldPathByValue } from 'react-hook-form/dist/types';

import { validateFiles } from '@/libs/helpers';

type FileUploadProps<TFormValues extends FieldValues> = Omit<
  CustomInputProps,
  'name' | 'children'
> & {
  initUrl?: string;

  acceptedFileTypes?: string;
  control?: Control<TFormValues>;
  name: FieldPathByValue<TFormValues, any>;
  trigger: (url: string) => React.ReactElement;

  children?: (url: string) => React.ReactNode;

  stackProps?: StackProps;
};

export const FileUpload = <TFormValues extends FieldValues>({
  name,
  initUrl = '',
  control,
  isRequired = false,
  error,
  controlProps,
  labelProps,
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
    clearErrors(name);
    field.onChange(null as any);
  }

  return (
    <FormControl
      isInvalid={inputFileProps.isInvalid || !!error}
      isRequired={isRequired}
      {...controlProps}
    >
      <FormLabel {...labelProps}>
        <Stack pos="relative" spacing={4} {...stackProps} onClick={(e) => e.preventDefault()}>
          {childrenClone}
          <HStack spacing={2} onClick={(e) => e.preventDefault()}>
            {filePreview && (
              <Tooltip label="Xoá" placement="top" hasArrow onClick={(e) => e.preventDefault()}>
                <IconButton
                  aria-label="DeleteImage"
                  variant="ghost"
                  size="sm"
                  shadow="md"
                  icon={<Icon as={BiTrash} boxSize={4} color="red.400" />}
                  onClick={handleDeletePreview}
                />
              </Tooltip>
            )}
            {triggerBtn}
          </HStack>
          {isError && <Text color="red.500">{error?.message}</Text>}
        </Stack>
      </FormLabel>
      <InputGroup>
        <Input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          {...inputFileProps}
          {...field}
          onChange={(e) => {
            const file = e.target?.files?.[0];
            if (!file) return;

            const { isValid, message } = validateFiles([file]);

            if (!isValid) {
              setError(name, { message }, { shouldFocus: true });

              return;
            }

            setFilePreview(URL.createObjectURL(file));
            if (error) clearErrors(name);
            field.onChange(file as any);
          }}
        />
      </InputGroup>
    </FormControl>
  );
};
