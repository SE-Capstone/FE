import type { MutableRefObject } from 'react';
import { useState, useRef, useEffect } from 'react';

/**
 * It returns a ref and a boolean value that will be true when the ref is hovered
 * @returns A ref and a boolean value.
 */
export function useHover<T extends HTMLElement = HTMLElement>(): [
  MutableRefObject<T | null>,
  boolean
] {
  const [value, setValue] = useState(false);
  const ref = useRef<T>(null);
  const handleMouseOver = (): void => setValue(true);
  const handleMouseOut = (): void => setValue(false);
  useEffect(
    () => {
      const node = ref.current;
      if (!node) return undefined;

      node.addEventListener('mouseover', handleMouseOver);
      node.addEventListener('mouseout', handleMouseOut);

      return () => {
        node.removeEventListener('mouseover', handleMouseOver);
        node.removeEventListener('mouseout', handleMouseOut);
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ref.current] // Recall only if ref changes
  );

  return [ref, value];
}
