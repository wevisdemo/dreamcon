import { useEffect, useState, type HTMLAttributes } from 'react';
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

  const [hasOpened, setHasOpened] = useState(isOpen);
  const [content, setContent] = useState(children);

  if (isOpen && !hasOpened) setHasOpened(true);
  if (isOpen && content !== children) setContent(children);

  if (!hasOpened) return null;

  const backdrop = (
    <div
      inert={!isOpen}
      onClick={event => event.target === event.currentTarget && onClose()}
      className={`${mounts[mount].backdrop} inset-0 flex items-center justify-center bg-black/50 p-4 motion-safe:transition-[opacity,visibility] motion-safe:duration-200 ${isOpen ? 'starting:opacity-0' : 'invisible opacity-0'}`}
    >
      <div
        role="dialog"
        aria-modal
        className={`relative flex max-h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[3px_7px_17.2px_#0000001a] motion-safe:transition-[translate,scale] motion-safe:duration-200 ${isOpen ? 'starting:translate-y-4 starting:scale-95' : 'translate-y-4 scale-95'} ${mounts[mount].dialog}`}
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
          {isOpen ? children : content}
        </div>
      </div>
    </div>
  );

  return mount === 'body' ? createPortal(backdrop, document.body) : backdrop;
}
