import type { CommentView } from '../constants/comment-views';

const views: Record<CommentView, string> = {
  เห็นด้วย: 'bg-green-4',
  เห็นด้วยบางส่วน: 'bg-yellow-3',
  ไม่เห็นด้วย: 'bg-red-4',
};

export function CommentDot({
  view,
  extended = false,
}: {
  view?: CommentView;
  extended?: boolean;
}) {
  return (
    <span
      className={`inline-flex size-4 shrink-0 items-center justify-center rounded-full border border-gray-3 text-gray-8 ${view ? views[view] : ''}`}
    >
      {extended && (
        <svg
          viewBox="0 0 15 15"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          aria-hidden
          className="size-4"
        >
          <path d="M2.71 8.91 5.54 6.09M7.54 3.5V11.5M9.54 6.09 12.37 8.91" />
        </svg>
      )}
    </span>
  );
}
