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
    if (props.isOver && !props.isSelected) return 'border-dashed border-blue-4';
    else if (props.isSelected) return 'border-blue-6';
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
      className={`bg-white rounded-2xl p-6 relative flex flex-col gap-4 border-2 ${
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
          className="absolute -top-3 left-6 bg-white h-6 w-6 rounded-full border-blue-6 border-2"
          src="/icon/pin-blue.svg"
          alt="icon-pin-blue"
        />
      )}
      {hovered && !props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon className="h-6 w-6 absolute top-1.25 right-2 hover:cursor-pointer text-[#D9D9D9]" />
      )}
      {props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon className="h-6 w-6 absolute top-1.25 right-2 hover:cursor-pointer text-blue-6" />
      )}
      <p className="text-b2 wv-bold wv-ibmplex"> {props.topic.title} </p>
      <div className="flex justify-between items-center h-8">
        <p className="text-blue-6 underline text-b3">
          {props.topic.comments.length || 0} ความคิดเห็น
        </p>
        {!props.isSelected && !props.isReadOnly && (
          <button
            className="px-3 py-1.5 border-solid border-[1.5px] border-gray-2 rounded-full hover:bg-gray-2"
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
