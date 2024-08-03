import {
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  InputGroup,
  InputRightAddon,
} from '@chakra-ui/react';
import { Controller } from 'react-hook-form';

import { FieldWrapper } from '../field-wrapper';

import type { FieldWrapperProps } from '../field-wrapper';
import type { MayBeController } from '../types';
import type {
  NumberDecrementStepperProps,
  NumberIncrementStepperProps,
  NumberInputFieldProps,
  NumberInputProps,
  NumberInputStepperProps,
} from '@chakra-ui/react';
import type { FieldValues } from 'react-hook-form';

export type CustomNumberInputProps<TFormValues extends FieldValues> = NumberInputProps &
  FieldWrapperProps &
  MayBeController<TFormValues> & {
    numberInputFieldProps?: NumberInputFieldProps;
    numberInputStepperProps?: NumberInputStepperProps;
    numberIncrementStepperProps?: NumberIncrementStepperProps;
    numberDecrementStepperProps?: NumberDecrementStepperProps;

    rightAddon?: React.ReactNode;
    hiddenStepper?: boolean;
  };

const CustomNumberInput = <TFormValues extends FieldValues>({
  numberInputFieldProps,
  numberInputStepperProps,
  numberIncrementStepperProps,
  numberDecrementStepperProps,
  controlProps,
  labelProps,
  errorMessageProps,
  label,
  error,
  control,
  name,
  rightAddon,
  hiddenStepper = false,
  ...numberInputProps
}: CustomNumberInputProps<TFormValues>) => {
  const stepper = (
    <NumberInputStepper {...numberInputStepperProps}>
      <NumberIncrementStepper {...numberIncrementStepperProps} />
      <NumberDecrementStepper {...numberDecrementStepperProps} />
    </NumberInputStepper>
  );
  return control && name ? (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FieldWrapper
          labelProps={labelProps}
          controlProps={{ ...controlProps, isRequired: numberInputProps.isRequired }}
          errorMessageProps={errorMessageProps}
          error={error}
          label={label}
        >
          <InputGroup alignItems="stretch">
            <NumberInput
              w="full"
              focusBorderColor="primary"
              {...numberInputProps}
              value={field.value ?? undefined}
              onChange={(value) => {
                if (typeof value === 'undefined' || value === null || value === '')
                  return field.onChange(undefined as any);

                return field.onChange(
                  Number(value)
                    ? Number(value.toString().replace(/[e+-]/gi, ''))
                    : (undefined as any)
                );
              }}
            >
              <NumberInputField ref={field.ref} name={field.name} {...numberInputFieldProps} />

              {!hiddenStepper && stepper}
            </NumberInput>
            {rightAddon && (
              <InputRightAddon fontWeight="medium" h={{ base: '40px' }}>
                {rightAddon}
              </InputRightAddon>
            )}
          </InputGroup>
        </FieldWrapper>
      )}
    />
  ) : (
    <FieldWrapper
      labelProps={labelProps}
      controlProps={{ ...controlProps, isRequired: numberInputProps.isRequired }}
      errorMessageProps={errorMessageProps}
      error={error}
      label={label}
    >
      <NumberInput focusBorderColor="primary" {...numberInputProps}>
        <NumberInputField name={name as string} {...numberInputFieldProps} />
        {!hiddenStepper && stepper}
      </NumberInput>
    </FieldWrapper>
  );
};

export { CustomNumberInput };
