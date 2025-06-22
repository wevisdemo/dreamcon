import { DreamConEvent } from '../../types/event';

interface PropTypes {
  event: DreamConEvent;
  onclickSelect: () => void;
}

export default function TooltipEventInfo(props: PropTypes) {
  return (
    <div className="w-[360px] flex flex-col wv-ibmplexlooped text-black">
      <div className="h-fit p-[16px] bg-white rounded-[8px] flex flex-col gap-[16px] text-[13px]">
        <div className="flex gap-[16px] justify-between">
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-bold">{props.event.title_en}</h2>
            <p className="">{props.event.title_th}</p>
          </div>
          <a
            href={props.event.news_link}
            className="flex text-blue7 items-center h-fit"
          >
            ลิงก์ข่าว
            <img
              src="/icon/new-tab.svg"
              alt="icon-new-tab"
              className="w-[12px] h-[12px]"
            />
          </a>
        </div>
        <div className="flex flex-col gap-[6px]">
          <p className="text-[10px] mt-[8px]">{props.event.description}</p>
          <ul className="text-[8px] text-gray7 flex flex-col gap-[2px]">
            <li className="flex items-center gap-[8px]">
              <img src="/icon/location.svg" alt="location-icon" /> ที่{' '}
              {props.event.location}
            </li>
            <li className="flex items-center gap-[8px]">
              <img src="/icon/clock.svg" alt="clock-icon" /> จัดขึ้นวันที่{' '}
              {props.event.date}
            </li>
            <li className="flex items-center gap-[8px]">
              <img src="/icon/target.svg" alt="target-icon" /> กลุ่มเป้าหมาย:{' '}
              {props.event.target_group}
            </li>
            <li className="flex items-center gap-[8px]">
              <img src="/icon/participant.svg" alt="participant-icon" />{' '}
              จำนวนผู้เข้าร่วม: {props.event.participants} คน
            </li>
          </ul>
        </div>
        <div className="w-full bg-blue2 py-[5px] px-[8px] rounded-[5px] text-blue7 flex justify-between">
          <span className="text-blue7 wv-bold">
            สร้าง {props.event.topic_counts} ข้อถกเถียง
          </span>
          <span
            className="wv-ibmplex underline hover:cursor-pointer"
            onClick={props.onclickSelect}
          >
            ดูทั้งหมด
          </span>
        </div>
      </div>
    </div>
  );
}
