import { useEffect, useRef } from 'react';

interface AlertPopupProps {
  visible: boolean;
  onClose: () => void;
  onUndo?: () => void;
  mode: 'copy' | 'paste' | 'error';
  title?: string;
  message?: string;
}

export default function AlertPopup({
  visible,
  onClose,
  onUndo,
  mode,
  title,
  message,
}: AlertPopupProps) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // Keyed on the content, not on `onClose`: call sites pass an inline closure,
  // so depending on it would restart the countdown on every parent render.
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => onCloseRef.current(), 3000);
    return () => clearTimeout(timer);
  }, [visible, mode, message]);

  return (
    <>
      {visible && (
        <div
          className={`flex flex-wrap items-center justify-center gap-2 rounded-2xl p-4 text-b3 text-gray-8 shadow-sm ${
            mode === 'error' ? 'bg-red-2' : 'bg-green-3'
          }`}
        >
          <span className={mode === 'error' ? undefined : 'wv-bold'}>
            {mode === 'error' && title && (
              <span className="font-bold text-red-7">{title} </span>
            )}
            {mode === 'error' && message}
            {mode === 'copy' && '🎉 คัดลอกไปยังคลิปบอร์ดแล้ว'}
            {mode === 'paste' && '🎉 ย้ายแล้ว!'}
          </span>
          {mode === 'error' ? (
            <span
              className="px-0.5 text-gray-7 underline hover:cursor-pointer"
              onClick={onClose}
            >
              ปิด
            </span>
          ) : (
            <div className="flex items-center justify-center gap-0.5">
              {mode === 'copy' ? (
                <span className="px-0.5">hover ตำแหน่งที่ต้องการย้าย</span>
              ) : (
                <span
                  className="px-0.5 text-blue-6 underline hover:cursor-pointer"
                  onClick={() => {
                    onUndo?.();
                    onClose();
                  }}
                >
                  เลิกทำ
                </span>
              )}

              <span className="align-center flex h-4 w-4 justify-center rounded-xs border border-gray-5 text-gray-7">
                ⌘
              </span>

              <span className="align-center flex h-4 w-4 justify-center rounded-xs border border-gray-5 text-gray-7">
                {mode === 'copy' ? 'V' : 'Z'}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
