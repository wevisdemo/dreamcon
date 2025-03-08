import { AddOrEditTopicPayload, Topic } from "../../types/topic";
import React, { useEffect, useState } from "react";

interface PropTypes {
  mode: "create" | "edit";
  defaultState?: Topic;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: "create" | "edit", payload: AddOrEditTopicPayload) => void;
}

export default function ModalTopic(props: PropTypes) {
  const [text, setText] = useState<string>("");

  useEffect(() => {
    setText(props.defaultState?.title || "");
  }, [props.defaultState]);

  if (!props.isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setText("");
    props.onClose();
  };

  const getConfirmStyle = () =>
    text
      ? "rounded-[48px] py-[10px] px-[16px] bg-[#2579F5] text-16 text-white wv-ibmplex wv-bold leading-[19px] shadow-md"
      : "rounded-[48px] py-[10px] px-[16px] bg-[#E8E8E8] text-16 text-[#979797] wv-ibmplex wv-bold leading-[19px]";

  const onSubmit = () => {
    switch (props.mode) {
      case "create":
        props.onSubmit(props.mode, { title: text });
        break;
      case "edit":
        props.onSubmit(props.mode, { id: props.defaultState?.id, title: text });
        break;
    }
    handleClose();
  };

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full h-full md:h-[480px] md:max-w-[480px] bg-white md:rounded-lg shadow-lg">
        <div className="flex justify-between px-[16px] py-[12px] border-solid border-b-[1px] border-[#D4D4D4]">
          <button
            className="py-[10px] px-[16px] pl-0 text-16 wv-ibmplex wv-bold "
            onClick={handleClose}
          >
            ยกเลิก
          </button>
          <button
            className={getConfirmStyle()}
            onClick={onSubmit}
            disabled={text === ""}
          >
            {props.mode === "edit" ? "แก้ไข" : "โพสต์"}
          </button>
        </div>
        <div className="p-[16px] h-full flex flex-col">
          <span className="text-[#6E6E6E]">{text.length}/140</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full md:h-[360px] resize-none focus:outline-none"
            name="topic"
            id="topic"
            placeholder="คุณมีข้อถกเถียงว่า... &#10;ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
            maxLength={140}
          ></textarea>
        </div>
      </div>
    </div>
  );
}
