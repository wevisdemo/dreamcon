import React, { ReactNode, useId } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';

interface PropTypes {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal(props: PropTypes) {
  const titleId = useId();

  useHotkeys('esc', () => props.onClose(), { enableOnFormTags: true });

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      props.onClose();
    }
  };

  return (
    <div
      className="w-full h-full pointer-events-auto flex items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="flex flex-col w-full md:max-w-120 bg-white shadow-lg m-5 rounded-lg"
      >
        <h2
          id={titleId}
          className="wv-ibmplex text-blue-7 text-b2 font-bold text-center pb-4 pt-5 border-solid border-b border-gray-2"
        >
          {props.title}
        </h2>
        <div className="flex flex-col gap-3 p-4">
          {props.children}
          <button
            className="text-gray-5 wv-ibmplex underline hover:cursor-pointer"
            onClick={props.onClose}
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
