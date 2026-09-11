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
        return 'bg-green-light';
      case CommentView.PARTIAL_AGREE:
        return 'bg-yellow-3';
      case CommentView.DISAGREE:
        return 'bg-red-2';
    }
  };

  return (
    <div
      className="w-full h-screen inset-0 bg-transparent flex items-center justify-center z-50"
      onClick={handleBackdropClick}
    >
      <div className="flex flex-col w-full md:max-w-120 bg-white md:rounded-lg shadow-lg m-5 rounded-lg overflow-hidden">
        <div className="flex flex-col gap-3 bg-gray-1 p-4 border-solid border-b border-gray-3">
          <div className="flex justify-end items-center mt-2 relative">
            <p className="absolute wv-ibmplex text-b2 text-blue-7 wv-bold left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 px-2">
              {state.mode === 'create'
                ? 'เพิ่มข้อถกเถียงต่อยอด'
                : 'แก้ไขข้อถกเถียงต่อยอด'}
            </p>

            <div
              className="text-gray-5 wv-ibmplex underline hover:cursor-pointer"
              onClick={handleClose}
            >
              ยกเลิก
            </div>
          </div>
          {state.mode === 'create' && (
            <>
              <div className="flex gap-2 items-center">
                <img
                  className="rounded-full w-6.25 h-6.25"
                  src={getParentEvent()?.avatar_url}
                  alt={`avatar-event-${getParentEvent()?.display_name}`}
                />
                <span className="text-label-sm wv-bold">
                  {getParentEvent()?.display_name}
                </span>
              </div>
              <div className="p-2.5 rounded-2xl bg-white">
                {state.fromTopic && state.fromTopic.title}
                {state.fromComment && (
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-3 h-3 rounded-full ${viewColor(
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
        <div className="p-4 flex flex-col space-y-3">
          <p>คุณคิดอย่างไรกับข้อถกเถียงนี้</p>
          <div className="flex space-x-2">
            <button
              className={`py-2.5 ${
                commentView === CommentView.AGREE
                  ? 'bg-green-light'
                  : 'bg-green-light/25'
              } hover:bg-green-light border-solid border border-green-light rounded-full w-full`}
              onClick={() => setCommentView(CommentView.AGREE)}
            >
              เห็นด้วย
            </button>
            <button
              className={`py-2.5 ${
                commentView === CommentView.PARTIAL_AGREE
                  ? 'bg-yellow-3'
                  : 'bg-yellow-3/25'
              } hover:bg-yellow-3 border-solid border border-yellow-3 rounded-full w-full`}
              onClick={() => setCommentView(CommentView.PARTIAL_AGREE)}
            >
              เห็นด้วยบ้าง
            </button>
            <button
              className={`py-2.5 ${
                commentView === CommentView.DISAGREE
                  ? 'bg-red-2'
                  : 'bg-red-2/25'
              } hover:bg-red-2 border-solid border border-red-2 rounded-full w-full
          `}
              onClick={() => setCommentView(CommentView.DISAGREE)}
            >
              ไม่เห็นด้วย
            </button>
          </div>
          <div className="w-full rounded-[5px] border border-gray-1 overflow-hidden">
            <div className="px-2.5 py-2 bg-gray-2 flex gap-1">
              <span>ความคิดเห็นของ</span>
              <img src="/icon/community.svg" alt="icon-community" />
              <span>{createdByEvent?.display_name}</span>
            </div>
            <div className="w-full bg-gray-1 relative">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full bg-gray-1 p-2.5 text-black resize-none overflow-hidden focus:outline-none"
                value={text}
                onChange={e => setText(e.target.value)}
                autoFocus
                maxLength={140}
                placeholder="เพราะว่า...(140ตัวอักษร)"
              />
              {canSubmit() && (
                <img
                  className="w-4.5 h-4.5 absolute bottom-2.5 right-2.5 hover:cursor-pointer"
                  src="/icon/upload.svg"
                  alt="upload-icon"
                  onClick={onSubmit}
                />
              )}
            </div>
          </div>
          <span className="text-gray-7">{text.length}/140</span>
        </div>
      </div>
    </div>
  );
}
