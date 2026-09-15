import { useState } from 'react';
import EditIcon from '@material-symbols/svg-700/rounded/edit.svg?react';
import OpenInNewIcon from '@material-symbols/svg-700/rounded/open_in_new.svg?react';
import { DreamConEvent } from '../../types/event';
import ChainIcon from '../icon/ChainIcon';
import ClockIcon from '../icon/ClockIcon';
import LocationIcon from '../icon/LocationIcon';
import ParticipantIcon from '../icon/ParticipantIcon';
import TargetIcon from '../icon/TargetIcon';

interface PropTypes {
  index: number;
  event: DreamConEvent;
  onClickShareLink: () => void;
  onClickEdit: () => void;
  onClickCreateDebate: () => void;
}

export default function EventCard(props: PropTypes) {
  const [alreadyClickLink, setAlreadyClickLink] = useState<boolean>(false);

  return (
    <div className="flex w-full max-w-235 rounded-[15px] bg-white px-4 py-6">
      <div className="flex w-full max-w-37.5 flex-col items-center gap-4">
        <div className="flex h-6.25 w-6.25 items-center justify-center rounded-full border-1 border-blue-6 text-label font-bold text-blue-6">
          {props.index}
        </div>
        <img
          src={props.event.avatar_url}
          alt="event-avatar"
          className="h-24 w-24 rounded-full"
        />
        <p className="text-center text-b2 font-bold">
          {props.event.display_name}
        </p>
        <button
          className="flex items-center gap-2 rounded-full bg-blue-1 px-4 py-1 font-bold text-blue-6"
          onClick={props.onClickEdit}
        >
          <EditIcon className="h-4 w-4" aria-hidden />
          แก้ไขข้อมูล
        </button>
      </div>

      <div className="flex h-auto w-full gap-4">
        <div className="flex h-fit w-1/2 flex-col gap-4 rounded-lg bg-gray-1 p-4 text-b3">
          <div className="flex flex-col gap-1.5">
            <h2 className="wv-ibmplex heading-5 font-bold">
              {props.event.title_en}
            </h2>
            <p className="">{props.event.title_th}</p>
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

          <p className="flex gap-1 text-label-sm text-blue-7">
            ลิงก์ข่าว{' '}
            <a href={props.event.news_link} className="underline">
              {props.event.news_link}
            </a>
          </p>
        </div>

        <div className="flex h-full w-1/2 flex-col gap-4">
          <p className="text-right font-bold text-blue-7">
            สร้าง {props.event.topic_counts} ข้อถกเถียง
          </p>
          <button
            className="flex h-full w-full flex-col items-center justify-center gap-2 rounded-lg bg-blue-1 font-bold text-blue-6"
            onClick={props.onClickCreateDebate}
          >
            <OpenInNewIcon className="h-4 w-4" aria-hidden />
            <p>สร้างข้อถกเถียงของวงสนทนานี้</p>
          </button>
          <button
            className="flex items-center justify-center gap-2 rounded-lg bg-blue-2 py-2 font-bold text-blue-7"
            onClick={() => {
              setAlreadyClickLink(true);
              props.onClickShareLink();
            }}
          >
            <ChainIcon
              className={alreadyClickLink ? 'text-blue-5' : 'text-gray-5'}
            />
            <span className={alreadyClickLink ? 'text-blue-5' : 'text-gray-5'}>
              {alreadyClickLink ? 'คัดลอกแล้ว!' : 'แชร์ลิงก์'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
