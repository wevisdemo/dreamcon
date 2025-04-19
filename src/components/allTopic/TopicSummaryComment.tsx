import { Comment, CommentView } from "../../types/comment";

interface PropTypes {
  comments: Comment[];
}

export default function TopicSummaryComment(props: PropTypes) {
  const getCommentsByView = (view: CommentView) => {
    return props.comments.filter((comment) => comment.comment_view === view);
  };
  const getHeightOfCommentsCount = (count: number): number => {
    const baseNumber = 24;
    return baseNumber + count * 4;
  };
  return (
    <div className="flex flex-col ">
      {getCommentsByView(CommentView.AGREE).length > 0 && (
        <div
          className={`w-full flex py-[8px] gap-[8px]`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.AGREE).length
            )}px`,
          }}
        >
          <div className="w-[12px] h-full rounded-[48px] bg-lightGreen"></div>
          <p className="text-[13px] text-gray5 flex gap-[8px]">
            <span>{getCommentsByView(CommentView.AGREE).length}</span>
            <span>เห็นด้วย..</span>
          </p>
        </div>
      )}
      {getCommentsByView(CommentView.PARTIAL_AGREE).length > 0 && (
        <div
          className={`w-full flex py-[8px] gap-[8px]`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.PARTIAL_AGREE).length
            )}px`,
          }}
        >
          <div className="w-[12px] h-full rounded-[48px] bg-lightYellow"></div>
          <p className="text-[13px] text-gray5 flex gap-[8px]">
            <span>{getCommentsByView(CommentView.PARTIAL_AGREE).length}</span>
            <span>เห็นด้วยบางส่วน..</span>
          </p>
        </div>
      )}
      {getCommentsByView(CommentView.DISAGREE).length > 0 && (
        <div
          className={`w-full flex py-[8px] gap-[8px]`}
          style={{
            height: `${getHeightOfCommentsCount(
              getCommentsByView(CommentView.DISAGREE).length
            )}px`,
          }}
        >
          <div className="w-[12px] h-full rounded-[48px] bg-lightRed"></div>
          <p className="text-[13px] text-gray5 flex gap-[8px]">
            <span>{getCommentsByView(CommentView.DISAGREE).length}</span>
            <span>ไม่เห็นด้วย..</span>
          </p>
        </div>
      )}
    </div>
  );
}
