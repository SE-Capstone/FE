import { useEffect, useState } from 'react';

export const useCountDownTimer = (initValue?: { seconds: number; minutes: number }) => {
  const [minutes, setMinutes] = useState(initValue?.minutes ?? 1);
  const [seconds, setSeconds] = useState(initValue?.seconds ?? 30);

  useEffect(() => {
    const interval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }

      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(interval);
        } else {
          setSeconds(59);
          setMinutes(minutes - 1);
        }
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [minutes, seconds]);

  const resetTimer = () => {
    setMinutes(initValue?.seconds ?? 1);
    setSeconds(initValue?.minutes ?? 30);
  };

  const times =
    minutes <= 0 || seconds <= 0
      ? `${minutes < 10 ? `0${minutes}` : minutes}:
  ${seconds < 10 ? `0${seconds}` : seconds}`
      : '';

  const isRetried = !!times;

  const isDisabled = seconds > 0 || minutes > 0;

  return { resetTimer, times, isDisabled, isRetried };
};
