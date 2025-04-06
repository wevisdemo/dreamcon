import React from "react";
import { DreamConEvent } from "../../types/event";
import IconPen from "../icon/Pen";

interface PropTypes {
  event: DreamConEvent;
  onClickShareLink: () => void;
}

export default function EventCard(props: PropTypes) {
  return (
    <div className="bg-white px-[16px] py-[24px] rounded-[15px] max-w-[940px] w-full flex">
      {/* Left Section */}
      <div className="flex flex-col items-center max-w-[150px] w-full gap-[16px]">
        <div className="w-[25px] h-[25px] flex items-center justify-center text-blue6 border-1 border-blue6 rounded-full text-[13px] font-bold">
          {props.event.topic_counts}
        </div>
        <img
          src={props.event.avatar_url}
          alt="event-avatar"
          className="w-[96px] h-[96px] rounded-full"
        />
        <p className="font-bold text-center text-[16px]">
          {props.event.display_name}
        </p>
        <button className="flex gap-[8px] items-center px-[16px] py-[4px] bg-blue1 text-blue6 font-bold rounded-[48px]">
          <IconPen color="#2579F5" />
          แก้ไขข้อมูล
        </button>
      </div>

      <div className="flex w-full h-full gap-[16px]">
        {/* Middle Section */}
        <div className="w-1/2 h-fit p-[16px] bg-gray1 rounded-[8px] flex flex-col gap-[16px] text-[13px]">
          <div className="flex flex-col gap-[6px]">
            <h2 className="font-bold">{props.event.title_en}</h2>
            <p className="">{props.event.title_th}</p>
          </div>
          <div className="flex flex-col gap-[6px]">
            <p className="text-[10px] mt-[8px]">{props.event.description}</p>
            <ul className="text-[8px] text-gray7 text-gray-600 flex flex-col gap-[2px]">
              <li className="flex items-center gap-[8px]">
                <img src="/icon/location.svg" alt="location-icon" /> ที่{" "}
                {props.event.location}
              </li>
              <li className="flex items-center gap-[8px]">
                <img src="/icon/clock.svg" alt="clock-icon" /> จัดขึ้นวันที่{" "}
                {props.event.date}
              </li>
              <li className="flex items-center gap-[8px]">
                <img src="/icon/target.svg" alt="target-icon" /> กลุ่มเป้าหมาย:{" "}
                {props.event.target_group}
              </li>
              <li className="flex items-center gap-[8px]">
                <img src="/icon/participant.svg" alt="participant-icon" />{" "}
                จำนวนผู้เข้าร่วม: {props.event.participants} คน
              </li>
            </ul>
          </div>

          <p className="flex gap-[4px] text-blue7 text-[10px]">
            ลิงก์ข่าว{" "}
            <a href={props.event.news_link} className="underline ">
              {props.event.news_link}
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 h-full flex flex-col gap-[16px]">
          <p className="text-blue7 font-bold text-right">
            สร้าง {props.event.topic_counts} ข้อถกเถียง
          </p>
          <button className="w-full h-full flex flex-col justify-center items-center gap-[8px] bg-blue1 text-blue6 font-bold rounded-[8px]">
            <img
              className="w-[16px] h-[16px]"
              src="/icon/new-tab.svg"
              alt="new-tab-icon"
            />
            <p>สร้างข้อถกเถียงของวงสนทนานี้</p>
          </button>
          <button
            className="flex gap-[8px] items-center justify-center py-[8px] bg-blue2 text-blue7 font-bold rounded-[8px]"
            onClick={props.onClickShareLink}
          >
            <img
              className="w-[16px] h-[16px]"
              src="/icon/chain.svg"
              alt="chain-icon"
            />
            แชร์ลิงก์
          </button>
        </div>
      </div>
    </div>
  );
}
