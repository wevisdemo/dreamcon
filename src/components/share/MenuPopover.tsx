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
  return (
    <div className="w-[180px] flex flex-col gap-[1px] bg-white rounded-[8px] border-[1px] overflow-hidden border-gray3 wv-ibmplexlooped">
      {props.canEdit && (
        <div
          className="w-full flex items-center px-[16px] py-[12px] gap-[8px] hover:bg-gray1 hover:cursor-pointer"
          data-dndkit-disable-drag
          onClick={props.onClickEdit}
        >
          <img
            style={{ pointerEvents: 'none' }}
            className="w-[16px] h-[16px]"
            src="/icon/pen.svg"
            alt="pen-icon"
          />
          <span
            style={{ pointerEvents: 'none' }}
            className="text-black text-[13px] "
          >
            แก้ไข
          </span>
        </div>
      )}

      {props.hasPin && (
        <div
          data-dndkit-disable-drag
          className="w-full flex items-center px-[16px] py-[12px] gap-[8px] hover:bg-gray1 hover:cursor-pointer"
          onClick={() => {
            if (props.isPinned) {
              props.onClickUnpin?.();
            } else {
              props.onClickPin?.();
            }
          }}
        >
          <img
            style={{ pointerEvents: 'none' }}
            className="w-[20px] h-[20px]"
            src={props.isPinned ? '/icon/unpin.svg' : '/icon/pin.svg'}
            alt="pin-icon"
          />
          <span
            style={{ pointerEvents: 'none' }}
            className="text-black text-[13px]"
          >
            {props.isPinned ? 'ถอนหมุด' : 'ปักหมุด'}
          </span>
        </div>
      )}

      {props.canEdit && (
        <div
          data-dndkit-disable-drag
          className="w-full flex items-center px-[16px] py-[12px] gap-[8px] hover:bg-gray1 hover:cursor-pointer"
          onClick={props.onClickDelete}
        >
          <img
            style={{ pointerEvents: 'none' }}
            className="w-[16px] h-[16px]"
            src="/icon/bin.svg"
            alt="bin-icon"
          />
          <span
            style={{ pointerEvents: 'none' }}
            className="text-[#B30000] text-[13px]"
          >
            ลบ
          </span>
        </div>
      )}
    </div>
  );
}
