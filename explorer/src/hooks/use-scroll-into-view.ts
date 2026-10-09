import { useCallback } from 'react';

const SETTLE_DELAY = 100;

const getScrollParent = (element: HTMLElement): Element => {
  const parent = element.parentElement;
  if (!parent) return document.scrollingElement ?? document.documentElement;
  return ['auto', 'scroll'].includes(getComputedStyle(parent).overflowY)
    ? parent
    : getScrollParent(parent);
};

const reveal = (target: HTMLElement, container: Element) => {
  const isPage = container === document.scrollingElement;
  const view = isPage
    ? { top: 0, bottom: container.clientHeight }
    : container.getBoundingClientRect();
  const style = getComputedStyle(target);
  const rect = target.getBoundingClientRect();
  const top = rect.top - parseFloat(style.scrollMarginTop);
  const bottom = rect.bottom + parseFloat(style.scrollMarginBottom);
  const offsetTop = top - view.top;
  const isTaller = bottom - top > view.bottom - view.top;

  container.scrollBy({
    top:
      isTaller || offsetTop < 0 ? offsetTop : Math.max(bottom - view.bottom, 0),
  });
};

/**
 * Scrolls the nearest scrollable ancestor, or the page, to reveal the selected
 * element, honoring its `scroll-margin`. Waits for running transitions (like
 * expanding items) and re-reveals whenever the element stops resizing (like a
 * reflowing layout) while it stays selected. An element taller than the view
 * is aligned to its top and overflows at the bottom. Offset it from sticky
 * headers with `scroll-margin` on the target.
 *
 * @param selectedKey - Key of the selected item, or `undefined` for none
 * @returns Callback ref to attach to the selected element only
 */
export function useScrollIntoView(selectedKey?: string) {
  return useCallback(
    (target: HTMLElement | null) => {
      if (selectedKey === undefined || !target) return;

      const container = getScrollParent(target);
      let isCancelled = false;
      let timeout: ReturnType<typeof setTimeout>;
      const observer = new ResizeObserver(() => {
        clearTimeout(timeout);
        timeout = setTimeout(() => reveal(target, container), SETTLE_DELAY);
      });

      Promise.allSettled(
        container
          .getAnimations({ subtree: true })
          .map(({ finished }) => finished)
      ).then(() => {
        if (!isCancelled) observer.observe(target);
      });

      return () => {
        isCancelled = true;
        observer.disconnect();
        clearTimeout(timeout);
      };
    },
    [selectedKey]
  );
}
