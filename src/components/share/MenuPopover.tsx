import EditIcon from '@material-symbols/svg-700/rounded/edit.svg?react';
import DeleteIcon from '@material-symbols/svg-700/rounded/delete.svg?react';
import PinIcon from '../icon/PinIcon';
import UnpinIcon from '../icon/UnpinIcon';

interface PropTypes {
  canEdit: boolean;
  hasPin?: boolean;
  isPinned?: boolean;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClickPin?: () => void;
  onClickUnpin?: () => void;
}

export default function MenuPopover(props: PropTypes) {
  const PinToggleIcon = props.isPinned ? UnpinIcon : PinIcon;

  return (
    <div className="w-45 flex flex-col gap-0.25 bg-white rounded-lg border overflow-hidden border-gray-3 wv-ibmplexlooped">
      {props.canEdit && (
        <div
          className="w-full flex items-center px-4 py-3 gap-2 hover:bg-gray-1 hover:cursor-pointer"
          data-dndkit-disable-drag
          onClick={props.onClickEdit}
        >
          <EditIcon
            className="pointer-events-none w-4 h-4 text-gray-8"
            aria-hidden
          />
          <span className="pointer-events-none text-black text-b3 ">แก้ไข</span>
        </div>
      )}

      {props.hasPin && (
        <div
          data-dndkit-disable-drag
          className="w-full flex items-center px-4 py-3 gap-2 hover:bg-gray-1 hover:cursor-pointer"
          onClick={() => {
            if (props.isPinned) {
              props.onClickUnpin?.();
            } else {
              props.onClickPin?.();
            }
          }}
        >
          <PinToggleIcon
            className="pointer-events-none w-5 h-5 text-gray-8"
            aria-hidden
          />
          <span className="pointer-events-none text-black text-b3">
            {props.isPinned ? 'ถอนหมุด' : 'ปักหมุด'}
          </span>
        </div>
      )}

      {props.canEdit && (
        <div
          data-dndkit-disable-drag
          className="w-full flex items-center px-4 py-3 gap-2 hover:bg-gray-1 hover:cursor-pointer"
          onClick={props.onClickDelete}
        >
          <DeleteIcon
            className="pointer-events-none w-4 h-4 text-red-7"
            aria-hidden
          />
          <span className="pointer-events-none text-red-7 text-b3">ลบ</span>
        </div>
      )}
    </div>
  );
}
