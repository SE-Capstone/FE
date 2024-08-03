import { renderHook, act } from '@testing-library/react-hooks';

import { useIsOpen } from './use-is-open';

describe('useIsOpen hook', () => {
  test('should open the state', () => {
    const { result } = renderHook(() => useIsOpen());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.open();
    });

    expect(result.current.isOpen).toBe(true);
  });

  test('should close the state', () => {
    const { result } = renderHook(() => useIsOpen());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.close();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test('should toggle the state', () => {
    const { result } = renderHook(() => useIsOpen());

    expect(result.current.isOpen).toBe(false);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });

  test('should define initial state', () => {
    const { result } = renderHook(() => useIsOpen(true));

    expect(result.current.isOpen).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(result.current.isOpen).toBe(false);
  });
});
