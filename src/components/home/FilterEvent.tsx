import { useState } from "react";
import { DreamConEvent } from "../../types/event";
import { Tooltip } from "@mui/material";
import IconInfo from "../icon/Info";
import TooltipEventInfo from "./TooltipEventInfo";

interface PropTypes {
  event: DreamConEvent;
  onClick: (event: DreamConEvent) => void;
  isSelected?: boolean;
  isOwner?: boolean;
}

export default function FilterEvent(props: PropTypes) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="flex items-center flex-col shrink-0"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      <div
        className={`w-[75px] h-[75px] rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden ${
          !props.isSelected && hovered ? "border-2 border-gray5" : ""
        }`}
        onClick={() => props.onClick(props.event)}
      >
        {props.isSelected && (
          <span className="text-[20px] text-white wv-bold absolute left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)]">
            {props.event.topic_counts}
          </span>
        )}
        <img
          src={props.event.avatar_url}
          alt={`Avatar of ${props.event.display_name}`}
          className={`w-[75px] h-[75px] `}
        />
      </div>

      <div className="relative  px-[5px]">
        <p
          className={`text-[10px] text-gray5 px-[5px] py-[3px] text-center ${
            props.isSelected
              ? "bg-blue6 rounded-full text-white wv-semibold whitespace-nowrap"
              : "truncate w-[75px]"
          }`}
        >
          {props.isOwner && props.isSelected
            ? "วงสนทนาของคุณ"
            : props.event.display_name}
        </p>
        {hovered && (!props.isSelected || !props.isOwner) && (
          <Tooltip
            title={
              <TooltipEventInfo
                event={props.event}
                onclickSelect={() => props.onClick(props.event)}
              />
            }
            placement="bottom"
            className="hover:cursor-pointer"
            classes={{ tooltip: "tooltip-2" }}
          >
            <div className="absolute w-[10px] h-[10px] right-[-5px] top-[50%] translate-y-[-50%] ">
              <IconInfo className="w-[10px] h-[10px]" />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
