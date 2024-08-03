import type { ComponentProps } from 'react';
import { useEffect, useId } from 'react';

import { Box } from '@chakra-ui/react';
import { FormProvider } from 'react-hook-form';

import type { FieldValues, SubmitHandler, UseFormReturn } from 'react-hook-form';

interface CustomFormProviderProps<TFormValues extends FieldValues>
  extends Omit<ComponentProps<'form'>, 'onSubmit'> {
  className?: string;
  id?: string;
  isDisabled?: boolean;
  form: UseFormReturn<TFormValues>;
  onSubmit?: SubmitHandler<TFormValues>;
}

export const CustomFormProvider = <TFormValues extends FieldValues>({
  form,
  onSubmit,
  isDisabled = false,
  children,
  className,
  id,
  ...props
}: CustomFormProviderProps<TFormValues>) => {
  const uniqueId = useId();

  const { clearErrors, reset, handleSubmit } = form;

  useEffect(
    () => () => {
      // reset on unmount
      clearErrors();
      reset();
    },
    [clearErrors, reset]
  );

  return (
    <FormProvider {...form}>
      <form
        noValidate
        id={id ?? uniqueId}
        className={className}
        onSubmit={onSubmit ? handleSubmit(onSubmit) : (e) => e.preventDefault()}
        {...props}
        style={{ width: '100%', height: '100%', ...props.style }}
      >
        <Box
          w="full"
          h="full"
          as="fieldset"
          disabled={isDisabled}
          sx={{
            '&:disabled': {
              opacity: 1,
            },
            border: 'none',
            outline: 'none',
            boxShadow: 'none',
          }}
        >
          {children}
        </Box>
      </form>
    </FormProvider>
  );
};
