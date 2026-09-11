import React, { useEffect, useState } from 'react';
import { Comment, CommentView } from '../../types/comment';
import { DreamConEvent } from '../../types/event';
import { CommentModalStore } from '../../store/modalComment';
import { useAddComment } from '../../hooks/useAddComment';
import { useEditComment } from '../../hooks/useEditComment';
import { usePermission } from '../../hooks/usePermission';
import { TextareaAutosize } from '@mui/material';
import FullPageLoader from '../FullPageLoader';

interface PropTypes {
  store: CommentModalStore;
  events: DreamConEvent[];
}

export default function ModalComment(props: PropTypes) {
  const { state } = props.store;
  const [text, setText] = useState<string>('');
  const [commentView, setCommentView] = useState<CommentView | null>(
    CommentView.AGREE
  );
  const { getWriterEvent } = usePermission();
  const { addNewComment, loading: addCommentLoading } = useAddComment();
  const { editComment, loading: editCommentLoading } = useEditComment();
  useEffect(() => {
    setText(state.defaultState?.reason || '');
    setCommentView(state.defaultState?.comment_view || CommentView.AGREE);
  }, [state.defaultState]);
  // Submitting closes the modal right away, so the save runs while it is closed.
  if (!state.isModalOpen) {
    return addCommentLoading || editCommentLoading ? <FullPageLoader /> : null;
  }

  const createdByEvent = getWriterEvent();

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleClose = () => {
    setText('');
    setCommentView(CommentView.AGREE);
    props.store.dispatch({ type: 'CLOSE_MODAL' });
  };

  const getParentEvent = (): DreamConEvent | null => {
    if (state.fromTopic) {
      const event = props.events.find(
        event => event.id === state.fromTopic?.event_ids[0]
      );
      if (event) {
        return event;
      }
    }
    if (state.fromComment) {
      const event = props.events.find(
        event => event.id === state.fromComment?.event_ids[0]
      );
      if (event) {
        return event;
      }
    }
    return null;
  };

  const onSubmit = () => {
    if (commentView && text) {
      switch (state.mode) {
        case 'edit':
          editComment({
            id: state.defaultState?.id,
            comment_view: commentView,
            reason: text,
            parent_comment_ids: state.defaultState?.parent_comment_ids,
            parent_topic_id: state.defaultState?.parent_topic_id,
            event_ids: state.defaultState?.event_ids ?? [],
          });
          break;
        case 'create':
          addNewComment({
            comment_view: commentView,
            reason: text,
            parent_comment_ids: state.parentCommentIds,
            parent_topic_id: state.parentTopicId,
            event_ids: createdByEvent ? [createdByEvent.id] : [],
          });
          break;
      }
      handleClose();
    }
  };

  const canSubmit = () => {
    return text !== '' && commentView !== null;
  };

  const viewColor = (comment: Comment) => {
    switch (comment.comment_view) {
      case CommentView.AGREE:
        return 'lightGreen';
      case CommentView.PARTIAL_AGREE:
        return 'lightYellow';
      case CommentView.DISAGREE:
        return 'lightRed';
    }
  };

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col w-full md:max-w-[480px] bg-white md:rounded-lg shadow-lg m-[20px] rounded-[8px] overflow-hidden">
        <div className="flex flex-col gap-[12px] bg-gray1 p-[16px] border-solid border-b-[1px] border-[#D4D4D4]">
          <div className="flex justify-end items-center mt-[8px] relative">
            <p className="absolute wv-ibmplex text-b2 text-blue7 wv-bold left-[50%] top-[50%] translate-y-[-50%] translate-x-[-50%] px-[8px]">
              {state.mode === 'create'
                ? 'เพิ่มข้อถกเถียงต่อยอด'
                : 'แก้ไขข้อถกเถียงต่อยอด'}
            </p>

            <div
              className="text-gray5 wv-ibmplex underline hover:cursor-pointer"
              onClick={handleClose}
            >
              ยกเลิก
            </div>
          </div>
          {state.mode === 'create' && (
            <>
              <div className="flex gap-[8px] items-center">
                <img
                  className="rounded-full w-[25px] h-[25px]"
                  src={getParentEvent()?.avatar_url}
                  alt={`avatar-event-${getParentEvent()?.display_name}`}
                />
                <span className="text-label-sm wv-bold">
                  {getParentEvent()?.display_name}
                </span>
              </div>
              <div className="p-[10px] rounded-[16px] bg-white">
                {state.fromTopic && state.fromTopic.title}
                {state.fromComment && (
                  <div className="flex gap-[8px] items-center">
                    <div
                      className={`w-[12px] h-[12px] rounded-full bg-${viewColor(
                        state.fromComment
                      )}`}
                    />
                    <span className="flex-1">{state.fromComment.reason}</span>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
        <div className="p-[16px] flex flex-col space-y-[12px]">
          <p>คุณคิดอย่างไรกับข้อถกเถียงนี้</p>
          <div className="flex space-x-[8px]">
            <button
              className={`py-[10px] ${
                commentView === CommentView.AGREE
                  ? 'bg-lightGreen'
                  : 'bg-lightGreen/25'
              } hover:bg-lightGreen border-solid border-[1px] border-lightGreen rounded-[48px] w-full`}
              onClick={() => setCommentView(CommentView.AGREE)}
            >
              เห็นด้วย
            </button>
            <button
              className={`py-[10px] ${
                commentView === CommentView.PARTIAL_AGREE
                  ? 'bg-lightYellow'
                  : 'bg-lightYellow/25'
              } hover:bg-lightYellow border-solid border-[1px] border-lightYellow rounded-[48px] w-full`}
              onClick={() => setCommentView(CommentView.PARTIAL_AGREE)}
            >
              เห็นด้วยบ้าง
            </button>
            <button
              className={`py-[10px] ${
                commentView === CommentView.DISAGREE
                  ? 'bg-lightRed'
                  : 'bg-lightRed/25'
              } hover:bg-lightRed border-solid border-[1px] border-lightRed rounded-[48px] w-full
          `}
              onClick={() => setCommentView(CommentView.DISAGREE)}
            >
              ไม่เห็นด้วย
            </button>
          </div>
          <div className="w-full rounded-[5px] border border-[1px] border-gray1 overflow-hidden">
            <div className="px-[10px] py-[8px] bg-gray2 flex gap-[4px]">
              <span>ความคิดเห็นของ</span>
              <img src="/icon/community.svg" alt="icon-community" />
              <span>{createdByEvent?.display_name}</span>
            </div>
            <div className="w-full bg-gray1 relative">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full bg-gray1 p-[10px] text-black resize-none overflow-hidden focus:outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
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
