import { useRef } from 'react';
import { CloseIcon } from '../../icons/close';
import { HelpIcon } from '../../icons/help';
import { Button } from '../button';

const POPOVER_ID = 'phrase-sorting-hint';
const POPOVER_WIDTH = 340;
const VIEWPORT_MARGIN = 16;
const ANCHOR_GAP = 4;

const canHover = () => window.matchMedia('(hover: hover)').matches;

export function PhraseSortingHint() {
  const popoverRef = useRef<HTMLDivElement>(null);

  const placeBelow = (anchor: HTMLElement) => {
    const popover = popoverRef.current;
    if (!popover) return;
    const { left, bottom } = anchor.getBoundingClientRect();
    popover.style.top = `${bottom + ANCHOR_GAP}px`;
    popover.style.left = `${Math.max(VIEWPORT_MARGIN, Math.min(left, window.innerWidth - POPOVER_WIDTH - VIEWPORT_MARGIN))}px`;
  };

  return (
    <>
      <Button
        variant="icon-blue"
        icon={<HelpIcon />}
        aria-label="เกี่ยวกับการเรียงตามความเกี่ยวข้องกับประเด็นที่เลือก"
        popoverTarget={POPOVER_ID}
        onMouseEnter={event => {
          if (!canHover()) return;
          placeBelow(event.currentTarget);
          popoverRef.current?.togglePopover(true);
        }}
        onMouseLeave={() => {
          if (canHover()) popoverRef.current?.togglePopover(false);
        }}
        onClick={event => {
          placeBelow(event.currentTarget);
          if (canHover() && event.detail > 0) event.preventDefault();
        }}
      />
      <div
        ref={popoverRef}
        id={POPOVER_ID}
        popover="auto"
        className="inset-auto m-0 w-85 max-w-[calc(100vw-(--spacing(8)))] rounded-[10px] bg-white p-3.75 pr-8 text-b7 whitespace-normal text-gray-8 shadow-[3px_7px_17.2px_#0000001a]"
      >
        <button
          type="button"
          aria-label="ปิด"
          popoverTarget={POPOVER_ID}
          popoverTargetAction="hide"
          className="absolute top-2.5 right-2.5 cursor-pointer text-blue-7 hover:text-blue-8"
        >
          <CloseIcon className="size-4" />
        </button>
        <p className="font-bold">ความเกี่ยวข้องกับประเด็นที่เลือก</p>
        <p>
          คือการเรียงข้อถกเถียงจากที่มีความหมายใกล้เคียงกับชื่อกลุ่มประเด็นที่เลือกมากไปน้อย
          โดยระบบใช้โมเดลคณิตศาสตร์ช่วยวิเคราะห์ความหมายของข้อความ
        </p>
        <p className="mt-4">
          เช่น หากเลือกกลุ่มประเด็น 'องค์ประกอบและความหลากหลายของ สสร.'
          ข้อถกเถียงที่กล่าวถึงความหลากหลาย หรือแนวคิดที่มีความหมายใกล้เคียงกัน
          จะอยู่ในลำดับต้น&nbsp;ๆ
        </p>
      </div>
    </>
  );
}
