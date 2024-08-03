import type { Control, FieldPathByValue, FieldValues } from 'react-hook-form';

export type MayBeController<TFormValues extends FieldValues> =
  | {
      control: Control<TFormValues>;
      name: FieldPathByValue<TFormValues, any>;
    }
  | {
      control?: never;
      name?: string;
    };
