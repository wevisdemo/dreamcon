import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { DreamConEvent } from '../../types/event';
import ClockIcon from '../icon/ClockIcon';
import LocationIcon from '../icon/LocationIcon';
import ParticipantIcon from '../icon/ParticipantIcon';
import TargetIcon from '../icon/TargetIcon';

interface PropTypes {
  event: DreamConEvent;
  onclickSelect: () => void;
}

export default function TooltipEventInfo(props: PropTypes) {
  return (
    <div className="w-90 flex flex-col wv-ibmplexlooped text-black">
      <div className="h-fit p-4 bg-white rounded-lg flex flex-col gap-4 text-b3">
        <div className="flex gap-4 justify-between">
          <div className="flex flex-col gap-1.5">
            <h2 className="heading-5 wv-ibmplex font-bold">
              {props.event.title_en}
            </h2>
            <p className="">{props.event.title_th}</p>
          </div>
          <a
            href={props.event.news_link}
            className="flex text-blue-7 items-center h-fit"
          >
            ลิงก์ข่าว
            <OpenInNewIcon className="w-3 h-3 text-blue-6" aria-hidden />
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="text-b3 mt-2">{props.event.description}</p>
          <ul className="text-label-sm text-gray-7 flex flex-col gap-0.5">
            <li className="flex items-center gap-2">
              <LocationIcon aria-hidden /> ที่ {props.event.location}
            </li>
            <li className="flex items-center gap-2">
              <ClockIcon aria-hidden /> จัดขึ้นวันที่ {props.event.date}
            </li>
            <li className="flex items-center gap-2">
              <TargetIcon aria-hidden /> กลุ่มเป้าหมาย:{' '}
              {props.event.target_group}
            </li>
            <li className="flex items-center gap-2">
              <ParticipantIcon aria-hidden /> จำนวนผู้เข้าร่วม:{' '}
              {props.event.participants} คน
            </li>
          </ul>
        </div>
        <div className="w-full bg-blue-2 py-1.25 px-2 rounded-[5px] text-blue-7 flex justify-between">
          <span className="text-blue-7 wv-bold">
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
