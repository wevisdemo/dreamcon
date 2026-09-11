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
          className={`flex flex-wrap items-center justify-center gap-2 text-gray8 text-b3 p-4 rounded-2xl shadow-sm ${
            mode === 'error' ? 'bg-lightRed' : 'bg-green3'
          }`}
        >
          <span className={mode === 'error' ? undefined : 'wv-bold'}>
            {mode === 'error' && title && (
              <span className="font-bold text-red-700">{title} </span>
            )}
            {mode === 'error' && message}
            {mode === 'copy' && '🎉 คัดลอกไปยังคลิปบอร์ดแล้ว'}
            {mode === 'paste' && '🎉 ย้ายแล้ว!'}
          </span>
          {mode === 'error' ? (
            <span
              className="text-gray7 underline px-0.5 hover:cursor-pointer"
              onClick={onClose}
            >
              ปิด
            </span>
          ) : (
            <div className="flex items-center justify-center gap-0.5">
              {mode === 'copy' ? (
                <span className=" px-0.5 ">hover ตำแหน่งที่ต้องการย้าย</span>
              ) : (
                <span
                  className="text-accent underline px-0.5 hover:cursor-pointer"
                  onClick={() => {
                    onUndo?.();
                    onClose();
                  }}
                >
                  เลิกทำ
                </span>
              )}

              <span className="flex justify-center align-center w-4 h-4 text-gray7 rounded-xs border-gray5 border">
                ⌘
              </span>

              <span className="flex justify-center align-center w-4 h-4 text-gray7 rounded-xs border-gray5 border">
                {mode === 'copy' ? 'V' : 'Z'}
              </span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
