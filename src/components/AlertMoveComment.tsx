import { useEffect } from "react";

interface AlertPopupProps {
  visible: boolean;
  onClose: () => void;
  onUndo: () => void;
}

export default function AlertPopup({
  visible,
  onClose,
  onUndo,
}: AlertPopupProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <>
      {visible && (
        <div className="bg-gray8 text-white text-[10px] py-[4px] px-[6px] rounded-[3px] shadow-lg flex flex-col items-center gap-[2px]">
          <span className="wv-bold">🎉 ย้ายแล้ว!</span>
          <div className="flex items-center justify-center gap-[2px]">
            <span
              className="text-accent underline px-[2px] hover:cursor-pointer"
              onClick={() => {
                onUndo();
                onClose();
              }}
            >
              เลิกทำ
            </span>
            <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
              ⌘
            </span>
            <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
              Z
            </span>
          </div>
        </div>
      )}
    </>
  );
}
