import { useState, useEffect, useCallback } from 'react';

export function useDebounce<T>(initialValue: T, timeDelay = 600): [T, (value: T) => void, T] {
  const [value, setValue] = useState<T>(initialValue);
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

  useEffect(() => {
    const debounceTimeOutId = setTimeout(() => setDebouncedValue(value), timeDelay);

    return () => clearTimeout(debounceTimeOutId);
  }, [value, timeDelay]);

  const memoSetValue = useCallback(setValue, [setValue]);

  return [debouncedValue, memoSetValue, value];
}
