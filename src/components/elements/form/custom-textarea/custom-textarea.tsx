import type React from 'react';

import { forwardRef, InputGroup, InputLeftElement, Textarea } from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';

import { FieldWrapper } from '../field-wrapper';

import type { FieldWrapperProps } from '../field-wrapper';
import type { TextareaProps } from '@chakra-ui/react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import type { TextareaAutosizeProps } from 'react-textarea-autosize';

interface CustomTextAreaProps
  extends Omit<TextareaProps, 'style'>,
    Omit<TextareaAutosizeProps, 'color'>,
    FieldWrapperProps {
  registration?: Partial<UseFormRegisterReturn>;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}
export const CustomTextArea = forwardRef<CustomTextAreaProps, 'textarea'>((props, ref) => {
  const {
    labelProps,
    controlProps,
    errorMessageProps,
    registration,
    error,
    label,
    leftIcon,
    helperText,
    ...textAreaProps
  } = props;

  return (
    <FieldWrapper
      labelProps={labelProps}
      controlProps={{ ...controlProps, isRequired: textAreaProps.isRequired }}
      errorMessageProps={errorMessageProps}
      error={error}
      label={label}
      helperText={helperText}
    >
      <InputGroup>
        {leftIcon && (
          <InputLeftElement pointerEvents="none" alignSelf="center" display="flex" pt="5px">
            {leftIcon}
          </InputLeftElement>
        )}
        <Textarea
          ref={ref}
          as={ResizeTextarea}
          w="full"
          focusBorderColor="primary"
          {...textAreaProps}
          {...registration}
        />
      </InputGroup>
    </FieldWrapper>
  );
});
