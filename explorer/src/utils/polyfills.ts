const definePolyfill = (name: string, value: unknown) => {
  if (!(name in Array.prototype)) {
    Object.defineProperty(Array.prototype, name, {
      value,
      configurable: true,
      writable: true,
    });
  }
};

/** Array methods missing on Safari < 16 (`toSorted`) and < 15.4 (`findLast`, `at`) */
definePolyfill('toSorted', function <
  T,
>(this: T[], compare?: (a: T, b: T) => number) {
  return [...this].sort(compare);
});

definePolyfill('findLast', function <
  T,
>(this: T[], predicate: (value: T, index: number, array: T[]) => boolean) {
  const index = this.reduce(
    (found, value, i, array) => (predicate(value, i, array) ? i : found),
    -1
  );
  return this[index];
});

definePolyfill('at', function <T>(this: T[], index: number) {
  const offset = Math.trunc(index) || 0;
  return this[offset < 0 ? this.length + offset : offset];
});
