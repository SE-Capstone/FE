import React from 'react';

import {
  Icon,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightAddon,
  InputRightElement,
  forwardRef,
  useMediaQuery,
} from '@chakra-ui/react';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';

import { FieldWrapper } from '../field-wrapper';

import type { FieldWrapperProps } from '../field-wrapper';
import type { InputGroupProps, InputProps } from '@chakra-ui/react';
import type { UseFormRegisterReturn } from 'react-hook-form';

import { YESTERDAY } from '@/configs';
import { formatDate } from '@/libs/helpers';

export interface CustomInputProps extends InputProps, FieldWrapperProps {
  registration?: Partial<UseFormRegisterReturn>;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
  inputLeftAddon?: string;
  inputRightAddon?: string;

  inputGroupProps?: InputGroupProps;
}

export const CustomInput = forwardRef<CustomInputProps, 'input'>((props, ref) => {
  const {
    labelProps,
    controlProps,
    errorMessageProps,
    registration,
    error,
    label,
    inputLeftAddon = '',
    inputRightAddon = '',
    leftIcon,
    rightIcon,
    type = 'text',
    inputGroupProps,
    size: _size,
    helperText,
    ...inputProps
  } = props;

  const [show, setShow] = React.useState(false);

  const handleClick = () => setShow(!show);

  function renderType() {
    if (type === 'password' && show) {
      return 'text';
    }

    return type;
  }

  const [isLargerThanLg] = useMediaQuery('(min-width: 64.0625em)');

  return (
    <FieldWrapper
      labelProps={labelProps}
      controlProps={{ ...controlProps, isRequired: inputProps.isRequired }}
      errorMessageProps={errorMessageProps}
      error={error}
      label={label}
      helperText={helperText}
    >
      <InputGroup size={isLargerThanLg ? 'lg' : 'md'} {...inputGroupProps}>
        {inputLeftAddon && <InputLeftAddon>{inputLeftAddon}</InputLeftAddon>}
        {leftIcon && (
          <InputLeftElement pointerEvents="none" alignSelf="center" display="flex">
            {leftIcon}
          </InputLeftElement>
        )}
        <Input
          ref={ref}
          type={renderType()}
          focusBorderColor="primary"
          maxLength={255}
          max={
            type === 'date' && registration?.name === 'dob'
              ? formatDate({
                  date: YESTERDAY,
                  format: 'YYYY-MM-DD',
                })
              : undefined
          }
          css={
            type === 'date' || type === 'time'
              ? {
                  '&::-webkit-calendar-picker-indicator:hover': {
                    opacity: 0.7,
                    cursor: 'pointer',
                    transition: 'all ease .5s',
                  },
                }
              : undefined
          }
          _disabled={{
            opacity: 0.8,
            color: 'neutral.300',
            cursor: 'not-allowed',
          }}
          {...inputProps}
          {...registration}
        />
        {rightIcon && (
          <InputRightElement cursor="pointer" color="textColor" zIndex={2}>
            {rightIcon}
          </InputRightElement>
        )}
        {type === 'password' && (
          <InputRightElement h="full" cursor="pointer">
            <Icon style={{ width: '3em', height: '2em', alignSelf: 'end' }} onClick={handleClick}>
              {show ? <AiFillEyeInvisible /> : <AiFillEye />}
            </Icon>
          </InputRightElement>
        )}

        {inputRightAddon && <InputRightAddon bg="red">{inputRightAddon}</InputRightAddon>}
      </InputGroup>
    </FieldWrapper>
  );
});
