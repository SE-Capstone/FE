/* eslint-disable no-bitwise */
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

import type { IErrorValidation } from '@/types';

import { MAX_SIZE_IMAGE, REGEX_FILE_TYPE_IMAGES, STORAGE_URL } from '@/configs';

dayjs.extend(duration);
/**
 * Replace all non-word characters with an empty string, replace all spaces with an empty string,
 * replace all spaces followed by a character with that character in uppercase, and lowercase the whole
 * thing.
 * @param {string} word - The word to be converted to camel case.
 * @returns the word in lowercase, replacing all the - and _ with spaces, replacing all the non-word
 * characters with nothing, replacing the first letter of each word with an uppercase letter, and then
 * removing all the spaces.
 */
function toCamelCase(word: string) {
  // Convert to lowercase
  return (
    word
      .toLowerCase()
      // Replace - and _ with a space
      .replace(/[-_]+/g, ' ')
      // Remove all non-word characters
      .replace(/[^\w\s]/g, '')
      // Replace all spaces with a space and then the next character to upper case
      .replace(/ (.)/g, function ($1) {
        return $1.toUpperCase();
      })
      // Remove all spaces
      .replace(/ /g, '')
      // Make first character uppercase
      .replace(/^./, function ($1) {
        return $1.toUpperCase();
      })
  );
}

/**
 * It takes an object, converts all the keys to camel case, and returns the new object
 * @param origObj - The original object that you want to convert to camel case.
 * @returns A new object with the keys converted to camelCase.
 */
export function objectToCamelCase<T extends Record<string, unknown> | object>(origObj: T): T {
  return Object.keys(origObj).reduce((newObj, key) => {
    const val = origObj[key];
    const newVal = typeof val === 'object' ? objectToCamelCase(val) : val;
    newObj[toCamelCase(key)] = newVal;

    return newObj;
  }, {} as T);
}

/**
 * If the string exists, return the first letter capitalized and the rest of the string, otherwise
 * return an empty string.
 * @param {string} string - The string to capitalize.
 * @returns A function that takes a string as an argument and returns a string with the first letter
 * capitalized.
 */
export const capitalizeFirstLetter = (string: string) => {
  if (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  return '';
};

export function getErrorValidateMsgFromApi(errorsValidation: IErrorValidation) {
  if (!Array.isArray(errorsValidation)) return ['Something went wrong!'];

  return errorsValidation.map((error) => {
    if (error.field.includes('.')) {
      return `${error.field.replaceAll('.', ' ')} ${error.message}`;
    }
    return `${capitalizeFirstLetter(error.field)} ${error.message}`;
  });
}

/**
 * It takes a string and a number as arguments, and returns a string that is the first argument cut off
 * at the second argument
 * @param {string} text - The text you want to cut.
 * @param {number} length - The length of the text you want to cut.
 * @returns A function that takes two arguments, text and length, and returns a string.
 */
export const cutText = (text: string, length: number) => {
  // Check if the string is longer than the length
  const isTextLongerThanLength = text.split(' ').length > 1;
  if (isTextLongerThanLength) {
    // Cut the text to the length
    const cutText = text.substring(0, length);
    // Split the text by spaces
    const splitText = cutText.split(' ');
    // Remove the last word
    splitText.pop();

    // Return the text with ellipsis
    return `${splitText.join(' ')}...`;
  }

  // Return the text if it is not longer than the length
  return text;
};

/**
 * It takes a string and returns a new string with all non-numeric characters removed
 * @param {string} string - The string to be formatted.
 * @returns A function that takes a string as an argument and returns a string with all non-numeric
 * characters removed.
 */
export const onlyNumber = (string: string): string => {
  if (string) {
    // Return string with only numbers
    return string.replace(/\D/g, '');
  }

  return '';
};

/**
 * It takes a number and returns a string with the number formatted as currency
 * @param {number} number - The number to be formatted.
 * @returns A function that takes a number as a parameter and returns a formatted number.
 */
export const formatCurrency = (number: number) => {
  if (number) {
    const formattedNumber = number.toString().replace(/\D/g, '');
    const rest = formattedNumber.length % 3;
    let currency = formattedNumber.substr(0, rest);
    const thousand = formattedNumber.substr(rest).match(/\d{3}/g);
    let separator: string;

    if (thousand) {
      separator = rest ? '.' : '';
      currency += separator + thousand.join('.');
    }

    return currency;
  }

  return '';
};

/**
 * If the date is less than a minute ago, return "just now", if it's less than an hour ago, return "X
 * minutes ago", if it's less than a day ago, return "X hours ago", if it's less than a week ago,
 * return "X days ago", if it's less than a month ago, return "X weeks ago", otherwise return the full
 * date
 * @param {string} time - The time string to convert to a time ago string.
 * @returns A string that is the time difference between the current time and the time passed in.
 */
export const timeAgo = (time: string) => {
  const date = new Date((time || '').replace(/-/g, '/').replace(/[TZ]/g, ' '));
  const diff = (new Date().getTime() - date.getTime()) / 1000;
  const dayDiff = Math.floor(diff / 86400);

  if (Number.isNaN(dayDiff) || dayDiff < 0 || dayDiff >= 31) {
    return dayjs(time).format('MMMM DD, YYYY');
  }

  return (
    (dayDiff === 0 &&
      ((diff < 60 && 'just now') ||
        (diff < 120 && '1 minute ago') ||
        (diff < 3600 && `${Math.floor(diff / 60)} minutes ago`) ||
        (diff < 7200 && '1 hour ago') ||
        (diff < 86400 && `${Math.floor(diff / 3600)} hours ago`))) ||
    (dayDiff === 1 && 'YESTERDAY') ||
    (dayDiff < 7 && `${dayDiff} days ago`) ||
    (dayDiff < 31 && `${Math.ceil(dayDiff / 7)} weeks ago`)
  );
};

/**
 * It takes a time string and returns an object with the days, hours, minutes, and seconds between the
 * time string and now
 * @param {string} time - The time you want to calculate the difference from.
 * @returns An object with the following properties:
 * - days: a string with the number of days, with a leading zero if the number is less than 10
 * - hours: a string with the number of hours, with a leading zero if the number is less than 10
 * - minutes: a string with the number of minutes, with a leading zero if the number is less than 10
 * - seconds:  a string with the number of seconds, with a leading zero if the number is less than 10
 */
export const diffTimeByNow = (time: string | Date) => {
  const startDate = dayjs(dayjs().format('YYYY-MM-DD HH:mm:ss').toString());
  const endDate = dayjs(dayjs(time).format('YYYY-MM-DD HH:mm:ss').toString());

  const duration = dayjs.duration(endDate.diff(startDate));
  const milliseconds = Math.floor(duration.asMilliseconds());

  const days = Math.round(milliseconds / 86400000);
  const hours = Math.round((milliseconds % 86400000) / 3600000);
  let minutes = Math.round(((milliseconds % 86400000) % 3600000) / 60000);
  const seconds = Math.round((((milliseconds % 86400000) % 3600000) % 60000) / 1000);

  if (seconds < 30 && seconds >= 0) {
    minutes += 1;
  }

  return {
    days: days.toString().length < 2 ? `0${days}` : days,
    hours: hours.toString().length < 2 ? `0${hours}` : hours,
    minutes: minutes.toString().length < 2 ? `0${minutes}` : minutes,
    seconds: seconds.toString().length < 2 ? `0${seconds}` : seconds,
  };
};

export const isset = (obj: any) => {
  if (obj !== null && obj !== undefined) {
    if (typeof obj === 'object' || Array.isArray(obj)) {
      return Object.keys(obj).length;
    }

    return obj.toString().length;
  }

  return false;
};

export const toRaw = (object: any): any => {
  if (object instanceof Array) {
    return object.map(toRaw);
  }
  if (object instanceof Object) {
    const result: any = {};
    // eslint-disable-next-line no-return-assign
    Object.keys(object).forEach((key) => (result[key] = toRaw(object[key])));
    return result;
  }
  return object;
};

/**
 * It returns an array of random numbers between a given range
 * @param {number} from - the minimum number
 * @param {number} to - The minimum number that can be generated.
 * @param {number} length - the length of the array
 * @returns An array of random numbers
 */
export const randomNumbers = ({
  from,
  to,
  length,
}: {
  from: number;
  to: number;
  length: number;
}) => {
  const numbers = [0];
  for (let i = 1; i < length; i++) {
    numbers.push(Math.ceil(Math.random() * (from - to) + to));
  }

  return numbers;
};

/**
 * It creates a random string of characters that looks like a GUID
 * @returns A function that returns a string.
 */

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const random = Math.random() * 16;
    const roundedRandom = random | 0;
    const isCharacterX = c === 'x';
    const value = isCharacterX ? roundedRandom : (roundedRandom & 0x3) | 0x8;

    return value.toString(16);
  });
}

// eslint-disable-next-line max-params
export const objToFormData = (
  obj: Record<string, any>,
  formData?: FormData,
  pre = ''
): FormData => {
  // Initialize formData if it is undefined
  formData = formData || new FormData();

  // Loop through all object properties
  // eslint-disable-next-line no-restricted-syntax
  for (const prop in obj) {
    // Check if the property is an object and not an array
    if (typeof obj[prop] === 'object' && !Array.isArray(obj[prop])) {
      // Create a variable to store the property name
      const deepPre = pre ? `${pre}[${prop}]` : prop;
      // Call the function again with the object property as the object
      // and the formData object
      objToFormData(obj[prop], formData, deepPre);
      // Check if the property is an array
    } else if (typeof obj[prop] === 'object' && Array.isArray(obj[prop])) {
      // Loop through the array
      obj[prop].forEach((item: any, index: any) => {
        // Append the array property to the formData object
        formData?.append(`${prop}[${index}]`, item || '');
      });
      // Check if the property is the first level of the object
    } else if (pre) {
      // Append the property to the formData object
      formData.append(`${pre}[${prop}]`, obj[prop] || '');
    } else {
      // Append the property to the formData object
      formData.append(prop, obj[prop] || '');
    }
  }

  return formData;
};

export const getKeyStringFromEnum = <T extends Record<string | number, string | number>>(
  myEnum: T
) =>
  Object.keys(myEnum)
    .map((key) => myEnum[key])
    .filter((value) => typeof value === 'string') as (keyof T)[];

// Turn enum into array
export const enumToArrObjOptions = <T extends Record<string, string | number>>(_enum: T) =>
  Object.keys(_enum)
    .filter((value: string) => !Number.isNaN(Number(value)))
    .map((key) => ({
      label: _enum[key],
      value: Number(key),
    }));

export const randomColor = () => `#${Math.floor(Math.random() * 16777215).toString(16)}`;

// format: 012-345-6789
export const phoneNumberAutoFormat = (phoneNumber: string): string => {
  const number = phoneNumber.trim().replace(/[^0-9]/g, '');

  if (number.length < 4) return number;
  if (number.length < 7) return number.replace(/(\d{3})(\d{1})/, '$1-$2');
  if (number.length < 11) return number.replace(/(\d{3})(\d{3})(\d{1})/, '$1-$2-$3');

  return number.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
};

export const cleanPhoneNumber = (phone: string) => phone.replace(/-/g, '');

interface IGetFullName {
  firstName?: string;
  lastName?: string;
}

export function getFullName({ firstName, lastName }: IGetFullName) {
  if (!firstName && !lastName) return '';

  return `${firstName ?? ''} ${lastName ?? ''}`;
}

interface IGetFullAddress {
  state?: string;
  city?: string;
  street?: string;
  zipCode?: string | number;
  country?: string;
}
export function getFullAddress({ city, state, street, country, zipCode }: IGetFullAddress): string {
  if (!state && !city && !street && !country && !zipCode) return '';

  return `${street ? `${street},` : ''} ${city ? `${city},` : ''} ${state ? `${state},` : ''} ${
    zipCode ? `${zipCode},` : ''
  } ${country ?? ''}`;
}

export const removeNullAndUndefined = <
  T extends Record<string, unknown> | object = Record<string, unknown>
>(
  obj: T
) =>
  Object.fromEntries(
    Object.entries(obj).filter(([_, value]) => (value === 0 ? true : !!value))
  ) as Partial<T>;

export function isDateBeforeToday(date: Date) {
  return new Date(date.toDateString()) < new Date(new Date().toDateString());
}

export function isOlderThan18Years(date: Date | undefined): boolean {
  if (!date) return false;

  const today = new Date();
  const eighteenYearsAgo = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());

  return date <= eighteenYearsAgo;
}

/**
 * Custom toFixed method
 * @param val - Number to be converted
 * @param digits - Number of decimal places
 * @returns - The number converted
 */
export function customToFixed(val: number, digits = 2) {
  return parseFloat(val.toFixed(digits));
}

export const splitSnakeCaseToString = (string: string) =>
  string
    .replace(/([a-z])([A-Z]+)/g, (_, s1, s2) => `${s1} ${s2}`)
    .replace(/([A-Z])([A-Z]+)([^a-zA-Z0-9]*)$/, (_, s1, s2, s3) => s1 + s2.toLowerCase() + s3)
    .replace(/([A-Z]+)([A-Z][a-z])/g, (_, s1, s2) => `${s1.toLowerCase()} ${s2}`);

export const atLeastOneDefined = (obj: Record<string | number | symbol, unknown>): boolean => {
  const hasDefined = Object.values(obj).some((val) => !!val);
  return hasDefined;
};

export const parseQueryStringToObject = function <T>(url: string) {
  const params = new Map<string, string>();

  url
    .slice(1)
    .split('&')
    .forEach((kv: string) => {
      const [key, value] = kv.split('=');
      params.set(key, value);
    });

  return Object.fromEntries(params) as unknown as T;
};

export function insert<T>(arr: T[], index: number, newItem: T): T[] {
  // Get the first part of the array
  const front = arr.slice(0, index);
  // Get the second part of the array
  const back = arr.slice(index);
  // Put the first part of the array and the new item together
  const result = front.concat(newItem);
  // Put the first part and the new item together and the second part of the array together
  return result.concat(back);
}

export function decodeUriReplacePlusToSpace(str: string): string {
  return decodeURIComponent(str.replace(/\+/g, ' '));
}

export function isNumeric(n: string): boolean {
  return !Number.isNaN(parseFloat(n)) && Number.isFinite(n);
}

type TimeStampType = string | number | Date;

export function isValidTimestamp(timestamp: TimeStampType) {
  const newTimestamp = new Date(timestamp).getTime();
  return isNumeric(newTimestamp as unknown as string);
}

/**
 * Returns the url for a given file in the storage
 * @param fileName the name of the file
 * @returns the url of the file
 */
export function getStorageUrl(fileName: string) {
  if (!fileName) return '';

  fileName = fileName.startsWith('/') ? fileName : `/${fileName}`;

  return STORAGE_URL + fileName;
}

/**
 * Formats a number to a price format
 * @param {number | null} n - The number to format
 * @param {',' | '.'} formatType - The format type. Defaults to ','
 * @returns {string}
 */
export function formatNumberPrice(
  n: number | null | undefined,
  formatType: ',' | '.' = ','
): string {
  if (n && typeof n === 'number') {
    // If the number is not null and is an actual number, format the number
    return n.toString().replace(/\B(?!\.\d*)(?=(\d{3})+(?!\d))/g, formatType);
  }
  // Return 0 if the number is null or not a number
  return '0';
}

export function validateFiles(
  files: File[],
  type: 'image' | 'video' = 'image',
  maxSize = MAX_SIZE_IMAGE // unit bytes
) {
  const isValidFileImages = [...files].some((file) => file.name.match(REGEX_FILE_TYPE_IMAGES));

  if (!isValidFileImages && type === 'image') {
    return {
      isValid: false,
      message: 'Ảnh không hợp lệ. Bao gồm: .png, .jpg, .jpeg, .heic, .heif',
    };
  }
  const isValidFileSize = [...files].every((file) => file.size <= maxSize);

  if (!isValidFileSize) {
    return {
      isValid: false,
      message: `Ảnh không quá ${Math.floor(maxSize / 1024)} Kb`,
    };
  }

  return {
    isValid: true,
    message: undefined,
  };
}

export function removeAccents(str: string): string {
  if (!str) return '';

  // Trim the string
  const trimmedString = str.trim();
  // Normalize the string
  const normalizedString = trimmedString.normalize('NFD');
  // Replace the accents with an empty string
  const stringWithoutAccents = normalizedString.replace(/[\u0300-\u036f]/g, '');
  return stringWithoutAccents;
}

export const readFileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Convert the file data to base64
      const base64String = reader.result as string;
      resolve(base64String);
    };
    reader.onerror = () => {
      reject(reader.error);
    };
    reader.readAsDataURL(file);
  });

export function getNumericalOrder(data: { page?: number; perPage?: number; index: number }) {
  const { page, perPage, index } = data;

  if (!page || !perPage) return index + 1;

  return (page - 1) * perPage + index + 1;
}

export function calculatePrevAndNext(page, perpage, totalPage, totalCounts) {
  let prev: number | null = null;
  let next = null;

  // Calculate totalPages based on totalCounts and perpage if not given
  if (totalPage === undefined) {
    totalPage = Math.ceil(totalCounts / perpage);
  }

  // Calculate prev page
  if (page > 1) {
    prev = page - 1;
  }

  // Calculate next page
  if (page < totalPage) {
    next = page + 1;
  }

  return { prev, next };
}
