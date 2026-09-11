import { createPortal } from 'react-dom';

/** Portalled to `body` so a loader rendered inside a stacking context (e.g. a modal section) still covers the page. */
const FullPageLoader = () => {
  return createPortal(
    <div className="fixed inset-0 flex items-center justify-center bg-gray1/30 z-50">
      <div className="w-16 h-16 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
    </div>,
    document.body
  );
};

export default FullPageLoader;
