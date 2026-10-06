import { Children, useEffect, useRef, useState, type ReactNode } from 'react';

const prerenderColumns = 3;

export function Masonry({
  maxColumnWidth,
  className = '',
  children,
}: {
  maxColumnWidth: number;
  className?: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [columns, setColumns] = useState(prerenderColumns);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new ResizeObserver(([{ contentRect }]) => {
      const gap = parseFloat(getComputedStyle(element).columnGap) || 0;
      setColumns(
        Math.max(
          1,
          Math.ceil((contentRect.width + gap) / (maxColumnWidth + gap))
        )
      );
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [maxColumnWidth]);

  const items = Children.toArray(children);

  return (
    <div ref={ref} className={`flex items-start ${className}`}>
      {Array.from({ length: columns }, (_, column) => (
        <div
          key={column}
          className="flex min-w-0 flex-1 flex-col gap-[inherit]"
        >
          {items.filter((_, index) => index % columns === column)}
        </div>
      ))}
    </div>
  );
}
