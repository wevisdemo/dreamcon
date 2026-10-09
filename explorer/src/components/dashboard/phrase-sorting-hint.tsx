import { useRef, type PointerEvent as ReactPointerEvent } from 'react';
import { CloseIcon } from '../../icons/close';
import { HelpIcon } from '../../icons/help';
import { Button } from '../button';

const POPOVER_ID = 'phrase-sorting-hint';

export function PhraseSortingHint() {
  const popoverRef = useRef<HTMLDivElement>(null);

  const togglePopoverOnHover = (event: ReactPointerEvent, force: boolean) => {
    if (event.pointerType === 'mouse') popoverRef.current?.togglePopover(force);
  };

  return (
    <>
      <Button
        variant="icon-blue"
        icon={<HelpIcon />}
        aria-label="เกี่ยวกับการเรียงตามความเกี่ยวข้องกับประเด็นที่เลือก"
        popoverTarget={POPOVER_ID}
        onPointerEnter={event => togglePopoverOnHover(event, true)}
        onPointerLeave={event => togglePopoverOnHover(event, false)}
        onClick={event => {
          if ((event.nativeEvent as PointerEvent).pointerType === 'mouse') {
            event.preventDefault();
          }
        }}
        className="[anchor-name:--phrase-sorting-hint]"
      />
      <div
        ref={popoverRef}
        id={POPOVER_ID}
        popover="auto"
        className="w-85 max-w-[calc(100vw-(--spacing(8)))] rounded-[10px] bg-white p-3.75 pr-8 text-b7 whitespace-normal text-gray-8 shadow-[3px_7px_17.2px_#0000001a] supports-[position-area:bottom]:inset-auto supports-[position-area:bottom]:my-1 supports-[position-area:bottom]:[position-anchor:--phrase-sorting-hint] supports-[position-area:bottom]:[position-area:bottom_span-right] supports-[position-area:bottom]:[position-try-fallbacks:flip-inline]"
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
          ข้อถกเถียงที่กล่าวถึงความหลากหลาย หรือแนวคิดที่มีความหมายใกล้เคียงกัน จะอยู่ในลำดับต้น ๆ
        </p>
      </div>
    </>
  );
}
