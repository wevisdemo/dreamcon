import { useContext } from 'react';
import {
  ActionCreateCommentPayload,
  ActionEditCommentPayload,
} from '../../store/modalComment';
import { Comment } from '../../types/comment';
import { Draggable } from '../Draggable';
import CommentCard from './CommentCard';
import CommentWrapper from './CommentWrapper';
import { StoreContext } from '../../store';
import { Topic } from '../../types/topic';
import { DraggableCommentProps } from '../../types/dragAndDrop';
import { Droppable } from '../Droppable';
import { useDeleteCommentWithChildren } from '../../hooks/useDeleteCommentWithChildren';
import { DreamConEvent } from '../../types/event';
import { usePermission } from '../../hooks/usePermission';

interface PropTypes {
  comment: Comment;
  previousComment: Comment | null;
  nextComment: Comment | null;
  level: number;
  isLastChildOfParent?: boolean;
  parent: Topic | Comment;
}

export default function CommentAndChildren(props: PropTypes) {
  const comment = props.comment;
  const previousComment = props.previousComment;
  const nextComment = props.nextComment;
  const {
    homePage: homePageContext,
    topicPage: topicPageContext,
    currentPage,
    event: eventContext,
    user: userContext,
    mode: modeContext,
  } = useContext(StoreContext);

  const { deleteCommentWithChildren } = useDeleteCommentWithChildren();
  const { isWriterOwner } = usePermission();

  const isLastUltimateLastChild = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.level === 1 && currentComment.comments.length === 0) return true;
    if (!props.isLastChildOfParent) return false;
    if (nextComment !== null) return false;
    if ((currentComment.comments.length || 0) > 0) return false;
    return true;
  };

  const isRoundedTL = (previousComment: Comment | null): boolean => {
    if (props.level === 1) return true;
    if (showHeaderEvent(props.comment) !== null) return true;
    if ((previousComment?.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedTR = (): boolean => {
    if (props.level === 1) return true;
    if (showHeaderEvent(props.comment) !== null) return true;
    return false;
  };

  const isRoundedBL = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.level === 1) return true;
    if (nextComment === null) return true;
    if (nextComment !== null) {
      if (showHeaderEvent(nextComment) !== null) return true;
    }
    if ((currentComment.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedBR = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (nextComment !== null) {
      if (showHeaderEvent(nextComment) !== null) return true;
    }
    return (
      isLastUltimateLastChild(currentComment, nextComment) ||
      hasNoSameEventChildren(currentComment)
    );
  };

  const hasNoSameEventChildren = (comment: Comment): boolean => {
    if (comment.comments.length === 0) return true;
    const hasSameEventChildren = comment.comments.some(
      childComment => childComment.event_ids[0] === comment.event_ids[0]
    );
    return !hasSameEventChildren;
  };

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

  const handleAddComment = (comment: Comment) => {
    const payload: ActionCreateCommentPayload = {
      mode: 'create',
      parentTopicId: comment.parent_topic_id,
      parentCommentIds: [...comment.parent_comment_ids, comment.id],
      fromComment: comment,
    };
    if (currentPage.value === 'topic') {
      topicPageContext.modalComment.dispatch({
        type: 'OPEN_MODAL',
        payload,
      });
    }
    if (currentPage.value === 'all-topic') {
      homePageContext.modalCommentSideSection.dispatch({
        type: 'OPEN_MODAL',
        payload,
      });
    }
  };

  const handleDeleteComment = async (comment: Comment) => {
    await deleteCommentWithChildren(comment);
  };

  const handleEditComment = (comment: Comment) => {
    const payload: ActionEditCommentPayload = {
      mode: 'edit',
      defaultState: comment,
    };
    if (currentPage.value === 'topic') {
      topicPageContext.modalComment.dispatch({
        type: 'OPEN_MODAL',
        payload,
      });
    }
    if (currentPage.value === 'all-topic') {
      homePageContext.modalCommentSideSection.dispatch({
        type: 'OPEN_MODAL',
        payload,
      });
    }
  };

  const getCommentDraggableProps = (): DraggableCommentProps => {
    return {
      comment: comment,
      previousComment: previousComment,
      nextComment: nextComment,
      level: props.level,
      isLastChildOfParent: props.isLastChildOfParent,
      parent: props.parent,
    };
  };

  const findEvent = (comment: Comment): DreamConEvent | null =>
    eventContext.events.find(event => event.id === comment.event_ids[0]) ??
    null;

  /**
   * Level 1 sits under a topic, which can be linked to several events, so
   * "differs from the parent event" is meaningless there. The `จากวง` footer
   * names the event on every comment instead.
   */
  const showHeaderEvent = (comment: Comment): DreamConEvent | null => {
    if (props.level === 1) return null;
    if (comment.event_ids[0] === props.parent.event_ids[0]) return null;
    return findEvent(comment);
  };

  // TODO: move to global
  const hasPermissionToEdit = () => {
    if (modeContext.value === 'view') return false;
    switch (userContext.userState?.role) {
      case 'writer':
        return isWriterOwner(props.comment.event_ids);
      default:
        return false;
    }
  };

  const canAddComment = () => {
    if (modeContext.value === 'view') return false;
    if (userContext.userState?.role === 'user') return false;
    return true;
  };

  const sortedChildrenComments = (comment: Comment): Comment[] => {
    return comment.comments.sort((a, b) => {
      if (
        a.event_ids[0] === comment.event_ids[0] &&
        b.event_ids[0] !== comment.event_ids[0]
      ) {
        return -1;
      }
      if (
        a.event_ids[0] !== comment.event_ids[0] &&
        b.event_ids[0] === comment.event_ids[0]
      ) {
        return 1;
      }
      return 0;
    });
  };

  return (
    <Draggable
      id={comment.id}
      data={getCommentDraggableProps()}
      disabled={!hasPermissionToEdit()}
    >
      <div className="w-full flex flex-col">
        <Droppable
          id={`droppable-comment-${comment.id}`}
          data={{ type: 'comment', comment }}
        >
          {isOver => (
            <>
              {showHeaderEvent(props.comment) && (
                <div className="flex gap-2 items-center text-label-sm pl-1 my-1">
                  <img
                    className="rounded-full w-6.25 h-6.25"
                    src={showHeaderEvent(props.comment)?.avatar_url}
                    alt={`avatar-event-${
                      showHeaderEvent(props.comment)?.display_name
                    }`}
                  />
                  <span className="wv-bold">
                    {showHeaderEvent(props.comment)?.display_name}
                  </span>
                  <span>เพิ่มข้อถกเถียงต่อยอด</span>
                </div>
              )}
              <CommentCard
                comment={comment}
                bgClass={getCardBgClass(comment)}
                roundedBl={isRoundedBL(comment, nextComment)}
                roundedBr={isRoundedBR(comment, nextComment)}
                roundedTl={isRoundedTL(previousComment)}
                roundedTr={isRoundedTR()}
                onClickAddComment={() => handleAddComment(comment)}
                onClickDelete={() => handleDeleteComment(comment)}
                onClickEdit={() => handleEditComment(comment)}
                isOver={isOver}
                canEdit={hasPermissionToEdit()}
                canAddComment={canAddComment()}
              />
              {findEvent(comment) && (
                <div className="text-label-sm text-blue-7 pt-2 pl-2">
                  จากวง{' '}
                  <span className="underline font-bold">
                    {findEvent(comment)?.display_name}
                  </span>
                </div>
              )}
            </>
          )}
        </Droppable>
        {sortedChildrenComments(props.comment).length > 0 && (
          <div className="ml-8.75">
            <CommentWrapper
              comments={sortedChildrenComments(props.comment)}
              level={props.level + 1}
              isLastChildOfParent={
                (props.isLastChildOfParent && nextComment === null) ||
                props.level === 1
              }
              parent={comment}
            />
          </div>
        )}
      </div>
    </Draggable>
  );
}
