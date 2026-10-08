import { useEffect, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../icons/close';

const mounts = {
  body: { backdrop: 'fixed z-40', dialog: 'max-w-210', content: 'p-6 md:p-10' },
  parent: {
    backdrop: 'absolute z-10 rounded-[inherit]',
    dialog: 'max-w-xl',
    content: 'p-6',
  },
};

export function Modal({
  isOpen,
  onClose,
  mount = 'body',
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  onClose: () => void;
  mount?: keyof typeof mounts;
}) {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) =>
      event.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const backdrop = (
    <div
      onClick={event => event.target === event.currentTarget && onClose()}
      className={`${mounts[mount].backdrop} inset-0 flex items-center justify-center bg-black/50 p-4`}
    >
      <div
        role="dialog"
        aria-modal
        className={`relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[3px_7px_17.2px_#0000001a] ${mounts[mount].dialog}`}
        {...props}
      >
        <button
          type="button"
          aria-label="ปิด"
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer text-blue-7 hover:text-blue-8"
        >
          <CloseIcon className="size-6" />
        </button>
        <div
          className={`flex min-h-0 scrollbar-thin [scrollbar-color:var(--color-gray-3)_transparent] flex-col overflow-y-auto ${mounts[mount].content} ${className}`}
        >
          {children}
        </div>
      </div>
    </div>
  );

  return mount === 'body' ? createPortal(backdrop, document.body) : backdrop;
}
