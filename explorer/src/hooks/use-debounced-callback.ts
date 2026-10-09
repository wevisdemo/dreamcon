import { useEffect, useRef } from 'react';

/**
 * Delays a callback until calls stop for `delay` milliseconds. A pending call
 * is dropped when the component unmounts.
 *
 * @param callback - Function to call with the latest arguments
 * @param delay - Milliseconds to wait after the last call
 * @returns `debounced` to schedule a call, and `flush` to call right away
 * instead of any pending call
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) {
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timeout.current), []);

  return {
    debounced: (...args: Args) => {
      clearTimeout(timeout.current);
      timeout.current = setTimeout(() => callback(...args), delay);
    },
    flush: (...args: Args) => {
      clearTimeout(timeout.current);
      callback(...args);
    },
  };
}
