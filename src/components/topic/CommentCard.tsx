import { useContext, useState } from "react";
import { Comment, CommentView } from "../../types/comment";
import BubblePlusIcon from "../icon/BubblePlusIcon";
import Popover from "@mui/material/Popover";
import MenuPopover from "../share/MenuPopover";
import { useHotkeys } from "react-hotkeys-hook";
import { StoreContext } from "../../store";
import Tooltip from "@mui/material/Tooltip";
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
  canEdit: boolean;
  canAddComment?: boolean;
}
export default function CommentCard(props: PropTypes) {
  const [hovered, setHovered] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const onClickAddComment = () => {
    props.onClickAddComment();
  };
  const { clipboard: clipboardContext } = useContext(StoreContext);

  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? "comment-menu" : undefined;

  const showOption = () => {
    if (!props.canEdit) return false;
    if (hovered) return true;
    if (openMenu) return true;
    return false;
  };

  const showAddComment = () => {
    if (!props.canAddComment) return false;
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
      clipboardContext.emitCopyComment(props.comment);
    }
  });

  useHotkeys("Meta+v, ctrl+v", () => {
    if (hovered) {
      clipboardContext.emitMoveComment({
        type: "comment",
        comment: props.comment,
      });
    }
  });

  return (
    <div
      className="relative w-full z-20"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && props.canEdit && (
        <Tooltip
          title={
            <div className="flex flex-col font-[400]">
              <span>
                <span className="wv-bold">ลาก</span> เพื่อย้าย
              </span>
              <div className="flex gap-[1px]">
                <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
                  ⌘
                </span>
                <span className="flex justify-center align-center w-[16px] h-[16px] text-gray3 rounded-[2px] border-gray4 border-[1px]">
                  X
                </span>
              </div>
            </div>
          }
          placement="bottom-start"
          className="hover:cursor-pointer"
          classes={{ tooltip: "tooltip-1" }}
        >
          <img
            style={{ transform: "translate(0, -50%)" }}
            className="absolute left-[-24px] top-[50%] w-[24px] h-[24px]"
            src="/icon/six-dot.svg"
            alt="six-dot-icon"
          />
        </Tooltip>
      )}

      <div
        aria-describedby={popoverID}
        className={`p-[10px] ${roundedClass()} text[13px] flex justify-between border-[2px] ${
          props.isOver ? "border-dashed border-blue4" : "border-transparent"
        } ${
          hovered && props.canEdit
            ? "hover:border-blue6 hover:cursor-pointer"
            : ""
        } `}
        style={{ backgroundColor: props.bgColor }}
      >
        <div className="flex flex-1 gap-[10px]">
          <div className={`w-[12px] h-[12px] rounded-full bg-${viewColor()}`} />
          <span className="flex-1">{props.comment.reason}</span>
        </div>
        <div className="flex items-start justify-between w-[40px]">
          {showAddComment() && (
            <BubblePlusIcon
              data-dndkit-disable-drag
              color="#979797"
              className="w-[18px] h-[18px]"
              onClick={(e) => {
                e.stopPropagation();
                onClickAddComment();
              }}
            />
          )}
          {showOption() && (
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
        <MenuPopover
          onClickDelete={handleDelete}
          onClickEdit={handleEdit}
          canEdit={props.canEdit}
        />
      </Popover>
    </div>
  );
}
