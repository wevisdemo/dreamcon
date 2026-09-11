import { useState } from 'react';
import { CommentView } from '../../types/comment';
import { usePermission } from '../../hooks/usePermission';

const commentViewOptions = [
  {
    view: CommentView.AGREE,
    label: 'เห็นด้วย',
    color: 'hover:bg-lightGreen border-lightGreen',
    background: 'bg-lightGreen',
    mutedBackground: 'bg-lightGreen/25',
  },
  {
    view: CommentView.PARTIAL_AGREE,
    label: 'เห็นด้วยบ้าง',
    color: 'hover:bg-lightYellow border-lightYellow',
    background: 'bg-lightYellow',
    mutedBackground: 'bg-lightYellow/25',
  },
  {
    view: CommentView.DISAGREE,
    label: 'ไม่เห็นด้วย',
    color: 'hover:bg-lightRed border-lightRed',
    background: 'bg-lightRed',
    mutedBackground: 'bg-lightRed/25',
  },
];

interface PropTypes {
  canJoin: boolean;
  onJoinTopic: () => void;
  onAddComment: (commentView: CommentView, reason: string) => void;
}

export default function JoinTopic(props: PropTypes) {
  const { getWriterEvent } = usePermission();
  const [commentView, setCommentView] = useState<null | CommentView>(
    CommentView.AGREE
  );
  const [newCommentText, setNewCommentText] = useState('');

  const activeEvent = getWriterEvent();

  const handleSelectCommentView = (selectedView: CommentView) => {
    if (commentView === selectedView) {
      setCommentView(null);
      return;
    }
    setCommentView(selectedView);
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || commentView === null) return;
    props.onAddComment(commentView, newCommentText);
    setCommentView(CommentView.AGREE);
    setNewCommentText('');
  };

  const canSubmit = () =>
    newCommentText.trim().length > 0 && commentView !== null;

  if (props.canJoin) {
    return (
      <div className="flex flex-row gap-2 px-4 py-5 bg-blue5 rounded-2xl items-center">
        <p className="text-b3 font-bold flex-1">
          วงสนทนาของคุณพูดเรื่องเดียวกันหรือไม่
        </p>
        <button
          className="py-2.5 px-4 bg-blue4 hover:bg-blue3 border-white border-1 rounded-full text-label"
          onClick={props.onJoinTopic}
        >
          + ใช่ เพิ่มวงของฉัน
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 bg-blue3 rounded-2xl">
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
            } ${option.color} border-solid border rounded-[48px] w-full`}
            onClick={() => handleSelectCommentView(option.view)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {commentView && activeEvent && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="px-2.5 py-2 bg-gray2 flex gap-1 text-label-sm border border-gray3 border-b-0 rounded-t">
              <span>ความคิดเห็นของ</span>
              <img src="/icon/community.svg" alt="icon-community" />
              <span className="font-semibold">{activeEvent.display_name}</span>
            </div>
            <textarea
              className="w-full p-2.5 text-b3 bg-gray1 resize-none focus:outline-none border border-t-0 border-gray3 rounded-b"
              name="add-comment-in-topic-card"
              id="add-comment-in-topic-card"
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
              className="w-full py-2.5 flex items-center justify-center gap-2 hover:bg-blue2 border-2 rounded-full wv-ibmplex text-button font-bold"
              onClick={handleAddComment}
            >
              <svg className="w-3" viewBox="0 0 17 18" fill="none">
                <path
                  d="M6.9 4.575L2.3 9.175C2.03333 9.44167 1.71667 9.575 1.35 9.575C0.983333 9.575 0.666667 9.44167 0.4 9.175C0.133333 8.90833 0 8.59167 0 8.225C0 7.85833 0.133333 7.54167 0.4 7.275L7.3 0.375C7.43333 0.241667 7.575 0.145833 7.725 0.0875C7.875 0.0291667 8.04167 0 8.225 0C8.40833 0 8.575 0.0291667 8.725 0.0875C8.875 0.145833 9.01667 0.241667 9.15 0.375L16.1 7.325C16.3667 7.59167 16.5 7.90833 16.5 8.275C16.5 8.64167 16.3667 8.95833 16.1 9.225C15.8333 9.49167 15.5167 9.625 15.15 9.625C14.7833 9.625 14.4667 9.49167 14.2 9.225L9.55 4.575V15.725C9.55 16.0917 9.42083 16.4042 9.1625 16.6625C8.90417 16.9208 8.59167 17.05 8.225 17.05C7.85833 17.05 7.54583 16.9208 7.2875 16.6625C7.02917 16.4042 6.9 16.0917 6.9 15.725V4.575Z"
                  fill="currentColor"
                />
              </svg>
              ส่ง
            </button>
          )}
        </div>
      )}
    </div>
  );
}
