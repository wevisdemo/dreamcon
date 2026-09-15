import { Comment, CommentView } from '../../types/comment';

interface PropTypes {
  comments: Comment[];
}

export default function TopicSummaryComment(props: PropTypes) {
  const getCommentsByView = (view: CommentView) => {
    return props.comments.filter(comment => comment.comment_view === view);
  };
  const getHeightOfCommentsCount = (count: number): number => {
    const baseNumber = 24;
    return baseNumber + count * 4;
  };
  return (
    <div className="flex flex-col">
      {getCommentsByView(CommentView.AGREE).length > 0 && (
        <div
          className={`flex w-full gap-2 py-2`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.AGREE).length
            )}px`,
          }}
        >
          <div className="h-full w-3 rounded-full bg-green-light"></div>
          <p className="flex gap-2 text-label text-gray-5">
            <span>{getCommentsByView(CommentView.AGREE).length}</span>
            <span>เห็นด้วย..</span>
          </p>
        </div>
      )}
      {getCommentsByView(CommentView.PARTIAL_AGREE).length > 0 && (
        <div
          className={`flex w-full gap-2 py-2`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.PARTIAL_AGREE).length
            )}px`,
          }}
        >
          <div className="h-full w-3 rounded-full bg-yellow-3"></div>
          <p className="flex gap-2 text-label text-gray-5">
            <span>{getCommentsByView(CommentView.PARTIAL_AGREE).length}</span>
            <span>เห็นด้วยบางส่วน..</span>
          </p>
        </div>
      )}
      {getCommentsByView(CommentView.DISAGREE).length > 0 && (
        <div
          className={`flex w-full gap-2 py-2`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.DISAGREE).length
            )}px`,
          }}
        >
          <div className="h-full w-3 rounded-full bg-red-2"></div>
          <p className="flex gap-2 text-label text-gray-5">
            <span>{getCommentsByView(CommentView.DISAGREE).length}</span>
            <span>ไม่เห็นด้วย..</span>
          </p>
        </div>
      )}
    </div>
  );
}
