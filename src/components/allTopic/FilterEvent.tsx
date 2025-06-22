import { useEffect, useRef, useState } from 'react';
import { DreamConEvent } from '../../types/event';
import { Tooltip } from '@mui/material';
import IconInfo from '../icon/Info';
import TooltipEventInfo from './TooltipEventInfo';

interface PropTypes {
  event: DreamConEvent;
  onClick: (event: DreamConEvent) => void;
  isSelected?: boolean;
  isOwner?: boolean;
  highlightedTopic?: string;
}

export default function FilterEvent(props: PropTypes) {
  const [hovered, setHovered] = useState(false);
  const autoScrollRef = useRef<HTMLDivElement>(null);
  const [shouldScroll, setShouldScroll] = useState(false);

  useEffect(() => {
    // check autoScrollRef.current width
    if (!autoScrollRef.current) return;
    const container = autoScrollRef.current;
    const containerWidth = container.clientWidth;
    const textWidth = container.scrollWidth;
    if (textWidth > containerWidth) {
      setShouldScroll(true);
    } else {
      setShouldScroll(false);
    }
  }, [autoScrollRef]);

  useEffect(() => {
    if (!shouldScroll) return;
    if (!autoScrollRef.current) return;
    const container = autoScrollRef.current;
    let direction = 1;
    let scrollAmount = 0;
    const maxScroll = container.scrollWidth - container.clientWidth;

    let interval: NodeJS.Timeout;

    const startScrolling = () => {
      clearInterval(interval); // clear any previous interval

      const currentSpeed = direction === 1 ? 50 : 10;

      interval = setInterval(() => {
        scrollAmount += direction;
        container.scrollLeft = scrollAmount;

        if (scrollAmount >= maxScroll || scrollAmount <= 0) {
          direction *= -1; // change direction
          startScrolling(); // restart interval with new speed
        }
      }, currentSpeed);
    };

    startScrolling();

    return () => clearInterval(interval);
  }, [shouldScroll]);

  return (
    <div
      className="flex items-center flex-col shrink-0 relative h-[112px] justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {!props.isSelected && props.highlightedTopic && !props.isOwner && (
        <>
          <div className="z-20 absolute w-[6px] h-[6px] rounded-full bg-white right-[6px] top-[24px] shadow-sm" />
          <div
            ref={autoScrollRef}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            className={`z-10 w-[84px] text-[8px] text-center absolute bg-white rounded-full right-[0px] top-[0px] py-[4px] ${
              shouldScroll ? 'px-[8px]' : ''
            } shadow-sm rounded-full overflow-hidden`}
          >
            {props.highlightedTopic}
          </div>
        </>
      )}
      {!props.isSelected && props.isOwner && (
        <>
          <div className="z-20 absolute w-[6px] h-[6px] rounded-full bg-black right-[6px] top-[24px] shadow-sm" />
          <div className="z-10 w-[84px] text-[8px] text-white text-center absolute bg-black rounded-full right-[0px] top-[0px] py-[4px] shadow-sm rounded-full overflow-hidden wv-ibmplex whitespace-nowrap">
            วงสนทนาของคุณ
          </div>
        </>
      )}
      <div
        className={`w-[75px] h-[75px] rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden border-2 ${
          !props.isSelected && hovered ? 'border-gray5' : 'border-transparent'
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
          className={`w-[75px] h-[75px] pointer-events-none`}
        />
      </div>

      <div className="relative  px-[5px]">
        <p
          className={`text-[10px] text-gray5 px-[5px] py-[3px] text-center ${
            props.isSelected
              ? 'bg-blue6 rounded-full text-white wv-semibold whitespace-nowrap'
              : 'truncate w-[75px]'
          }`}
        >
          {props.isOwner && props.isSelected
            ? 'วงสนทนาของคุณ'
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
            classes={{ tooltip: 'tooltip-2' }}
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
