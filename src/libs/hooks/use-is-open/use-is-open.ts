import React from 'react';

/**
 * It returns an object with a boolean value, a function to open the boolean, a function to close the
 * boolean, and a function to toggle the boolean
 * @param [initial=false] - The initial state of the component.
 * @returns An object with the following properties:
 *   isOpen: A boolean value that represents the state.
 *   open: A function that sets the state to true.
 *   close: A function that sets the state to false.
 *   toggle: A function that toggles the state.
 */
export const useIsOpen = (initial = false) => {
  const [isOpen, setIsOpen] = React.useState(initial);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((state) => !state), []);

  return { isOpen, open, close, toggle };
};
