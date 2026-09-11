import { useContext } from 'react';
import {
  ActionCreateCommentPayload,
  ActionEditCommentPayload,
} from '../../store/modalComment';
import { Comment } from '../../types/comment';
import { Draggable } from '../Draggable';
import CommentCard from './CommentCard';
import CommentWrapper from './CommentWrapper';
import EventListLabel from './EventListLabel';
import { StoreContext } from '../../store';
import { DraggableCommentProps } from '../../types/dragAndDrop';
import { Droppable } from '../Droppable';
import FullPageLoader from '../FullPageLoader';
import { useDeleteCommentWithChildren } from '../../hooks/useDeleteCommentWithChildren';
import { useLeaveEvent } from '../../hooks/useLeaveEvent';
import { usePermission } from '../../hooks/usePermission';
import { useShowError } from '../../hooks/useShowError';
import { linkedEventIds } from '../../utils/mapping';

export default function CommentAndChildren(props: DraggableCommentProps) {
  const comment = props.comment;
  const {
    homePage: homePageContext,
    topicPage: topicPageContext,
    currentPage,
    user: userContext,
    mode: modeContext,
  } = useContext(StoreContext);

  const { deleteCommentWithChildren } = useDeleteCommentWithChildren();
  const { leave, loading: leaveLoading } = useLeaveEvent();
  const { isReadOnly, getWriterEvent, canManage, canLeave } = usePermission();
  const showError = useShowError();

  const getCardBgClass = (comment: Comment): string => {
    const hasChildren = comment.comments.length > 0;
    if (hasChildren) {
      switch (props.level % 3) {
        case 0:
          return 'bg-white';
        case 1:
          return 'bg-[#f5fbff]';
        case 2:
          return 'bg-[#cae8ff]';
      }
    } else {
      switch (props.level % 3) {
        case 0:
          return 'bg-[#cae8ff]';
        case 1:
          return 'bg-white';
        case 2:
          return 'bg-[#f5fbff]';
      }
    }
    return 'bg-white';
  };

  const openModal = (
    payload: ActionCreateCommentPayload | ActionEditCommentPayload
  ) => {
    if (currentPage.value === 'topic') {
      topicPageContext.modalComment.dispatch({ type: 'OPEN_MODAL', payload });
    }
    if (currentPage.value === 'all-topic') {
      homePageContext.modalCommentSideSection.dispatch({
        type: 'OPEN_MODAL',
        payload,
      });
    }
  };

  const handleDeleteComment = async () => {
    if (!(await deleteCommentWithChildren(comment))) {
      showError({ title: 'ลบไม่สำเร็จ', message: 'กรุณาลองใหม่อีกครั้ง' });
    }
  };

  const hasPermissionToEdit = () =>
    modeContext.value !== 'view' && canManage(comment);

  const canAddComment = () => {
    if (modeContext.value === 'view') return false;
    if (userContext.userState?.role === 'user') return false;
    return true;
  };

  return (
    <Draggable
      id={comment.id}
      data={{ comment, level: props.level }}
      disabled={!hasPermissionToEdit()}
    >
      <div className="w-full flex flex-col">
        {leaveLoading && <FullPageLoader />}
        <Droppable
          id={`droppable-comment-${comment.id}`}
          data={{ type: 'comment', comment }}
        >
          {isOver => (
            <>
              <CommentCard
                comment={comment}
                bgClass={getCardBgClass(comment)}
                onClickAddComment={() =>
                  openModal({
                    mode: 'create',
                    parentTopicId: comment.parent_topic_id,
                    parentCommentIds: [
                      ...comment.parent_comment_ids,
                      comment.id,
                    ],
                  })
                }
                onClickDelete={handleDeleteComment}
                onClickEdit={() =>
                  openModal({ mode: 'edit', defaultState: comment })
                }
                isOver={isOver}
                canEdit={hasPermissionToEdit()}
                canAddComment={canAddComment()}
              />
              <EventListLabel
                label="จากวง"
                className="pt-2 pl-2"
                eventIds={linkedEventIds(comment)}
                activeEventId={getWriterEvent()?.id}
                canLeave={!isReadOnly() && canLeave(comment)}
                onLeave={() => leave(comment)}
              />
            </>
          )}
        </Droppable>
        {comment.comments.length > 0 && (
          <div className="ml-8.75">
            <CommentWrapper
              comments={comment.comments}
              level={props.level + 1}
            />
          </div>
        )}
      </div>
    </Draggable>
  );
}
