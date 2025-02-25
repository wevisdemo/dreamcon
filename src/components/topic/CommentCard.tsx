import { Comment, CommentView } from "../../types/comment";

interface PropTypes {
  comment: Comment;
  bgColor: string;
  roundedTl?: boolean;
  roundedTr?: boolean;
  roundedBl?: boolean;
  roundedBr?: boolean;
}
export default function CommentCard(props: PropTypes) {
  const viewColor = () => {
    switch (props.comment.comment_view) {
      case CommentView.AGREE:
        return "lightGreen";
      case CommentView.PARTIAL_AGREE:
        return "lightYellow";
      case CommentView.DISAGREE:
        return "lightRed";
    }
  };

  const roundedClass = () => {
    let classes = "";
    if (props.roundedTl) classes += "rounded-tl-[16px] ";
    if (props.roundedTr) classes += "rounded-tr-[16px] ";
    if (props.roundedBl) classes += "rounded-bl-[16px] ";
    if (props.roundedBr) classes += "rounded-br-[16px] ";
    return classes;
  };

  return (
    <div
      className={`p-[10px]  ${roundedClass()} text[13px] flex items-center`}
      style={{ backgroundColor: props.bgColor }}
    >
      <div
        className={`w-[12px] h-[12px] rounded-full bg-${viewColor()} mr-[10px]`}
      />
      <span>{props.comment.reason}</span>
    </div>
  );
}
