import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ChevronDownIcon } from '../../icons/chevron-down';

const EDGE_TOLERANCE = 1;

const arrowClassName =
  'flex size-5 shrink-0 cursor-pointer items-center justify-center text-blue-7 hover:text-blue-8 disabled:cursor-default disabled:opacity-30 disabled:hover:text-blue-7 md:size-10';

export function Carousel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [edges, setEdges] = useState({ isStart: true, isEnd: true });

  const updateEdges = () => {
    const track = trackRef.current;
    if (!track) return;
    setEdges({
      isStart: track.scrollLeft <= EDGE_TOLERANCE,
      isEnd:
        track.scrollLeft + track.clientWidth >=
        track.scrollWidth - EDGE_TOLERANCE,
    });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new ResizeObserver(updateEdges);
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  const scrollByItem = (direction: 1 | -1) => {
    const track = trackRef.current;
    const item = track?.firstElementChild;
    if (!track || !item) return;
    const gap = parseFloat(getComputedStyle(track).columnGap);
    track.scrollBy({
      left: direction * (item.getBoundingClientRect().width + gap),
    });
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="flex w-full items-center gap-1 px-1 md:gap-2.5 md:px-2.5"
    >
      <button
        type="button"
        aria-label="ก่อนหน้า"
        disabled={edges.isStart}
        onClick={() => scrollByItem(-1)}
        className={arrowClassName}
      >
        <ChevronDownIcon className="size-5 rotate-90 md:size-8" />
      </button>
      <ul
        ref={trackRef}
        onScroll={updateEdges}
        className="flex min-w-0 flex-1 snap-x scrollbar-none gap-2.5 overflow-x-auto motion-safe:scroll-smooth"
      >
        {children}
      </ul>
      <button
        type="button"
        aria-label="ถัดไป"
        disabled={edges.isEnd}
        onClick={() => scrollByItem(1)}
        className={arrowClassName}
      >
        <ChevronDownIcon className="size-5 -rotate-90 md:size-8" />
      </button>
    </div>
  );
}
