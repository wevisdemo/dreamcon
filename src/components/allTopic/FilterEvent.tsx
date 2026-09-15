import { useEffect, useRef, useState } from 'react';
import InfoIcon from '@material-symbols/svg-700/outlined/info.svg?react';
import { Tooltip } from '@mui/material';
import { DreamConEvent } from '../../types/event';
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
      className="relative flex h-28 shrink-0 flex-col items-center justify-end"
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
    >
      {!props.isSelected && props.highlightedTopic && !props.isOwner && (
        <>
          <div className="absolute top-6 right-1.5 z-20 h-1.5 w-1.5 rounded-full bg-white shadow-sm" />
          <div
            ref={autoScrollRef}
            style={{
              whiteSpace: 'nowrap',
              overflow: 'hidden',
            }}
            className={`absolute top-0 right-0 z-10 w-21 rounded-full bg-white py-1 text-center text-label-sm ${
              shouldScroll ? 'px-2' : ''
            } overflow-hidden rounded-full shadow-sm`}
          >
            {props.highlightedTopic}
          </div>
        </>
      )}
      {!props.isSelected && props.isOwner && (
        <>
          <div className="absolute top-6 right-1.5 z-20 h-1.5 w-1.5 rounded-full bg-black shadow-sm" />
          <div className="wv-ibmplex absolute top-0 right-0 z-10 w-21 overflow-hidden rounded-full bg-black py-1 text-center text-label-sm whitespace-nowrap text-white shadow-sm">
            วงสนทนาของคุณ
          </div>
        </>
      )}
      <div
        className={`relative flex h-18.75 w-18.75 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 ${
          !props.isSelected && hovered ? 'border-gray-5' : 'border-transparent'
        }`}
        onClick={() => props.onClick(props.event)}
      >
        {props.isSelected && (
          <span className="wv-bold absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-b1 text-white drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.4)]">
            {props.event.topic_counts}
          </span>
        )}
        <img
          src={props.event.avatar_url}
          alt={`Avatar of ${props.event.display_name}`}
          className={`pointer-events-none h-18.75 w-18.75`}
        />
      </div>

      <div className="relative px-1.25">
        <p
          className={`px-1.25 py-0.75 text-center text-label-sm text-gray-5 ${
            props.isSelected
              ? 'wv-semibold rounded-full bg-blue-6 whitespace-nowrap text-white'
              : 'w-18.75 truncate'
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
            <div className="absolute top-1/2 -right-1.25 h-2.5 w-2.5 -translate-y-1/2">
              <InfoIcon className="h-2.5 w-2.5 text-gray-5" />
            </div>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
