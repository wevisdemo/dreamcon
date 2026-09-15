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
    <div className="wv-ibmplexlooped flex w-90 flex-col text-black">
      <div className="flex h-fit flex-col gap-4 rounded-lg bg-white p-4 text-b3">
        <div className="flex justify-between gap-4">
          <div className="flex flex-col gap-1.5">
            <h2 className="wv-ibmplex heading-5 font-bold">
              {props.event.title_en}
            </h2>
            <p className="">{props.event.title_th}</p>
          </div>
          <a
            href={props.event.news_link}
            className="flex h-fit items-center text-blue-7"
          >
            ลิงก์ข่าว
            <OpenInNewIcon className="h-3 w-3 text-blue-6" aria-hidden />
          </a>
        </div>
        <div className="flex flex-col gap-1.5">
          <p className="mt-2 text-b3">{props.event.description}</p>
          <ul className="flex flex-col gap-0.5 text-label-sm text-gray-7">
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
        <div className="flex w-full justify-between rounded-[5px] bg-blue-2 px-2 py-1.25 text-blue-7">
          <span className="wv-bold text-blue-7">
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
