import { HStack, PinInput, PinInputField } from '@chakra-ui/react';
import { useController } from 'react-hook-form';

import { FieldWrapper } from '../field-wrapper';

import type { FieldWrapperProps } from '../field-wrapper';
import type { MayBeController } from '../types';
import type { PinInputProps, StackProps } from '@chakra-ui/react';
import type { FieldPathByValue, FieldValues } from 'react-hook-form';

type CustomPinInputProps<TFormValues extends FieldValues> = Omit<PinInputProps, 'children'> &
  MayBeController<TFormValues> & {
    fieldWrapperProps?: Omit<FieldWrapperProps, 'error'>;
    numberPins?: number;

    wrapperProps?: StackProps;
  };
export function CustomPinInput<TFormValues extends FieldValues>(
  props: CustomPinInputProps<TFormValues>
) {
  const {
    control,
    name,
    wrapperProps,
    fieldWrapperProps,
    numberPins = 6,
    ...restPinInputProps
  } = props;
  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: name as FieldPathByValue<TFormValues, any>,
  });
  return (
    <FieldWrapper error={error} {...fieldWrapperProps}>
      <HStack spacing={{ base: 4, '2xl': 5 }} justify="center" {...wrapperProps}>
        <PinInput
          autoFocus
          otp
          focusBorderColor="primary"
          {...restPinInputProps}
          {...field}
          onChange={(v) => field.onChange(v as any)}
        >
          {[...Array(numberPins)].map((_, index) => (
            <PinInputField key={index} bg="white" />
          ))}
        </PinInput>
      </HStack>
    </FieldWrapper>
  );
}
