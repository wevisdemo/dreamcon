import { useContext, useEffect, useState } from 'react';
import { CommentView } from '../../types/comment';
import { Topic, topicCategories, TopicCategory } from '../../types/topic';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Tooltip from '@mui/material/Tooltip';
import { Popover } from '@mui/material';
import MenuPopover from '../share/MenuPopover';
import Dropdown from '../share/Dropdown';
import { StoreContext } from '../../store';
import { usePermission } from '../../hooks/usePermission';

interface PropTypes {
  topic: Topic;
  isPinned?: boolean;
  onAddComment: (commentView: CommentView, reason: string) => void;
  onChangeTopicCategory: (category: TopicCategory) => void;
  onChangeTopicTitle: (title: string) => void;
  onDeleteTopic: () => void;
  onPinTopic: () => void;
  onUnpinTopic: () => void;
}

export default function TopicCard(props: PropTypes) {
  const [topicTitle, setTopicTitle] = useState<string>(props.topic.title);
  const [commentView, setCommentView] = useState<null | CommentView>(
    CommentView.AGREE
  );
  const [newCommentText, setNewCommentText] = useState('');
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | HTMLElement>(null);
  const { user: userContext, mode: modeContext } = useContext(StoreContext);
  const { isReadOnly } = usePermission();

  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? 'topic-menu' : undefined;

  useEffect(() => {
    resetNewCommentText();
    resetEditTopic();
  }, [props.topic]);

  const handleClickMenu = (event: React.MouseEvent<HTMLImageElement>) => {
    setAnchorMenu(anchorMenu ? null : event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorMenu(null);
  };

  const handleClickEditInMenu = () => {
    if (!hasPermissionToEdit()) {
      handleCloseMenu();
      return;
    }
    setIsEditingMode(true);
    handleCloseMenu();
    document.getElementById('topic-title-text-area')?.focus();
  };

  const handleDeleteTopic = () => {
    props.onDeleteTopic();
    handleCloseMenu();
  };

  const handleSelectCommentView = (selectedView: CommentView) => {
    if (commentView === selectedView) {
      setCommentView(null);
      return;
    }
    setCommentView(selectedView);
  };

  const resetNewCommentText = () => {
    setCommentView(CommentView.AGREE);
    setNewCommentText('');
  };

  const handlerSubmitTopicTitle = () => {
    props.onChangeTopicTitle(topicTitle);
    resetEditTopic();
  };

  const resetEditTopic = () => {
    setTopicTitle(props.topic.title);
    setIsEditingMode(false);
  };

  const handleAddComment = () => {
    if (newCommentText.trim().length > 0 && commentView !== null) {
      props.onAddComment(commentView, newCommentText);
    }
    resetNewCommentText();
  };

  const handlePinTopic = () => {
    props.onPinTopic();
    handleCloseMenu();
  };

  const handleUnpinTopic = () => {
    props.onUnpinTopic();
    handleCloseMenu();
  };

  const canSubmit = () => {
    return newCommentText.trim().length > 0 && commentView !== null;
  };

  const hasPermissionToEdit = () => {
    if (modeContext.value === 'view') {
      return false;
    }
    switch (userContext.userState?.role) {
      case 'writer':
        return props.topic.event_id === userContext.userState?.event.id;
      default:
        return false;
    }
  };

  return (
    <div className="w-full p-[16px] bg-white rounded-[16px] shadow-[0px 4px 16px rgba(0, 0, 0, 0.1)] flex flex-col gap-[10px]">
      <div className="flex justify-between items-start">
        {isEditingMode ? (
          <Dropdown
            onSelect={v => props.onChangeTopicCategory(v as TopicCategory)}
            options={topicCategories}
            placeholder={props.topic.category}
          />
        ) : (
          <div className="badge px-[8px] py-[4px] rounded-[48px] bg-accent text-white w-fit">
            {props.topic.category}
          </div>
        )}

        {!isReadOnly() && (
          <>
            <img
              className="w-[18px] h-[18px] hover:cursor-pointer"
              src="/icon/menu.svg"
              alt="menu-icon"
              onClick={e => {
                e.stopPropagation();
                handleClickMenu(e);
              }}
            />
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
                hasPin
                isPinned={props.isPinned}
                canEdit={hasPermissionToEdit()}
                onClickDelete={() => {
                  handleDeleteTopic();
                }}
                onClickEdit={() => {
                  handleClickEditInMenu();
                }}
                onClickPin={() => {
                  handlePinTopic();
                }}
                onClickUnpin={() => {
                  handleUnpinTopic();
                }}
              />
            </Popover>
          </>
        )}
      </div>
      <div className="relative w-full">
        {isEditingMode ? (
          <>
            <div className="relative  w-full">
              <TextareaAutosize
                id="topic-title-text-area"
                className="w-full p-[10px] wv-ibmplex text-[20px] wv-bold resize-none overflow-hidden"
                value={topicTitle}
                onChange={e => {
                  setTopicTitle(e.target.value);
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handlerSubmitTopicTitle();
                  }
                }}
                autoFocus
                maxLength={140}
              />
              <div className="absolute bottom-[10px] right-[10px] flex gap-[8px]">
                <span
                  className="wv-ibmplex text-gray5 font-semibold underline hover:cursor-pointer"
                  onClick={() => {
                    resetEditTopic();
                  }}
                >
                  ยกเลิก
                </span>
                <img
                  className="w-[18px] h-[18px] hover:cursor-pointer"
                  src="/icon/upload.svg"
                  alt="upload-icon"
                  onClick={handlerSubmitTopicTitle}
                />
              </div>
            </div>
            <span className=" text-[10px] text-gray5">
              {topicTitle.length}/140
            </span>
          </>
        ) : (
          <Tooltip
            title={hasPermissionToEdit() ? 'กดเพื่อแก้ไข' : ''}
            placement="bottom-start"
            slotProps={{
              popper: {
                modifiers: [
                  {
                    name: 'offset',
                    options: {
                      offset: [0, -20],
                    },
                  },
                ],
              },
            }}
            classes={{ tooltip: 'tooltip-1' }}
          >
            <h2
              className="p-[10px] wv-ibmplex text-[20px] wv-bold"
              onClick={() => {
                if (hasPermissionToEdit()) {
                  setIsEditingMode(true);
                }
              }}
            >
              {props.topic.title}
            </h2>
          </Tooltip>
        )}
      </div>
      {!isReadOnly() && (
        <>
          <div className="flex gap-[8px]">
            <button
              className={`py-[10px] ${
                commentView === CommentView.AGREE
                  ? 'bg-lightGreen'
                  : 'bg-lightGreen/25'
              } hover:bg-lightGreen border-solid border-[1px] border-lightGreen rounded-[48px] w-full`}
              onClick={() => handleSelectCommentView(CommentView.AGREE)}
            >
              เห็นด้วย
            </button>
            <button
              className={`py-[10px] ${
                commentView === CommentView.PARTIAL_AGREE
                  ? 'bg-lightYellow'
                  : 'bg-lightYellow/25'
              } hover:bg-lightYellow border-solid border-[1px] border-lightYellow rounded-[48px] w-full`}
              onClick={() => handleSelectCommentView(CommentView.PARTIAL_AGREE)}
            >
              เห็นด้วยบ้าง
            </button>
            <button
              className={`py-[10px] ${
                commentView === CommentView.DISAGREE
                  ? 'bg-lightRed'
                  : 'bg-lightRed/25'
              } hover:bg-lightRed border-solid border-[1px] border-lightRed rounded-[48px] w-full
          `}
              onClick={() => handleSelectCommentView(CommentView.DISAGREE)}
            >
              ไม่เห็นด้วย
            </button>
          </div>
          {commentView && (
            <div className="relative flex">
              <textarea
                className="w-full h-full p-[10px] text-[13px] bg-gray1 border-[1px] border-gray3 rounded-[4px] resize-none min-h-[52px] focus:outline-none "
                name="add-comment-in-topic-card"
                id="add-comment-in-topic-card"
                value={newCommentText}
                onChange={e => setNewCommentText(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleAddComment();
                  }
                }}
                placeholder="เพราะว่า...(140ตัวอักษร)"
                maxLength={140}
              />
              {canSubmit() && (
                <img
                  className="w-[18px] h-[18px] absolute bottom-[10px] right-[10px] hover:cursor-pointer"
                  src="/icon/upload.svg"
                  alt="upload-icon"
                  onClick={handleAddComment}
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
