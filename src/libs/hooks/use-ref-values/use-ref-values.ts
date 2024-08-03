import { useRef, useCallback } from 'react';

export function useRefValues<T>(defaultValue: T | undefined = undefined) {
  const ref = useRef<T>(defaultValue as T);

  const setValues = useCallback((values: T) => {
    if (values) {
      if (typeof values === 'object') {
        ref.current = { ...ref.current, ...values };
        return;
      }
      if (Array.isArray(values)) {
        (ref.current as T[]) = [...(ref.current as T[]), values];
        return;
      }

      ref.current = values;
    }
  }, []);

  const resetValues = useCallback(() => defaultValue, [defaultValue]);

  return [ref, setValues, resetValues] as const;
}
