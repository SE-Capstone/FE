/* eslint-disable no-use-before-define */
/* eslint-disable no-empty-character-class */
/* eslint-disable no-control-regex */
import { z } from 'zod';

import type { ZodTypeAny } from 'zod';

import { isDateBeforeToday, isOlderThan18Years } from '@/libs/helpers';

// export const regexEmail =
//   /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// export const regexEmail =
//   // eslint-disable-next-line no-control-regex
//   /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9]+[^\u0000-\u007F]+)?/;
export const regexEmail =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

export const regexPhone =
  /^(\+?\d{0,4})?\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{3}\)?)\s?-?\s?(\(?\d{4}\)?)?$/;

export const trimString = (value: unknown) => (typeof value === 'string' ? value.trim() : value);

export function getPasswordField(title?: string) {
  return z
    .string()
    .min(1, `${title ?? 'Password'} is required`)
    .min(6, `${title ?? 'Password'} at least 6 characters`)
    .max(32, `${title ?? 'Password'} maximum 32 characters`);
}

export const getEmailField = (msg?: string) =>
  z
    .string()
    .min(1, `${msg ?? 'Email'} is required`)
    .regex(regexEmail, `Invalid ${msg ?? 'Email'}`)
    .trim()
    .max(255, `${msg ?? 'Email'} maximum 255 characters`);

export const emailFieldNotRequired = z.preprocess((value: unknown) => {
  if (typeof value === 'string') return trimString(value.toLowerCase());
  return value;
}, z.string().trim().email().max(255, `Email maximum 255 characters`).optional().or(z.literal('')));

export const getStringNumericField = ({ min, max }: { min?: number; max?: number } = {}) => {
  let validateString = z.string().trim();

  if (min) {
    validateString = validateString.min(min);
  }

  if (max) {
    validateString = validateString.max(max);
  }

  return z
    .number()
    .or(validateString.regex(/\d+/).transform(Number))
    .refine((n) => n >= 0);
};

export const getStringRequiredField = (msg?: string) =>
  z
    .string()
    .trim()
    .min(1, `${msg ?? 'This field'} is required`);

export const getBirthdayField = () =>
  z
    .preprocess(
      (arg) => {
        if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);

        return undefined;
      },
      z.date({
        errorMap: (issue) => {
          if (issue.code === 'invalid_date') return { message: 'Required' };

          return { message: issue.message ?? '' };
        },
      })
    )
    .refine((date) => isDateBeforeToday(date), 'Birthday must be before today')
    .refine((date) => isOlderThan18Years(date), 'Birthday must be older than 18 years');

export const numericStringField = (schema: ZodTypeAny) =>
  z.preprocess((a) => {
    if (typeof a === 'string') {
      return Number.isNaN(a) ? 0 : parseInt(a, 10);
    }
    if (typeof a === 'number') {
      return Number.isNaN(a) ? 0 : a;
    }

    return undefined;
  }, schema);

export const birthdayField = z
  .preprocess(
    (arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);

      return undefined;
    },
    z.date({
      errorMap: (issue) => {
        if (issue.code === 'invalid_date') return { message: 'The birthday required' };

        return { message: issue.message ?? '' };
      },
    })
  )
  .refine((date) => isDateBeforeToday(date), 'The birthday must be before today');

export function getIdField(message: string) {
  return z
    .number({ invalid_type_error: message, required_error: message })
    .int({ message })
    .positive({ message })
    .transform((a) => Number(a));
}

export function makeOptionalPropsNullable<Schema extends z.AnyZodObject>(schema: Schema) {
  const entries = Object.entries(schema.shape) as [keyof Schema['shape'], z.ZodTypeAny][];
  const newProps = entries.reduce(
    (acc, [key, value]) => {
      acc[key] = value instanceof z.ZodOptional ? value.unwrap().nullable() : value;
      return acc;
    },
    {} as {
      [key in keyof Schema['shape']]: Schema['shape'][key] extends z.ZodOptional<infer T>
        ? z.ZodNullable<T>
        : Schema['shape'][key];
    }
  );
  return z.object(newProps).partial();
}
