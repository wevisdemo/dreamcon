import DeleteIcon from '@material-symbols/svg-700/rounded/delete.svg?react';
import EditIcon from '@material-symbols/svg-700/rounded/edit.svg?react';
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
    <div className="wv-ibmplexlooped flex w-45 flex-col gap-0.25 overflow-hidden rounded-lg border border-gray-3 bg-white">
      {props.canEdit && (
        <div
          className="flex w-full items-center gap-2 px-4 py-3 hover:cursor-pointer hover:bg-gray-1"
          data-dndkit-disable-drag
          onClick={props.onClickEdit}
        >
          <EditIcon
            className="pointer-events-none h-4 w-4 text-gray-8"
            aria-hidden
          />
          <span className="pointer-events-none text-b3 text-black">แก้ไข</span>
        </div>
      )}

      {props.hasPin && (
        <div
          data-dndkit-disable-drag
          className="flex w-full items-center gap-2 px-4 py-3 hover:cursor-pointer hover:bg-gray-1"
          onClick={() => {
            if (props.isPinned) {
              props.onClickUnpin?.();
            } else {
              props.onClickPin?.();
            }
          }}
        >
          <PinToggleIcon
            className="pointer-events-none h-5 w-5 text-gray-8"
            aria-hidden
          />
          <span className="pointer-events-none text-b3 text-black">
            {props.isPinned ? 'ถอนหมุด' : 'ปักหมุด'}
          </span>
        </div>
      )}

      {props.canEdit && (
        <div
          data-dndkit-disable-drag
          className="flex w-full items-center gap-2 px-4 py-3 hover:cursor-pointer hover:bg-gray-1"
          onClick={props.onClickDelete}
        >
          <DeleteIcon
            className="pointer-events-none h-4 w-4 text-red-7"
            aria-hidden
          />
          <span className="pointer-events-none text-b3 text-red-7">ลบ</span>
        </div>
      )}
    </div>
  );
}
