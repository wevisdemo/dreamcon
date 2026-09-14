import { useContext, useEffect, useState } from 'react';
import {
  disabledCategories,
  Topic,
  topicCategories,
  TopicCategory,
} from '../../types/topic';
import Tooltip from '@mui/material/Tooltip';
import { Popover } from '@mui/material';
import MenuPopover from './MenuPopover';
import Dropdown from '../ui/Dropdown';
import { StoreContext } from '../../store';
import { usePermission } from '../../hooks/usePermission';
import MoreVertIcon from '@material-symbols/svg-700/rounded/more_vert.svg?react';
import TextComposer from '../ui/TextComposer';

interface PropTypes {
  topic: Topic;
  isPinned?: boolean;
  onChangeTopic: (title: string, categories: TopicCategory[]) => void;
  onDeleteTopic: () => void;
  onPinTopic: () => void;
  onUnpinTopic: () => void;
}

export default function TopicCard(props: PropTypes) {
  const [topicTitle, setTopicTitle] = useState<string>(props.topic.title);
  const [categories, setCategories] = useState<TopicCategory[]>(
    props.topic.categories as TopicCategory[]
  );
  const [isEditingMode, setIsEditingMode] = useState(false);
  const [showCategoryError, setShowCategoryError] = useState(false);
  const [anchorMenu, setAnchorMenu] = useState<null | Element>(null);
  const { mode: modeContext } = useContext(StoreContext);
  const { isReadOnly, canManage, getWriterEvent } = usePermission();

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
  };

  const handleDeleteTopic = () => {
    props.onDeleteTopic();
    handleCloseMenu();
  };

  /** Title and categories commit together, so one edit session is one write. */
  const handlerSubmitTopic = () => {
    if (categories.length === 0) {
      setShowCategoryError(true);
      return;
    }
    props.onChangeTopic(topicTitle, categories);
    resetEditTopic();
  };

  const resetEditTopic = () => {
    setTopicTitle(props.topic.title);
    setCategories(props.topic.categories as TopicCategory[]);
    setShowCategoryError(false);
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
    modeContext.value !== 'view' && canManage(props.topic);

  if (isEditingMode) {
    return (
      <div className="w-full p-4 bg-white rounded-2xl shadow-card flex flex-col gap-3">
        <Dropdown
          selected={categories}
          onChange={c => {
            setCategories(c as TopicCategory[]);
            setShowCategoryError(false);
          }}
          options={topicCategories}
          disabledOptions={disabledCategories(categories)}
          placeholder="เลือกหัวข้อ"
        />
        <TextComposer
          id="topic-title-text-area"
          label="ข้อถกเถียงของ"
          eventName={getWriterEvent()?.display_name ?? ''}
          value={topicTitle}
          onChange={setTopicTitle}
          onSubmit={handlerSubmitTopic}
          placeholder="ข้อถกเถียงควรประกอบด้วยเหตุผลและข้อสรุป (140 ตัวอักษร)"
          autoFocus
        />
        {showCategoryError && (
          <span className="text-label text-center text-red-6">
            *ยังไม่ได้เลือกหัวข้อ
          </span>
        )}
        <button
          className="text-gray-5 wv-ibmplex underline hover:cursor-pointer"
          onClick={resetEditTopic}
        >
          ยกเลิก
        </button>
      </div>
    );
  }

  return (
    <div className="w-full p-4 bg-white rounded-2xl shadow-card flex flex-col gap-2.5">
      <div className="flex justify-between items-start">
        <div className="flex flex-wrap gap-1">
          {props.topic.categories.map(category => (
            <div
              key={category}
              className="badge px-2 py-1 rounded-full bg-blue-6 text-white w-fit"
            >
              {category}
            </div>
          ))}
        </div>

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
      </div>
    </div>
  );
}
