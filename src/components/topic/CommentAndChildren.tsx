import { useContext } from "react";
import {
  ActionCreateCommentPayload,
  ActionEditCommentPayload,
} from "../../store/modalComment";
import { Comment } from "../../types/comment";
import { Draggable } from "../Draggable";
import CommentCard from "./CommentCard";
import CommentWrapper from "./CommentWrapper";
import { StoreContext } from "../../store";
import { Topic } from "../../types/topic";
import { DraggableCommentProps } from "../../types/dragAndDrop";

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
  } = useContext(StoreContext);

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
    if ((previousComment?.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedTR = (): boolean => {
    if (props.level === 1) return true;
    return false;
  };

  const isRoundedBL = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.level === 1) return true;
    if (nextComment === null) return true;
    if ((currentComment.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedBR = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    return isLastUltimateLastChild(currentComment, nextComment);
  };

  const getCardBGColor = (comment: Comment): string => {
    const hasChildren = comment.comments.length > 0;
    if (hasChildren) {
      switch (props.level % 3) {
        case 0:
          return "#FFFFFF";
        case 1:
          return "#f5fbff";
        case 2:
          return "#cae8ff";
      }
    } else {
      switch (props.level % 3) {
        case 0:
          return "#cae8ff";
        case 1:
          return "#FFFFFF";
        case 2:
          return "#f5fbff";
      }
    }
    return "#FFFFFF";
  };

  const handleAddComment = (comment: Comment) => {
    const payload: ActionCreateCommentPayload = {
      mode: "create",
      parent_type: "comment",
      parent_id: comment.id,
    };
    if (currentPage.value === "topic") {
      topicPageContext.modalComment.dispatch({
        type: "OPEN_MODAL",
        payload,
      });
    }
    if (currentPage.value === "home") {
      homePageContext.modalCommentSideSection.dispatch({
        type: "OPEN_MODAL",
        payload,
      });
    }
  };

  const handleDeleteComment = (comment: Comment) => {
    console.log("delete comment", comment);
  };

  const handleEditComment = (comment: Comment) => {
    const payload: ActionEditCommentPayload = {
      mode: "edit",
      defaultState: comment,
    };
    if (currentPage.value === "topic") {
      topicPageContext.modalComment.dispatch({
        type: "OPEN_MODAL",
        payload,
      });
    }
    if (currentPage.value === "home") {
      homePageContext.modalCommentSideSection.dispatch({
        type: "OPEN_MODAL",
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

  return (
    <Draggable id={comment.id} data={getCommentDraggableProps()}>
      <div className="w-full flex flex-col">
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
        />

        {comment.comments.length > 0 && (
          <div className="ml-[35px]">
            <CommentWrapper
              comments={comment.comments}
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
