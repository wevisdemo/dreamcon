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
      clearInterval(interval);

      const currentSpeed = direction === 1 ? 50 : 10;

      interval = setInterval(() => {
        scrollAmount += direction;
        container.scrollLeft = scrollAmount;

        if (scrollAmount >= maxScroll || scrollAmount <= 0) {
          direction *= -1;
          startScrolling();
        }
      }, currentSpeed);
    };

    startScrolling();

    return () => clearInterval(interval);
  }, [shouldScroll]);

  return (
    <div
      className="flex items-center flex-col shrink-0 relative h-28 justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {!props.isSelected && props.highlightedTopic && !props.isOwner && (
        <>
          <div className="z-20 absolute w-1.5 h-1.5 rounded-full bg-white right-1.5 top-6 shadow-sm" />
          <div
            ref={autoScrollRef}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            className={`z-10 w-21 text-label-sm text-center absolute bg-white rounded-full right-0 top-0 py-1 ${
              shouldScroll ? 'px-2' : ''
            } shadow-sm rounded-full overflow-hidden`}
          >
            {props.highlightedTopic}
          </div>
        </>
      )}
      {!props.isSelected && props.isOwner && (
        <>
          <div className="z-20 absolute w-1.5 h-1.5 rounded-full bg-black right-1.5 top-6 shadow-sm" />
          <div className="z-10 w-21 text-label-sm text-white text-center absolute bg-black rounded-full right-0 top-0 py-1 shadow-sm rounded-full overflow-hidden wv-ibmplex whitespace-nowrap">
            วงสนทนาของคุณ
          </div>
        </>
      )}
      <div
        className={`w-18.75 h-18.75 rounded-full cursor-pointer flex items-center justify-center relative overflow-hidden border-2 ${
          !props.isSelected && hovered ? 'border-gray-5' : 'border-transparent'
        }`}
        onClick={() => props.onClick(props.event)}
      >
        {props.isSelected && (
          <span className="text-b1 text-white wv-bold absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)]">
            {props.event.topic_counts}
          </span>
        )}
        <img
          src={props.event.avatar_url}
          alt={`Avatar of ${props.event.display_name}`}
          className={`w-18.75 h-18.75 pointer-events-none`}
        />
      </div>

      <div className="relative  px-1.25">
        <p
          className={`text-label-sm text-gray-5 px-1.25 py-0.75 text-center ${
            props.isSelected
              ? 'bg-blue-6 rounded-full text-white wv-semibold whitespace-nowrap'
              : 'truncate w-18.75'
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
            <div className="absolute w-2.5 h-2.5 -right-1.25 top-1/2 -translate-y-1/2 ">
              <IconInfo className="w-2.5 h-2.5 text-gray-5" />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
