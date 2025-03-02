import { useState } from "react";
import { Comment, CommentView } from "../../types/comment";
import BubblePlusIcon from "../icon/BubblePlusIcon";

interface PropTypes {
  comment: Comment;
  bgColor: string;
  roundedTl?: boolean;
  roundedTr?: boolean;
  roundedBl?: boolean;
  roundedBr?: boolean;
  onClickAddComment: () => void;
  onClickMenu: () => void;
}
export default function CommentCard(props: PropTypes) {
  const [hovered, setHovered] = useState(false);
  const onClickAddComment = () => {
    props.onClickAddComment();
  };

  const onClickMenu = () => {
    props.onClickMenu();
  };

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
      className={`p-[10px]  ${roundedClass()} text[13px] flex justify-between border-[2px] border-transparent hover:border-blue6 hover:cursor-pointer`}
      style={{ backgroundColor: props.bgColor }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => console.log("click")}
    >
      <div className="flex flex-1 gap-[10px]">
        <div className={`w-[12px] h-[12px] rounded-full bg-${viewColor()}`} />
        <span className="flex-1">{props.comment.reason}</span>
      </div>
      <div className="flex items-start justify-between w-[40px]">
        {hovered && (
          <>
            <BubblePlusIcon
              color="#979797"
              className="w-[18px] h-[18px]"
              onClick={(e) => {
                e.stopPropagation();
                onClickAddComment();
              }}
            />
            <img
              src="/icon/menu.svg"
              alt="menu-icon"
              className="w-[18px] h-[18px]"
              onClick={(e) => {
                e.stopPropagation();
                onClickMenu();
              }}
            />
          </>
        )}
      </div>
    </div>
  );
}
