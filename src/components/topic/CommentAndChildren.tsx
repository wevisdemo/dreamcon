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
    // selectedTopic,
    event: eventContext,
    user: userContext,
    mode: modeContext,
  } = useContext(StoreContext);

  const { deleteCommentWithChildren } = useDeleteCommentWithChildren();

  //rounded top-left if previous has children OR is parent
  //rounded top-right if parent
  //rounded bottom-right is ultimate last child
  //rounded bottom-left if has child and last child in that level or is parent

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
    if (showHeaderEvent(props.comment, props.parent.event_id) !== null)
      return true;
    if ((previousComment?.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedTR = (): boolean => {
    if (props.level === 1) return true;
    if (showHeaderEvent(props.comment, props.parent.event_id) !== null)
      return true;
    return false;
  };

  const isRoundedBL = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.level === 1) return true;
    if (nextComment === null) return true;
    if (nextComment !== null) {
      if (showHeaderEvent(nextComment, props.parent.event_id) !== null)
        return true;
    }
    if ((currentComment.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedBR = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (nextComment !== null) {
      if (showHeaderEvent(nextComment, props.parent.event_id) !== null)
        return true;
    }
    return (
      isLastUltimateLastChild(currentComment, nextComment) ||
      hasNoSameEventChildren(currentComment)
    );
  };

  const hasNoSameEventChildren = (comment: Comment): boolean => {
    if (comment.comments.length === 0) return true;
    const hasSameEventChildren = comment.comments.some(
      childComment => childComment.event_id === comment.event_id
    );
    return !hasSameEventChildren;
  };

  const getCardBGColor = (comment: Comment): string => {
    const hasChildren = comment.comments.length > 0;
    if (hasChildren) {
      switch (props.level % 3) {
        case 0:
          return '#FFFFFF';
        case 1:
          return '#f5fbff';
        case 2:
          return '#cae8ff';
      }
    } else {
      switch (props.level % 3) {
        case 0:
          return '#cae8ff';
        case 1:
          return '#FFFFFF';
        case 2:
          return '#f5fbff';
      }
    }
    return '#FFFFFF';
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

  const showHeaderEvent = (
    comment: Comment,
    parentEventID: string
  ): DreamConEvent | null => {
    if (comment.event_id !== parentEventID) {
      const event = eventContext.events.find(
        event => event.id === comment.event_id
      );
      if (event) {
        return event;
      }
    }
    return null;
  };

  // TODO: move to global
  const hasPermissionToEdit = () => {
    if (modeContext.value === 'view') return false;
    switch (userContext.userState?.role) {
      case 'writer':
        return props.comment.event_id === userContext.userState?.event.id;
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
      if (a.event_id === comment.event_id && b.event_id !== comment.event_id) {
        return -1;
      }
      if (a.event_id !== comment.event_id && b.event_id === comment.event_id) {
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
              {showHeaderEvent(props.comment, props.parent.event_id) && (
                <div className="flex gap-[8px] items-center text-[10px] pl-[4px] my-[4px]">
                  <img
                    className="rounded-full w-[25px] h-[25px]"
                    src={
                      showHeaderEvent(props.comment, props.parent.event_id)
                        ?.avatar_url
                    }
                    alt={`avatar-event-${
                      showHeaderEvent(props.comment, props.parent.event_id)
                        ?.display_name
                    }`}
                  />
                  <span className="wv-bold">
                    {
                      showHeaderEvent(props.comment, props.parent.event_id)
                        ?.display_name
                    }
                  </span>
                  <span>เพิ่มข้อถกเถียงต่อยอด</span>
                </div>
              )}
              <CommentCard
                comment={comment}
                bgColor={getCardBGColor(comment)}
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
            </>
          )}
        </Droppable>
        {sortedChildrenComments(props.comment).length > 0 && (
          <div className="ml-[35px]">
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
