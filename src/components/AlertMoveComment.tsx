import { useEffect } from 'react';

interface AlertPopupProps {
  visible: boolean;
  onClose: () => void;
  onUndo: () => void;
  mode: 'copy' | 'paste';
}

export default function AlertPopup({
  visible,
  onClose,
  onUndo,
  mode,
}: AlertPopupProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <>
      {visible && (
        <div className="bg-gray8 text-white text-[10px] py-[4px] px-[6px] rounded-[3px] shadow-lg flex flex-col items-center gap-[2px] z-50">
          <span className="wv-bold">
            🎉 {mode === 'copy' ? 'คัดลอกไปยังคลิปบอร์ดแล้ว' : 'ย้ายแล้ว!'}
          </span>
          <div className="flex items-center justify-center gap-[2px]">
            {mode === 'copy' ? (
              <span className=" px-[2px] ">hover ตำแหน่งที่ต้องการย้าย</span>
            ) : (
              <span
                className="text-accent underline px-[2px] hover:cursor-pointer"
                onClick={() => {
                  onUndo();
                  onClose();
                }}
              >
                เลิกทำ
              </span>
            )}

            <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
              ⌘
            </span>

            <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
              {mode === 'copy' ? 'V' : 'Z'}
            </span>
          </div>
        </div>
      )}
    </>
  );
}
