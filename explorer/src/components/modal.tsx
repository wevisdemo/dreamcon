import { useEffect, type HTMLAttributes } from 'react';
import { createPortal } from 'react-dom';
import { CloseIcon } from '../icons/close';

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
  mount?: 'body' | 'parent';
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
      className={`${mount === 'body' ? 'fixed z-40' : 'absolute z-10 rounded-[inherit]'} inset-0 flex items-center justify-center bg-black/50 p-4`}
    >
      <div
        role="dialog"
        aria-modal
        className={`relative flex max-h-full w-full max-w-xl flex-col overflow-y-auto rounded-2xl bg-white p-6 shadow-[3px_7px_17.2px_#0000001a] ${className}`}
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
        {children}
      </div>
    </div>
  );

  return mount === 'body' ? createPortal(backdrop, document.body) : backdrop;
}
