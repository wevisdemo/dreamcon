import React, { useEffect, useState } from "react";
import {
  AddOrEditCommentPayload,
  Comment,
  CommentView,
} from "../../types/comment";
import { DreamConEvent } from "../../types/event";
import { Topic } from "../../types/topic";
import { TextareaAutosize } from "@mui/material";

// TODO: refactor to reduce props
interface PropTypes {
  mode: "create" | "edit";
  defaultState?: Comment;
  isOpen: boolean;
  createdByEvent: DreamConEvent;
  events: DreamConEvent[];
  fromTopic?: Topic;
  fromComment?: Comment;
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

  const getParentEvent = (): DreamConEvent | null => {
    if (props.fromTopic) {
      const event = props.events.find(
        (event) => event.id === props.fromTopic?.event_id
      );
      if (event) {
        return event;
      }
    }
    if (props.fromComment) {
      const event = props.events.find(
        (event) => event.id === props.fromComment?.event_id
      );
      if (event) {
        return event;
      }
    }
    return null;
  };

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

  const canSubmit = () => {
    return text !== "" && commentView !== null;
  };

  const viewColor = (comment: Comment) => {
    switch (comment.comment_view) {
      case CommentView.AGREE:
        return "lightGreen";
      case CommentView.PARTIAL_AGREE:
        return "lightYellow";
      case CommentView.DISAGREE:
        return "lightRed";
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
      <div className="flex flex-col w-full md:max-w-[480px] bg-white md:rounded-lg shadow-lg m-[20px] rounded-[8px] overflow-hidden">
        <div className="flex flex-col gap-[12px] bg-gray1 p-[16px] border-solid border-b-[1px] border-[#D4D4D4]">
          <div className="flex justify-end items-center mt-[8px] relative">
            <p className="absolute wv-ibmplex text-[16px] text-blue7 wv-bold left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] px-[8px]">
              {props.mode === "create"
                ? "เพิ่มข้อถกเถียงต่อยอด"
                : "แก้ไขข้อถกเถียงต่อยอด"}
            </p>

            <div
              className="text-gray5 wv-ibmplex underline hover:cursor-pointer"
              onClick={handleClose}
            >
              ยกเลิก
            </div>
          </div>
          {props.mode === "create" && (
            <>
              <div className="flex gap-[8px] items-center">
                <img
                  className="rounded-full w-[25px] h-[25px]"
                  src={getParentEvent()?.avatar_url}
                  alt={`avatar-event-${getParentEvent()?.display_name}`}
                />
                <span className="text-[10px] wv-bold">
                  {getParentEvent()?.display_name}
                </span>
              </div>
              <div className="p-[10px] rounded-[16px] bg-white">
                {props.fromTopic && props.fromTopic.title}
                {props.fromComment && (
                  <div className="flex gap-[8px] items-center">
                    <div
                      className={`w-[12px] h-[12px] rounded-full bg-${viewColor(
                        props.fromComment
                      )}`}
                    />
                    <span className="flex-1">{props.fromComment.reason}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="p-[16px] flex flex-col space-y-[12px]">
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
          <div className="w-full rounded-[5px] border border-[1px] border-gray1 overflow-hidden">
            <div className="px-[10px] py-[8px] bg-gray2 flex gap-[4px]">
              <span>ความคิดเห็นของ</span>
              <img src="/icon/community.svg" alt="icon-community" />
              <span>{props.createdByEvent.display_name}</span>
            </div>
            <div className="w-full bg-gray1 relative">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full bg-gray1 p-[10px] text-gray5 resize-none overflow-hidden focus:outline-none"
                value={text}
                onChange={(e) => setText(e.target.value)}
                autoFocus
                maxLength={140}
                placeholder="เพราะว่า...(140ตัวอักษร)"
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
