import { useContext, useEffect, useState } from 'react';
import MoreVertIcon from '@material-symbols/svg-700/rounded/more_vert.svg?react';
import { Popover } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import { usePermission } from '../../hooks/usePermission';
import { StoreContext } from '../../store';
import {
  disabledCategories,
  Topic,
  topicCategories,
  TopicCategory,
} from '../../types/topic';
import Dropdown from '../ui/Dropdown';
import TextComposer from '../ui/TextComposer';
import MenuPopover from './MenuPopover';

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
  const { isReadOnly, canManage, canEditCategories, getWriterEvent } =
    usePermission();

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
    if (!hasPermissionToEditCategories()) {
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

  const hasPermissionToEditCategories = () =>
    modeContext.value !== 'view' && canEditCategories(props.topic);

  if (isEditingMode) {
    return (
      <div className="flex w-full flex-col gap-3 rounded-2xl bg-white p-4 shadow-card">
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
        {hasPermissionToEdit() ? (
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
        ) : (
          <>
            <h2 className="wv-ibmplex wv-bold p-2.5 heading-4">
              {props.topic.title}
            </h2>
            <button
              className="wv-ibmplex flex w-full items-center justify-center rounded-full border-2 py-2.5 text-button font-bold hover:bg-blue-2"
              onClick={handlerSubmitTopic}
            >
              บันทึก
            </button>
          </>
        )}
        {showCategoryError && (
          <span className="text-center text-label text-red-6">
            *ยังไม่ได้เลือกหัวข้อ
          </span>
        )}
        <button
          className="wv-ibmplex text-gray-5 underline hover:cursor-pointer"
          onClick={resetEditTopic}
        >
          ยกเลิก
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-2.5 rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex flex-wrap gap-1">
          {props.topic.categories.map(category => (
            <div
              key={category}
              className="badge rounded-full bg-blue-6 px-2 py-1 text-white"
            >
              {category}
            </div>
          ))}
          {!props.topic.categories.length ? (
            <div className="badge rounded-full border border-blue-6 px-2 py-1 text-blue-6">
              ไม่ระบุ
            </div>
          ) : null}
        </div>

        {!isReadOnly() && (
          <>
            <MoreVertIcon
              className="h-4.5 w-4.5 text-gray-5 hover:cursor-pointer"
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
                canEdit={hasPermissionToEditCategories()}
                canDelete={hasPermissionToEdit()}
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
            className="wv-ibmplex wv-bold p-2.5 heading-4"
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
