import { LoginOtpWidget, LoginPhoneNumberWidget } from '../widgets';

import { useIsOpen } from '@/libs/hooks';

export function LoginPage() {
  const { isOpen, open, close } = useIsOpen();
  return (
    <>
      {isOpen ? (
        <LoginOtpWidget onShowPhone={close} />
      ) : (
        <LoginPhoneNumberWidget onShowOTP={open} />
      )}
    </>
  );
}
