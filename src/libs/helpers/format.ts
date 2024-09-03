import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

import { isValidTimestamp } from './common';

import type { Dayjs } from 'dayjs';

dayjs.extend(customParseFormat);

enum FormatDateTimeEnum {
  'YYYY-MM-DD' = 'YYYY-MM-DD',
  'DD-MM-YYYY' = 'DD-MM-YYYY',
  'MM-DD-YYYY' = 'MM-DD-YYYY',
  'DD/MM/YYYY' = 'DD/MM/YYYY',
  'HH:mm - DD/MM/YYYY' = 'HH:mm - DD/MM/YYYY',
  'MMM DD' = 'MMM DD',
  'MMM DD, YYYY' = 'MMM DD, YYYY',
  'hh : mm' = 'hh : mm',
  'DD.MM.YY hh:mm' = 'DD.MM.YY hh:mm',
  'DD/MM/YY hh:mm a' = 'DD/MM/YY hh:mm a',
  'h:mm a' = 'h:mm a',
}

type FormatDateTimeType = {
  date: Date | string | Dayjs | number;
  format?: keyof typeof FormatDateTimeEnum;
};

/**
 * "Format a date string using the dayjs library."
 *
 * The first line of the function is a comment. It's a good idea to include a comment at the top of
 * each function that describes what the function does
 * @param object with 2 keys: date and format
 * @key {Date|string|Dayjs} date - The date you want to format.
 * @key {FormatDateTimeEnum} format - The format you want to use to format the date.
 */
export function formatDate({
  date,
  format = FormatDateTimeEnum['YYYY-MM-DD'],
}: FormatDateTimeType) {
  const maybeDate = isValidTimestamp(Number(date)) ? Number(date) : date;

  return dayjs(new Date(maybeDate as Date)).format(FormatDateTimeEnum[format]);
}

export function getCurrentDate() {
  return dayjs().format(FormatDateTimeEnum['YYYY-MM-DD']);
}
