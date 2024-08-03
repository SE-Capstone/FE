import { Checkbox, forwardRef } from '@chakra-ui/react';

import type { FieldWrapperProps } from '../field-wrapper';
import type { CheckboxProps } from '@chakra-ui/react';
import type { UseFormRegisterReturn } from 'react-hook-form';

export interface CustomCheckboxProps
  extends CheckboxProps,
    Pick<FieldWrapperProps, 'error' | 'label'> {
  registration?: Partial<UseFormRegisterReturn>;
}

export const CustomCheckbox = forwardRef<CustomCheckboxProps, 'input'>(function (
  props: CustomCheckboxProps,
  _ref
) {
  const { registration, error, label, ...rest } = props;

  return (
    <Checkbox {...rest} {...registration} isInvalid={!!error}>
      {label}
    </Checkbox>
  );
});
