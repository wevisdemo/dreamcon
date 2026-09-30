import { createPortal } from 'react-dom';

/** Portalled to `body` so a loader rendered inside a stacking context (e.g. a modal section) still covers the page. */
const FullPageLoader = () => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-1/30">
      <div className="h-16 w-16 animate-spin rounded-full border-4 border-blue-6 border-t-transparent"></div>
    </div>,
    document.body
  );
};

export default FullPageLoader;
