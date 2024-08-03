import { zodResolver } from '@hookform/resolvers/zod';
import { useForm as useHookForm } from 'react-hook-form';

import type {
  FieldNamesMarkedBoolean,
  FieldValues,
  UseFormProps as UseHookFormProps,
} from 'react-hook-form';
import type { AnyZodObject, TypeOf, ZodTypeAny } from 'zod';

type UseFormProps<S extends AnyZodObject | ZodTypeAny> = {
  schema: S;
  options?: Omit<UseHookFormProps<TypeOf<S>>, 'resolver'>;
};
/**
 * @param UseFormProps with two properties: schema: Zod schema validations and options: UseFormProps from react-hook-form
 * @returns useForm with zod schema to pass props into <CustomFormProvider /> component
 * @example
 *```tsx
 *  const form = useFormWithSchema({
 *    schema: signInFormSchema,
 *    options: {
 *    ...
 *    }
 *  })
 *  const { register, formState } = form;
 *
 *    <CustomFormProvider form={form} onSubmit={(values)=> {
 *      console.log(values)
 *    }}>
 *       <InputField label="Name" error={formState.errors.name} registration={register('name')} />
 *    </CustomFormProvider>
 *```
 */
export const useFormWithSchema = <S extends AnyZodObject | ZodTypeAny>(props: UseFormProps<S>) => {
  const { schema, options } = props;

  const form = useHookForm({
    mode: 'onSubmit',
    shouldFocusError: true,
    ...options,
    resolver: zodResolver(schema),
  });
  const { formState } = form;
  const { isDirty, dirtyFields } = formState;

  const isDirtyFields = isDirty && Object.values(dirtyFields).length > 0;

  return { ...form, isDirtyFields };
};

/**
 * @description
 * Get dirty values based on dirty fields which is returned from `dirtyFields`.
 *
 * @param dirtyFields
 * @param allValues
 */
export function dirtyValues<TFormValues extends FieldValues = FieldValues>(
  dirtyFields: FieldNamesMarkedBoolean<TFormValues>,
  allValues: TFormValues
): Partial<TFormValues> {
  if (dirtyFields === true || Array.isArray(dirtyFields)) {
    return allValues;
  }

  return Object.fromEntries(
    Object.keys(dirtyFields).map((key) => [key, dirtyValues(dirtyFields[key], allValues[key])])
  ) as Partial<TFormValues>;
}
