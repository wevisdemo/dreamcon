import type { HTMLAttributes } from 'react';

export function Sidebar({
  isOpen,
  side,
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLElement> & {
  isOpen: boolean;
  side: 'left' | 'right';
}) {
  return (
    <div
      className={`flex shrink-0 overflow-clip motion-safe:transition-[width] motion-safe:duration-300 ${side === 'right' ? 'justify-end' : ''} ${isOpen ? 'md:w-115' : 'md:w-0'}`}
    >
      <aside
        inert={!isOpen}
        className={`fixed inset-0 z-20 flex flex-col motion-safe:transition-[translate,visibility] motion-safe:duration-300 md:sticky md:top-19 md:z-auto md:h-[calc(100dvh-(--spacing(24)))] md:w-110 md:shrink-0 md:rounded-2xl ${isOpen ? '' : `invisible ${side === 'left' ? '-translate-x-full' : 'translate-x-full'}`} ${className}`}
        {...props}
      >
        {children}
      </aside>
    </div>
  );
}
