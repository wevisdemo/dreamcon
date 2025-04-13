import {
  ModalTopicPayload,
  Topic,
  topicCategories,
  TopicCategory,
} from "../../types/topic";
import React, { useEffect, useState } from "react";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import Dropdown from "./Dropdown";
import { DreamConEvent } from "../../types/event";
interface PropTypes {
  mode: "create" | "edit";
  createdByEvent: DreamConEvent;
  defaultState?: Topic;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: "create" | "edit", payload: ModalTopicPayload) => void;
}

export default function ModalTopic(props: PropTypes) {
  const [text, setText] = useState<string>("");
  const [category, setCategory] = useState<TopicCategory | "">("");

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

  const onSubmit = () => {
    if (!category) return;
    switch (props.mode) {
      case "create":
        props.onSubmit(props.mode, {
          title: text,
          event_id: props.defaultState?.event_id,
          category,
        });
        break;
      case "edit":
        props.onSubmit(props.mode, {
          id: props.defaultState?.id,
          title: text,
          category: category,
          event_id: props.defaultState?.event_id,
        });
        break;
    }
    handleClose();
  };

  const canSubmit = () => {
    return text !== "" && category !== "";
  };

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent bg-opacity-50 flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="w-full md:max-w-[480px] bg-white md:rounded-lg shadow-lg">
        <div className="flex justify-between items-center px-[16px] py-[12px] border-solid border-b-[1px] border-[#D4D4D4] relative">
          <Dropdown
            onSelect={(v) => setCategory(v as TopicCategory)}
            options={topicCategories}
            placeholder="เลือกหัวข้อ"
          />
          <p className="absolute wv-ibmplex text-[16px] text-blue7 wv-bold left-[50%] top-[50%] translate-y-[-50%]  translate-x-[-50%] bg-white px-[8px]">
            {props.mode === "create"
              ? "เพิ่มข้อถกเถียงใหม่"
              : "แก้ไขข้อถกเถียง"}
          </p>

          <div
            className="text-gray5 wv-ibmplex underline hover:cursor-pointer"
            onClick={handleClose}
          >
            ยกเลิก
          </div>
        </div>

        <div className="p-[16px] h-full flex flex-col">
          <div className="flex gap-[8px] items-center">
            <img
              className="rounded-full w-[25px] h-[25px]"
              src={props.createdByEvent.avatar_url}
              alt={`avatar-event-${props.createdByEvent.display_name}`}
            />
            <span className="text-[10px] wv-bold">
              {props.createdByEvent.display_name}
            </span>
          </div>
          <div className="w-full rounded-[5px] border border-[1px] border-gray1 overflow-hidden mt-[16px]">
            <div className="px-[10px] py-[8px] bg-gray2">
              คุณมีข้อถกเถียงว่า...
            </div>
            <div className="w-full bg-gray1 relative">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full bg-gray1 p-[10px] text-gray5 resize-none overflow-hidden focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                maxLength={140}
                placeholder="ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
              />
              {canSubmit() && (
                <img
                  className="w-[18px] h-[18px] absolute bottom-[10px] right-[10px] hover:cursor-pointer"
                  src="/icon/upload.svg"
                  alt="upload-icon"
                  onClick={onSubmit}
                />
              )}
            </div>
          </div>
          <span className="text-[#6E6E6E]">{text.length}/140</span>
        </div>
      </div>
    </div>
  );
}
