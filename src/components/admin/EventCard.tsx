import { useState } from 'react';
import { DreamConEvent } from '../../types/event';
import IconPen from '../icon/Pen';
import ChainIcon from '../icon/ChainIcon';

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
    <div className="bg-white px-4 py-6 rounded-[15px] max-w-235 w-full flex">
      <div className="flex flex-col items-center max-w-37.5 w-full gap-4">
        <div className="w-6.25 h-6.25 flex items-center justify-center text-blue-6 border-1 border-blue-6 rounded-full text-label font-bold">
          {props.index}
        </div>
        <img
          src={props.event.avatar_url}
          alt="event-avatar"
          className="w-24 h-24 rounded-full"
        />
        <p className="font-bold text-center text-b2">
          {props.event.display_name}
        </p>
        <button
          className="flex gap-2 items-center px-4 py-1 bg-blue-1 text-blue-6 font-bold rounded-full"
          onClick={props.onClickEdit}
        >
          <IconPen />
          แก้ไขข้อมูล
        </button>
      </div>

      <div className="flex w-full h-auto gap-4">
        <div className="w-1/2 h-fit p-4 bg-gray-1 rounded-lg flex flex-col gap-4 text-b3">
          <div className="flex flex-col gap-1.5">
            <h2 className="heading-5 wv-ibmplex font-bold">
              {props.event.title_en}
            </h2>
            <p className="">{props.event.title_th}</p>
          </div>
          <div className="flex flex-col gap-1.5">
            <p className="text-b3 mt-2">{props.event.description}</p>
            <ul className="text-label-sm text-gray-7 flex flex-col gap-0.5">
              <li className="flex items-center gap-2">
                <img src="/icon/location.svg" alt="location-icon" /> ที่{' '}
                {props.event.location}
              </li>
              <li className="flex items-center gap-2">
                <img src="/icon/clock.svg" alt="clock-icon" /> จัดขึ้นวันที่{' '}
                {props.event.date}
              </li>
              <li className="flex items-center gap-2">
                <img src="/icon/target.svg" alt="target-icon" /> กลุ่มเป้าหมาย:{' '}
                {props.event.target_group}
              </li>
              <li className="flex items-center gap-2">
                <img src="/icon/participant.svg" alt="participant-icon" />{' '}
                จำนวนผู้เข้าร่วม: {props.event.participants} คน
              </li>
            </ul>
          </div>

          <p className="flex gap-1 text-blue-7 text-label-sm">
            ลิงก์ข่าว{' '}
            <a href={props.event.news_link} className="underline ">
              {props.event.news_link}
            </a>
          </p>
        </div>

        <div className="w-1/2 h-full flex flex-col gap-4">
          <p className="text-blue-7 font-bold text-right">
            สร้าง {props.event.topic_counts} ข้อถกเถียง
          </p>
          <button
            className="w-full h-full flex flex-col justify-center items-center gap-2 bg-blue-1 text-blue-6 font-bold rounded-lg"
            onClick={props.onClickCreateDebate}
          >
            <img
              className="w-4 h-4"
              src="/icon/new-tab.svg"
              alt="new-tab-icon"
            />
            <p>สร้างข้อถกเถียงของวงสนทนานี้</p>
          </button>
          <button
            className="flex gap-2 items-center justify-center py-2 bg-blue-2 text-blue-7 font-bold rounded-lg"
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
