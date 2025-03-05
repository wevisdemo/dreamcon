import { Comment } from "../../types/comment";
import { Topic } from "../../types/topic";
import CommentAndChildren from "./CommentAndChildren";

interface PropTypes {
  comments: Comment[];
  level: number;
  isLastChildOfParent?: boolean;
  parent: Topic | Comment;
}

export default function CommentWrapper(props: PropTypes) {
  const getNextComment = (index: number): Comment | null => {
    if (index + 1 >= props.comments.length) return null;
    return props.comments[index + 1];
  };

  const getPreviousComment = (index: number): Comment | null => {
    if (index - 1 < 0) return null;
    return props.comments[index - 1];
  };

  return (
    <div
      className={`comment-wrapper flex flex-col ${
        props.level === 1 ? "gap-[16px] mt-[10px]" : ""
      }`}
    >
      {props.comments.map((comment, index) => {
        return (
          <CommentAndChildren
            comment={comment}
            previousComment={getPreviousComment(index)}
            nextComment={getNextComment(index)}
            level={props.level}
            isLastChildOfParent={props.isLastChildOfParent}
            parent={props.parent}
          />
        );
      })}
    </div>
  );
}
