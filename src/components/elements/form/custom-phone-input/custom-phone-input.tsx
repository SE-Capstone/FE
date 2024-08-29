import { FormControl, FormErrorMessage } from '@chakra-ui/react';
import { parsePhoneNumber } from 'libphonenumber-js';
import { useController } from 'react-hook-form';
import PI from 'react-phone-input-2';

import type { MayBeController } from '../types';
import type { FieldPathByValue, FieldValues } from 'react-hook-form';
import type { CountryData, PhoneInputProps } from 'react-phone-input-2';

import 'react-phone-input-2/lib/material.css';

// @ts-ignore
const PhoneInput: React.FC<PhoneInputProps> = PI.default ? PI.default : PI;

export type CustomPhoneInputProps<TFormValues extends FieldValues> = MayBeController<TFormValues> &
  PhoneInputProps;

export const CustomPhoneInput = <TFormValues extends FieldValues>(
  props: CustomPhoneInputProps<TFormValues>
) => {
  const { control, name, ...restProps } = props;

  const {
    field,
    fieldState: { error },
  } = useController({
    control,
    name: name as FieldPathByValue<TFormValues, any>,
    rules: {
      required: true,
    },
  });

  const handleChange = (
    _value: string,
    _countryData: CountryData,
    _e: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    try {
      const phoneNumberParsed = parsePhoneNumber(formattedValue);

      const phoneNumberFormat = phoneNumberParsed
        ? (phoneNumberParsed.number as string)
        : undefined;
      field.onChange(phoneNumberFormat as any);
    } catch (_err) {
      field.onChange(undefined as any);
    }
  };

  return (
    <FormControl
      isInvalid={!!error}
      sx={{
        '& .react-tel-input .form-control:hover:not(:focus)': {
          borderColor: 'gray.300',
        },
        '& .react-tel-input .form-control:focus': {
          borderColor: 'primary',
        },

        '& .react-tel-input .form-control': {
          py: 3,
          fontSize: 'sm',
        },
        '& .react-tel-input .country-list': {
          pos: 'fixed',
          w: '30%',
        },
        '& .react-tel-input .special-label': {
          zIndex: 0,
        },
      }}
    >
      <PhoneInput
        specialLabel="Phone number"
        onlyCountries={['vn']}
        disableDropdown
        showDropdown={false}
        country="vn"
        inputStyle={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
        }}
        inputProps={{
          ref: field.ref,
          name: field.name,
          required: true,
          autoFocus: true,
        }}
        buttonStyle={{
          borderRadius: '8px 0 0 8px',
        }}
        value={field.value}
        // isValid={(value, country: any) => {
        //   if (value.match(/12345/)) {
        //     return `Không hợp lệ: ${value}, ${country.name}`;
        //   }
        //   if (value.match(/1234/)) {
        //     return false;
        //   }
        //   return true;
        // }}
        onChange={handleChange}
        {...restProps}
      />
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
