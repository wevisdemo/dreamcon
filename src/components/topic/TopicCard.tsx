import { useContext, useEffect, useState } from 'react';
import { Topic, topicCategories, TopicCategory } from '../../types/topic';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Tooltip from '@mui/material/Tooltip';
import { Popover } from '@mui/material';
import MenuPopover from '../share/MenuPopover';
import Dropdown from '../share/Dropdown';
import { StoreContext } from '../../store';
import { usePermission } from '../../hooks/usePermission';
import MoreVertIcon from '@material-symbols/svg-700/rounded/more_vert.svg?react';
import UploadIcon from '../icon/UploadIcon';

interface PropTypes {
  topic: Topic;
  isPinned?: boolean;
  onChangeTopicCategory: (category: TopicCategory) => void;
  onChangeTopicTitle: (title: string) => void;
  onDeleteTopic: () => void;
  onPinTopic: () => void;
  onUnpinTopic: () => void;
}

export default function TopicCard(props: PropTypes) {
  const [topicTitle, setTopicTitle] = useState<string>(props.topic.title);
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | Element>(null);
  const { mode: modeContext } = useContext(StoreContext);
  const { isReadOnly, canManageTopic } = usePermission();

  const openMenu = Boolean(anchorMenu);
  const popoverID = openMenu ? 'topic-menu' : undefined;

  useEffect(() => {
    resetEditTopic();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset form state only when a different topic is rendered
  }, [props.topic]);

  const handleClickMenu = (event: React.MouseEvent<Element>) => {
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

  const handlerSubmitTopicTitle = () => {
    props.onChangeTopicTitle(topicTitle);
    resetEditTopic();
  };

  const resetEditTopic = () => {
    setTopicTitle(props.topic.title);
    setIsEditingMode(false);
  };

  const handlePinTopic = () => {
    props.onPinTopic();
    handleCloseMenu();
  };

  const handleUnpinTopic = () => {
    props.onUnpinTopic();
    handleCloseMenu();
  };

  const hasPermissionToEdit = () =>
    modeContext.value !== 'view' && canManageTopic(props.topic);

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-card flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        {isEditingMode ? (
          <Dropdown
            onSelect={v => props.onChangeTopicCategory(v as TopicCategory)}
            options={topicCategories}
            placeholder={props.topic.category}
          />
        ) : (
          <div className="badge px-2 py-1 rounded-full bg-blue-6 text-white w-fit">
            {props.topic.category}
          </div>
        )}

        {!isReadOnly() && (
          <>
            <MoreVertIcon
              className="w-4.5 h-4.5 hover:cursor-pointer text-gray-5"
              aria-label="เมนู"
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
                className="w-full p-2.5 wv-ibmplex heading-4 wv-bold resize-none overflow-hidden"
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
              <div className="absolute bottom-2.5 right-2.5 flex gap-2">
                <span
                  className="wv-ibmplex text-gray-5 font-semibold underline hover:cursor-pointer"
                  onClick={() => {
                    resetEditTopic();
                  }}
                >
                  ยกเลิก
                </span>
                <UploadIcon
                  className="w-4.5 h-4.5 hover:cursor-pointer text-blue-6"
                  aria-label="ส่ง"
                  onClick={handlerSubmitTopicTitle}
                />
              </div>
            </div>
            <span className=" text-label-sm text-gray-5">
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
              className="p-2.5 wv-ibmplex heading-4 wv-bold"
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
    </div>
  );
}
