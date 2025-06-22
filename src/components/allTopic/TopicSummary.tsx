import React, { useContext } from 'react';
import { Topic } from '../../types/topic';
import TopicSummaryComment from './TopicSummaryComment';
import SideScreenIcon from '../icon/SideScreenIcon';
import { useHotkeys } from 'react-hotkeys-hook';
import { StoreContext } from '../../store';

interface PropTypes {
  topic: Topic;
  isSelected?: boolean;
  onClick: () => void;
  onAddComment: () => void;
  isOver?: boolean;
  isPinned?: boolean;
  isReadOnly?: boolean;
  hideSideScreenIcon?: boolean;
}

export default function TopicSummary(props: PropTypes) {
  const [hovered, setHovered] = React.useState(false);
  const { clipboard: clipboardContext } = useContext(StoreContext);

  const getBorderClass = () => {
    if (props.isOver && !props.isSelected) return 'border-dashed border-blue4';
    else if (props.isSelected) return 'border-blue6';
    else return 'border-transparent';
  };

  useHotkeys('Meta+v, ctrl+v', () => {
    if (hovered) {
      clipboardContext.emitMoveComment({
        type: 'topic',
        topic: props.topic,
      });
    }
  });

  return (
    <div
      className={`bg-white rounded-[16px] p-[24px] relative flex flex-col gap-[16px] border-[2px] ${
        hovered && !props.isSelected ? 'hover:drop-shadow-xl' : ''
      }
      ${getBorderClass()} hover:cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.isPinned && (
        <img
          className="absolute top-[-12px] left-[24px] bg-white h-[24px] w-[24px] rounded-full border-blue6 border-[2px]"
          src="/icon/pin-blue.svg"
          alt="icon-pin-blue"
        />
      )}
      {hovered && !props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon
          className="h-[24px] w-[24px] absolute top-[5px] right-[8px] hover:cursor-pointer"
          color="#D9D9D9"
        />
      )}
      {props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon
          className="h-[24px] w-[24px] absolute top-[5px] right-[8px] hover:cursor-pointer"
          color="#2579F5"
        />
      )}
      <p className="text-[16px] wv-bold wv-ibmplex"> {props.topic.title} </p>
      <div className="flex justify-between items-center h-[32px]">
        <p className="text-accent underline text-[13px]">
          {props.topic.comments.length || 0} ความคิดเห็น
        </p>
        {!props.isSelected && !props.isReadOnly && (
          <button
            className="px-[12px] py-[6px] border-solid border-[1.5px] border-gray2 rounded-[48px] hover:bg-gray2"
            onClick={e => {
              e.stopPropagation();
              props.onAddComment();
            }}
          >
            <img src="/icon/bubble-plus.svg" alt="bubble-plus-icon" />
          </button>
        )}
      </div>
      <TopicSummaryComment comments={props.topic.comments} />
    </div>
  );
}
