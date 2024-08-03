import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';

import { FormControl, FormLabel, Input, InputGroup, Stack, Text } from '@chakra-ui/react';
import { useController, useFormContext } from 'react-hook-form';

import type { CustomInputProps } from '../custom-input';
import type { StackProps } from '@chakra-ui/react';
import type { FieldValues } from 'react-hook-form';
import type { Control, FieldPathByValue } from 'react-hook-form/dist/types';

import { MAX_SIZE_VIDEO, REGEX_FILE_TYPE_VIDEO } from '@/configs';

type FileUploadVideoProps<TFormValues extends FieldValues> = Omit<
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
export const FileUploadVideo = <TFormValues extends FieldValues>({
  name,
  initUrl = '',
  control,
  isRequired = false,
  acceptedFileTypes = 'video/mp4',
  error,
  controlProps,
  labelProps,
  stackProps,
  trigger,
  children,
  ...inputFileProps
}: FileUploadVideoProps<TFormValues>) => {
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
    onClick(e: React.MouseEvent) {
      e.stopPropagation();
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

  useEffect(() => {
    if (initUrl && typeof initUrl === 'string') setFilePreview(initUrl);
  }, [initUrl]);

  return (
    <FormControl
      isInvalid={inputFileProps.isInvalid || !!error}
      isRequired={isRequired}
      {...controlProps}
    >
      <FormLabel {...labelProps}>
        <Stack spacing={4} {...stackProps} onClick={(e) => e.preventDefault()}>
          {childrenClone}
          {triggerBtn}
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

            if (file.size >= MAX_SIZE_VIDEO) {
              setError(name, { message: 'Max size 10Mb.' }, { shouldFocus: true });

              return;
            }

            if (!file.name.match(REGEX_FILE_TYPE_VIDEO)) {
              setError(
                name,
                { message: 'The file must be a list of type: .mp4' },
                { shouldFocus: true }
              );

              return;
            }

            setFilePreview(URL.createObjectURL(file));
            clearErrors(name);
            field.onChange(file as any);

            // @ts-ignore
            e.target.value = null;
          }}
        />
      </InputGroup>
    </FormControl>
  );
};
