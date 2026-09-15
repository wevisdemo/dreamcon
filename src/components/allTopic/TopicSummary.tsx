import React, { useContext } from 'react';
import AddCommentIcon from '@material-symbols/svg-700/rounded/maps_ugc.svg?react';
import { useHotkeys } from 'react-hotkeys-hook';
import { StoreContext } from '../../store';
import { Topic } from '../../types/topic';
import PinIcon from '../icon/PinIcon';
import SideScreenIcon from '../icon/SideScreenIcon';
import TopicSummaryComment from './TopicSummaryComment';

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
      className={`relative flex flex-col gap-4 rounded-2xl border-2 bg-white p-6 ${
        hovered && !props.isSelected ? 'hover:drop-shadow-xl' : ''
      } ${getBorderClass()} hover:cursor-pointer`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        props.onClick();
      }}
    >
      {props.isPinned && (
        <PinIcon
          className="absolute -top-3 left-6 h-6 w-6 rounded-full border-2 border-blue-6 bg-white text-blue-6"
          role="img"
          aria-label="ปักหมุดแล้ว"
        />
      )}
      {hovered && !props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon className="absolute top-1.25 right-2 h-6 w-6 text-[#D9D9D9] hover:cursor-pointer" />
      )}
      {props.isSelected && !props.hideSideScreenIcon && (
        <SideScreenIcon className="absolute top-1.25 right-2 h-6 w-6 text-blue-6 hover:cursor-pointer" />
      )}
      <p className="wv-bold wv-ibmplex text-b2"> {props.topic.title} </p>
      <div className="flex h-8 items-center justify-between">
        <p className="text-b3 text-blue-6 underline">
          {props.topic.comments.length || 0} ความคิดเห็น
        </p>
        {!props.isSelected && !props.isReadOnly && (
          <button
            className="rounded-full border-[1.5px] border-solid border-gray-2 px-3 py-1.5 hover:bg-gray-2"
            aria-label="เพิ่มข้อถกเถียงต่อยอด"
            onClick={e => {
              e.stopPropagation();
              props.onAddComment();
            }}
          >
            <AddCommentIcon className="h-4.5 w-4.5 text-blue-5" aria-hidden />
          </button>
        )}
      </div>
      <TopicSummaryComment comments={props.topic.comments} />
    </div>
  );
}
