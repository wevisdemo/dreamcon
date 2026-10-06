import { commentViews } from '../../constants/comment-views';
import { CommentDot } from '../comment-dot';

export function Legend() {
  return (
    <ul className="flex flex-wrap items-center gap-2.5 text-b7 text-gray-8">
      {commentViews.map(view => (
        <li key={view} className="flex items-center gap-1">
          <CommentDot view={view} />
          <span className="[text-box:trim-both_cap_alphabetic]">{view}</span>
        </li>
      ))}
      <li className="border-l border-gray-6">
        <br />
      </li>
      <li className="flex items-center gap-1">
        <CommentDot extended />
        <span className="[text-box:trim-both_cap_alphabetic]">
          ความคิดเห็นที่มีการต่อยอด
        </span>
      </li>
    </ul>
  );
}
