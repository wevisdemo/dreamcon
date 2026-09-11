import { useState } from 'react';
import { CommentView } from '../../types/comment';
import { usePermission } from '../../hooks/usePermission';
import ArrowUpwardIcon from '@material-symbols/svg-700/rounded/arrow_upward.svg?react';
import CommunityIcon from '../icon/CommunityIcon';

const commentViewOptions = [
  {
    view: CommentView.AGREE,
    label: 'เห็นด้วย',
    color: 'hover:bg-green-light border-green-light',
    background: 'bg-green-light',
    mutedBackground: 'bg-green-light/25',
  },
  {
    view: CommentView.PARTIAL_AGREE,
    label: 'เห็นด้วยบ้าง',
    color: 'hover:bg-yellow-3 border-yellow-3',
    background: 'bg-yellow-3',
    mutedBackground: 'bg-yellow-3/25',
  },
  {
    view: CommentView.DISAGREE,
    label: 'ไม่เห็นด้วย',
    color: 'hover:bg-red-2 border-red-2',
    background: 'bg-red-2',
    mutedBackground: 'bg-red-2/25',
  },
];

const colorStyle = {
  blue: {
    joinCard: 'bg-blue-5',
    joinButton: 'bg-blue-4 hover:bg-blue-3 border-white',
    commentCard: 'bg-blue-3',
  },
  gray: {
    joinCard: 'bg-gray-2',
    joinButton: 'bg-white hover:bg-gray-3 border-gray-3',
    commentCard: 'bg-gray-2',
  },
};

interface PropTypes {
  textareaId: string;
  canJoin: boolean;
  color?: keyof typeof colorStyle;
  defaultState?: { comment_view: CommentView; reason: string };
  onJoin: () => void;
  onAddComment: (commentView: CommentView, reason: string) => void;
}

export default function JoinAndComment(props: PropTypes) {
  const { getWriterEvent } = usePermission();
  const [commentView, setCommentView] = useState(
    props.defaultState?.comment_view ?? CommentView.AGREE
  );
  const [newCommentText, setNewCommentText] = useState(
    props.defaultState?.reason ?? ''
  );

  const activeEvent = getWriterEvent();
  const style = colorStyle[props.color ?? 'blue'];

  const handleAddComment = () => {
    if (!newCommentText.trim()) return;
    props.onAddComment(commentView, newCommentText);
    setCommentView(CommentView.AGREE);
    setNewCommentText('');
  };

  const canSubmit = () => newCommentText.trim().length > 0;

  if (props.canJoin) {
    return (
      <div
        className={`flex flex-row gap-2 px-4 py-5 ${style.joinCard} rounded-2xl items-center`}
      >
        <p className="text-b3 font-bold flex-1">
          วงสนทนาของคุณพูดเรื่องเดียวกันหรือไม่
        </p>
        <button
          className={`py-2.5 px-4 ${style.joinButton} border-1 rounded-full text-label`}
          onClick={props.onJoin}
        >
          + ใช่ เพิ่มวงของฉัน
        </button>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-4 p-4 ${style.commentCard} rounded-2xl`}>
      <p className="text-b3 font-bold flex-1">
        วงสนทนาของคุณมีความคิดเห็นต่อยอดว่า..
      </p>
      <div className="flex gap-2">
        {commentViewOptions.map(option => (
          <button
            key={option.view}
            className={`py-2.5 ${
              commentView === option.view
                ? option.background
                : option.mutedBackground
            } ${option.color} border-solid border rounded-full w-full`}
            onClick={() => setCommentView(option.view)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {activeEvent && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="px-2.5 py-2 bg-gray-2 flex gap-1 text-label-sm border border-gray-3 border-b-0 rounded-t">
              <span>ความคิดเห็นของ</span>
              <CommunityIcon className="text-gray-8" aria-hidden />
              <span className="font-semibold">{activeEvent.display_name}</span>
            </div>
            <textarea
              className="w-full p-2.5 text-b3 bg-gray-1 resize-none focus:outline-none border border-t-0 border-gray-3 rounded-b"
              name={props.textareaId}
              id={props.textareaId}
              rows={3}
              value={newCommentText}
              onChange={e => setNewCommentText(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              placeholder="เพราะว่า...(140ตัวอักษร)"
              maxLength={140}
            />
          </div>
          {canSubmit() && (
            <button
              className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-blue-2 border-2 rounded-full wv-ibmplex text-button font-bold"
              onClick={handleAddComment}
            >
              <ArrowUpwardIcon className="w-4.5 h-4.5" aria-hidden />
              ส่ง
            </button>
          )}
        </div>
      )}
    </div>
  );
}
