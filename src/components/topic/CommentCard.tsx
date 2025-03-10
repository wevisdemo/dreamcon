import { useState } from "react";
import { Comment, CommentView } from "../../types/comment";
import BubblePlusIcon from "../icon/BubblePlusIcon";
import Popover from "@mui/material/Popover";
import MenuPopover from "../share/MenuPopover";
import { useHotkeys } from "react-hotkeys-hook";
interface PropTypes {
  comment: Comment;
  bgColor: string;
  roundedTl?: boolean;
  roundedTr?: boolean;
  roundedBl?: boolean;
  roundedBr?: boolean;
  onClickAddComment: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
  isOver?: boolean;
}
export default function CommentCard(props: PropTypes) {
  const [hovered, setHovered] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const onClickAddComment = () => {
    props.onClickAddComment();
  };

  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? "comment-menu" : undefined;

  const showOption = () => {
    if (hovered) return true;
    if (openMenu) return true;
    return false;
  };

  const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorMenu(anchorMenu ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const handleDelete = () => {
    handleCloseMenu();
    props.onClickDelete();
  };

  const handleEdit = () => {
    handleCloseMenu();
    props.onClickEdit();
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

  useHotkeys("Meta+x, ctrl+x", () => {
    if (hovered) {
      console.log("copy comment => ", props.comment);
    }
  });

  useHotkeys("Meta+v, ctrl+v", () => {
    if (hovered) {
      console.log("paste comment => ", props.comment);
    }
  });

  return (
    <div className="relative w-full">
      <div
        aria-describedby={popoverID}
        className={`p-[10px] ${roundedClass()} text[13px] flex justify-between border-[2px] ${
          props.isOver ? "border-dashed border-blue4" : "border-transparent"
        } hover:border-blue6 hover:cursor-pointer`}
        style={{ backgroundColor: props.bgColor }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex flex-1 gap-[10px]">
          <div className={`w-[12px] h-[12px] rounded-full bg-${viewColor()}`} />
          <span className="flex-1">{props.comment.reason}</span>
        </div>
        <div className="flex items-start justify-between w-[40px]">
          {showOption() && (
            <>
              <BubblePlusIcon
                data-dndkit-disable-drag
                color="#979797"
                className="w-[18px] h-[18px]"
                onClick={(e) => {
                  e.stopPropagation();
                  onClickAddComment();
                }}
              />
              <img
                data-dndkit-disable-drag
                src="/icon/menu.svg"
                alt="menu-icon"
                className="w-[18px] h-[18px]"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClickMenu(e);
                }}
              />
            </>
          )}
        </div>
      </div>
      <Popover
        id={popoverID}
        open={openMenu}
        anchorEl={anchorMenu}
        onClose={handleCloseMenu}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        classes={{ paper: "box-1" }}
        disableAutoFocus
        disableEnforceFocus
        disableRestoreFocus
      >
        <MenuPopover onClickDelete={handleDelete} onClickEdit={handleEdit} />
      </Popover>
    </div>
  );
}
