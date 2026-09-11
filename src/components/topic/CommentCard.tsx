import { useContext, useState } from 'react';
import { Comment, CommentView } from '../../types/comment';
import AddCommentIcon from '@material-symbols/svg-700/rounded/maps_ugc.svg?react';
import MoreVertIcon from '@material-symbols/svg-700/rounded/more_vert.svg?react';
import DraggableDotsIcon from '../icon/DraggableDotsIcon';
import Popover from '@mui/material/Popover';
import MenuPopover from '../share/MenuPopover';
import { useHotkeys } from 'react-hotkeys-hook';
import { StoreContext } from '../../store';
import Tooltip from '@mui/material/Tooltip';
interface PropTypes {
  comment: Comment;
  bgClass: string;
  onClickAddComment: () => void;
  onClickEdit: () => void;
  onClickDelete: () => void;
  isOver?: boolean;
  canEdit: boolean;
  canAddComment?: boolean;
}
export default function CommentCard(props: PropTypes) {
  const [hovered, setHovered] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | Element>(null);
  const onClickAddComment = () => {
    props.onClickAddComment();
  };
  const { clipboard: clipboardContext } = useContext(StoreContext);

  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? 'comment-menu' : undefined;

  const revealClass = () => (hovered || openMenu ? '' : 'invisible');

  const handleClickMenu = (event: React.MouseEvent<Element>) => {
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
        return 'bg-green-light';
      case CommentView.PARTIAL_AGREE:
        return 'bg-yellow-3';
      case CommentView.DISAGREE:
        return 'bg-red-2';
    }
  };

  useHotkeys('Meta+x, ctrl+x', () => {
    if (hovered) {
      clipboardContext.emitCopyComment(props.comment);
    }
  });

  useHotkeys('Meta+v, ctrl+v', () => {
    if (hovered) {
      clipboardContext.emitMoveComment({
        type: 'comment',
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
            <div className="flex flex-col font-normal wv-ibmplexlooped">
              <span>
                <span className="wv-bold">ลาก</span> เพื่อย้าย
              </span>
              <div className="flex gap-0.25">
                <span className="flex justify-center align-center w-4 h-4 text-gray-3 rounded-xs border-gray-4 border">
                  ⌘
                </span>
                <span className="flex justify-center align-center w-4 h-4 text-gray-3 rounded-xs border-gray-4 border">
                  X
                </span>
              </div>
            </div>
          }
          placement="bottom-start"
          className="hover:cursor-pointer"
          classes={{ tooltip: 'tooltip-1' }}
        >
          <DraggableDotsIcon
            className="absolute -left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-2"
            aria-hidden
          />
        </Tooltip>
      )}

      <div
        aria-describedby={popoverID}
        className={`p-2.5 ${props.bgClass} rounded-2xl text-b3 flex justify-between border-2 ${
          props.isOver ? 'border-dashed border-blue-4' : 'border-transparent'
        } ${
          hovered && props.canEdit
            ? 'hover:border-blue-6 hover:cursor-pointer'
            : ''
        } `}
      >
        <div className="flex flex-1 gap-2.5">
          <div className={`w-3 h-3 rounded-full ${viewColor()}`} />
          <span className="flex-1">{props.comment.reason}</span>
        </div>
        <div className="flex items-start justify-between w-10">
          {props.canAddComment && (
            <AddCommentIcon
              data-dndkit-disable-drag
              className={`w-4.5 h-4.5 text-gray-5 ${revealClass()}`}
              aria-label="เพิ่มข้อถกเถียงต่อยอด"
              onClick={e => {
                e.stopPropagation();
                onClickAddComment();
              }}
            />
          )}
          {props.canEdit && (
            <MoreVertIcon
              data-dndkit-disable-drag
              aria-label="เมนู"
              className={`w-4.5 h-4.5 text-gray-5 ${revealClass()}`}
              onClick={e => {
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
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        classes={{ paper: 'box-1' }}
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
