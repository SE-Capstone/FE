import { z } from 'zod';

import { regexPhone } from '@/validations';

export const loginPhoneNumberValidationSchema = z.object({
  phoneNumber: z
    .string({
      invalid_type_error: 'Số điện thoại không được để trống',
      required_error: 'Số điện thoại không được để trống',
    })
    .regex(regexPhone, `Số điện thoại không hợp lệ`),
});

export type LoginPhoneNumberValidationSchemaType = z.infer<typeof loginPhoneNumberValidationSchema>;

export const loginOtpValidationSchema = z.object({
  otpCode: z
    .string({
      invalid_type_error: 'Otp không được để trống',
      required_error: 'Otp không được để trống',
    })
    .min(6, 'Otp ít nhất 6 ký tự')
    .max(6, 'Otp ít nhất 6 ký tự'),
});

export type LoginOtpValidationSchemaType = z.infer<typeof loginOtpValidationSchema>;
