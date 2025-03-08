interface PropTypes {
  onClickEdit: () => void;
  onClickDelete: () => void;
}

export default function MenuPopover(props: PropTypes) {
  return (
    <div className="w-[180px] flex flex-col gap-[1px] bg-white rounded-[8px] border-[1px] overflow-hidden border-gray3">
      <div
        className="w-full flex px-[16px] py-[12px] gap-[8px] hover:bg-gray1 hover:cursor-pointer"
        data-dndkit-disable-drag
        onClick={props.onClickEdit}
      >
        <img
          style={{ pointerEvents: "none" }}
          className="w-[18px] h-[18px]"
          src="/icon/pen.svg"
          alt="pen-icon"
        />
        <span
          style={{ pointerEvents: "none" }}
          className="text-black text-[13px]"
        >
          แก้ไข
        </span>
      </div>
      <div
        data-dndkit-disable-drag
        className="w-full flex px-[16px] py-[12px] gap-[8px] hover:bg-gray1 hover:cursor-pointer"
        onClick={props.onClickDelete}
      >
        <img
          style={{ pointerEvents: "none" }}
          className="w-[18px] h-[18px]"
          src="/icon/bin.svg"
          alt="bin-icon"
        />
        <span
          style={{ pointerEvents: "none" }}
          className="text-[#B30000] text-[13px]"
        >
          ลบ
        </span>
      </div>
    </div>
  );
}
