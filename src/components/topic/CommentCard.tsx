import { useContext, useState } from 'react';
import AddCommentIcon from '@material-symbols/svg-700/rounded/maps_ugc.svg?react';
import MoreVertIcon from '@material-symbols/svg-700/rounded/more_vert.svg?react';
import Popover from '@mui/material/Popover';
import Tooltip from '@mui/material/Tooltip';
import { useHotkeys } from 'react-hotkeys-hook';
import { StoreContext } from '../../store';
import { Comment, CommentView } from '../../types/comment';
import DraggableDotsIcon from '../icon/DraggableDotsIcon';
import MenuPopover from './MenuPopover';

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
      className="relative z-20 w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hovered && props.canEdit && (
        <Tooltip
          title={
            <div className="wv-ibmplexlooped flex flex-col font-normal">
              <span>
                <span className="wv-bold">ลาก</span> เพื่อย้าย
              </span>
              <div className="flex gap-0.25">
                <span className="align-center flex h-4 w-4 justify-center rounded-xs border border-gray-4 text-gray-3">
                  ⌘
                </span>
                <span className="align-center flex h-4 w-4 justify-center rounded-xs border border-gray-4 text-gray-3">
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
            className="absolute top-1/2 -left-6 h-6 w-6 -translate-y-1/2 text-gray-2"
            aria-hidden
          />
        </Tooltip>
      )}

      <div
        aria-describedby={popoverID}
        className={`p-2.5 ${props.bgClass} flex justify-between rounded-2xl border-2 text-b3 ${
          props.isOver ? 'border-dashed border-blue-4' : 'border-transparent'
        } ${
          hovered && props.canEdit
            ? 'hover:cursor-pointer hover:border-blue-6'
            : ''
        } `}
      >
        <div className="flex flex-1 gap-2.5">
          <div className={`h-3 w-3 rounded-full ${viewColor()}`} />
          <span className="flex-1">{props.comment.reason}</span>
        </div>
        <div className="flex w-10 items-start justify-between">
          {props.canAddComment && (
            <AddCommentIcon
              data-dndkit-disable-drag
              className={`h-4.5 w-4.5 text-gray-5 ${revealClass()}`}
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
              className={`h-4.5 w-4.5 text-gray-5 ${revealClass()}`}
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
