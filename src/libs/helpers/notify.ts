import toast from 'react-hot-toast';

import { getErrorValidateMsgFromApi } from './common';

import type { TErrorResponse } from '../react-query';
import type { IResponseErrorApi } from '@/configs/axios';
import type { ToasterProps, ToastOptions, ToastType } from 'react-hot-toast';

import { DEFAULT_MESSAGE } from '@/configs';

export const defaultToasterOptions: ToasterProps = {
  position: 'top-center',
  reverseOrder: false,
  gutter: 8,
};

interface INotifyProps {
  type: ToastType;

  message?: string;

  toastOptions?: ToastOptions;
}

export const notify = ({ type, message, toastOptions }: INotifyProps) => {
  function convertMsg() {
    if (!message) {
      return type === 'success' ? 'Successfully' : 'Something went wrong! Try again!';
    }

    return message;
  }

  toast[type](convertMsg(), {
    duration: 3000,
    ...defaultToasterOptions,
    ...toastOptions,
  });
};

export function showErrorFromApi(error: TErrorResponse) {
  const statusCode = error?.statusCode;

  let msg = '';

  if ('message' in error && typeof error?.message === 'string') {
    msg = error.message;
  }

  if ('errors' in error && Array.isArray(error?.errors)) {
    const [errorValidated] = getErrorValidateMsgFromApi(error.errors);

    msg = errorValidated;
  }

  if ('message' in error && Array.isArray(error?.message)) {
    msg = error?.message?.[0];
  }

  if ((statusCode && statusCode >= 500) || !error) {
    msg = 'Something went wrong!';
  }

  return notify({ type: 'error', message: msg });
}

export function getErrorMessage(error: IResponseErrorApi) {
  return error.message
    ? error.message
    : error?.errors
    ? Object.values(error?.errors)[0][0]
    : error?.title || DEFAULT_MESSAGE.SOMETHING_WRONG;
}
