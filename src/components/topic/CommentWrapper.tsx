import CommentCard from "./CommentCard";
import { Comment } from "../../types/comment";

interface PropTypes {
  comments: Comment[];
  Level: number;
  isLastChildOfParent?: boolean;
}

export default function CommentWrapper(props: PropTypes) {
  //rounded top-left if previous has children OR is parent
  //rounded top-right if parent
  //rounded bottom-right is ultimate last child
  //rounded bottom-left if has child and last child in that level or is parent

  const getNextComment = (index: number): Comment | null => {
    if (index + 1 >= props.comments.length) return null;
    return props.comments[index + 1];
  };

  const getPreviousComment = (index: number): Comment | null => {
    if (index - 1 < 0) return null;
    return props.comments[index - 1];
  };

  const isLastUltimateLastChild = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.Level === 1 && currentComment.comments.length === 0) return true;
    if (!props.isLastChildOfParent) return false;
    if (nextComment !== null) return false;
    if ((currentComment.comments.length || 0) > 0) return false;
    return true;
  };

  const isRoundedTL = (previousComment: Comment | null): boolean => {
    if (props.Level === 1) return true;
    if ((previousComment?.comments.length || 0) > 0) return true;
    return false;
  };

  const isRoundedTR = (): boolean => {
    if (props.Level === 1) return true;
    return false;
  };

  const isRoundedBL = (
    currentComment: Comment,
    nextComment: Comment | null
  ): boolean => {
    if (props.Level === 1) return true;
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
      switch (props.Level % 3) {
        case 0:
          return "#FFFFFF";
        case 1:
          return "#f5fbff";
        case 2:
          return "#cae8ff";
      }
    } else {
      switch (props.Level % 3) {
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

  return (
    <div
      className={`comment-wrapper flex flex-col ${
        props.Level === 1 ? "gap-[16px] mt-[10px]" : ""
      }`}
    >
      {props.comments.map((comment, index) => {
        return (
          <div className="" key={index}>
            <CommentCard
              comment={comment}
              bgColor={getCardBGColor(comment)}
              roundedBl={isRoundedBL(comment, getNextComment(index))}
              roundedBr={isRoundedBR(comment, getNextComment(index))}
              roundedTl={isRoundedTL(getPreviousComment(index))}
              roundedTr={isRoundedTR()}
            />
            {comment.comments.length > 0 && (
              <div className="ml-[35px]">
                <CommentWrapper
                  comments={comment.comments}
                  Level={props.Level + 1}
                  isLastChildOfParent={
                    (props.isLastChildOfParent &&
                      getNextComment(index) === null) ||
                    props.Level === 1
                  }
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
