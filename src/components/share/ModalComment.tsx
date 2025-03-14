import React, { useEffect, useState } from "react";
import {
  AddOrEditCommentPayload,
  Comment,
  CommentView,
} from "../../types/comment";

interface PropTypes {
  mode: "create" | "edit";
  defaultState?: Comment;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (mode: "create" | "edit", payload: AddOrEditCommentPayload) => void;
  parentTopicId?: string;
  parentCommentIds?: string[];
}

export default function ModalComment(props: PropTypes) {
  const [text, setText] = useState<string>("");
  const [commentView, setCommentView] = useState<CommentView | null>(null);
  useEffect(() => {
    setText(props.defaultState?.reason || "");
    setCommentView(props.defaultState?.comment_view || null);
  }, [props.defaultState]);
  if (!props.isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setText("");
    setCommentView(null);
    props.onClose();
  };

  const getConfirmStyle = () =>
    !isPostDisabled()
      ? "rounded-[48px] py-[10px] px-[16px] bg-[#2579F5] text-16 text-white wv-ibmplex wv-bold leading-[19px] shadow-md"
      : "rounded-[48px] py-[10px] px-[16px] bg-[#E8E8E8] text-16 text-[#979797] wv-ibmplex wv-bold leading-[19px]";

  const isPostDisabled = () => text === "" || commentView === null;

  const getCommentViewStyle =
    "rounded-[48px] py-[10px] px-[16px] text-[13px] leading-[13px] border-[1px]";

  const getCommentViewColor = (view: CommentView) => {
    switch (view) {
      case CommentView.AGREE:
        return "#6AB193";
      case CommentView.PARTIAL_AGREE:
        return "#D29C13";
      case CommentView.DISAGREE:
        return "#CB3535";
    }
  };

  const onSubmit = () => {
    if (commentView && text) {
      switch (props.mode) {
        case "edit":
          props.onSubmit(props.mode, {
            id: props.defaultState?.id,
            comment_view: commentView,
            reason: text,
            parent_comment_ids: props.defaultState?.parent_comment_ids,
            parent_topic_id: props.defaultState?.parent_topic_id,
          });
          break;
        case "create":
          props.onSubmit(props.mode, {
            comment_view: commentView,
            reason: text,
            parent_comment_ids: props.parentCommentIds,
            parent_topic_id: props.parentTopicId,
          });
          break;
      }
      handleClose();
    }
  };

  const data = [
    {
      text: "เห็นด้วย",
      color: getCommentViewColor(CommentView.AGREE),
    },

    {
      text: "เห็นด้วยบางส่วน",
      color: getCommentViewColor(CommentView.PARTIAL_AGREE),
    },
    {
      text: "ไม่เห็นด้วย",
      color: getCommentViewColor(CommentView.DISAGREE),
    },
  ];

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col w-full h-full md:h-[480px] md:max-w-[480px] bg-white md:rounded-lg shadow-lg m-[20px]">
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
            disabled={text === "" || commentView === null}
          >
            {props.mode === "edit" ? "แก้ไข" : "โพสต์"}
          </button>
        </div>
        <div className="p-[16px] flex flex-col space-y-[8px]">
          <p>คุณคิดอย่างไรกับข้อถกเถียงนี้</p>
          <div className="flex space-x-[8px]">
            {data.map((item, index) => (
              <button
                key={index}
                className={getCommentViewStyle}
                style={{
                  borderColor: item.color,
                  color: commentView === item.text ? "#FFFFFF" : item.color,
                  backgroundColor:
                    commentView === item.text ? item.color : "transparent",
                }}
                onClick={() => setCommentView(item.text as CommentView)}
              >
                {item.text}
              </button>
            ))}
          </div>
        </div>
        <div className="p-[16px] h-full flex flex-col">
          <span className="text-[#6E6E6E]">{text.length}/140</span>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-full resize-none focus:outline-none"
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
