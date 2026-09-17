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
      className="pointer-events-auto flex h-full w-full items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div
        role="dialog"
        aria-modal
        aria-labelledby={titleId}
        className="m-5 flex w-full flex-col shadow-lg md:max-w-120"
      >
        <h2
          id={titleId}
          className="wv-ibmplex rounded-t-lg border-b border-solid border-gray-2 bg-white pt-5 pb-4 text-center text-b2 font-bold text-blue-7"
        >
          {props.title}
        </h2>
        <div className="flex flex-col gap-3 rounded-b-lg bg-gray-1 p-4">
          {props.children}
          <button
            className="wv-ibmplex mt-1 text-gray-5 underline hover:cursor-pointer"
            onClick={props.onClose}
          >
            ปิด
          </button>
        </div>
      </div>
    </div>
  );
}
