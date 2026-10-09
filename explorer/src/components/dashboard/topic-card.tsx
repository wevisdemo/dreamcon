import { memo, type Ref } from 'react';
import { commentViews } from '../../constants/comment-views';
import type { Comment, Conversation } from '../../data/conversations';
import { SidePanelIcon } from '../../icons/side-panel';
import { excerptAroundKeyword } from '../../utils/excerpt';
import { CommentDot } from '../comment-dot';
import { FilterTag } from '../filter-tag';
import { HighlightedText } from './highlighted-text';

export const TopicCard = memo(function TopicCard({
  id,
  title,
  groups,
  comments,
  targetGroupTypes,
  keyword,
  matchedComment,
  selectedCategory,
  selectedTargetGroupTypes = [],
  selected = false,
  onSelect,
  ref,
  className = '',
}: Pick<Conversation, 'id' | 'title' | 'groups' | 'comments'> & {
  targetGroupTypes: string[];
  keyword: string;
  matchedComment?: Comment;
  selectedCategory?: string;
  selectedTargetGroupTypes?: string[];
  selected?: boolean;
  onSelect: (id: string) => void;
  ref?: Ref<HTMLElement>;
  className?: string;
}) {
  const categories = [...new Set(groups.map(({ category }) => category))];
  const commentExcerpt =
    matchedComment && excerptAroundKeyword(matchedComment.reason, keyword);
  const sortedComments = comments.toSorted(
    (a, b) => commentViews.indexOf(a.view) - commentViews.indexOf(b.view)
  );

  return (
    <article
      ref={ref}
      className={`relative flex flex-col gap-2 rounded-2xl border-2 bg-white px-3 py-4 transition-[box-shadow,opacity] [contain-intrinsic-size:auto_300px] [content-visibility:auto] hover:shadow-[3px_7px_17.2px_rgb(0_0_0/0.1)] md:gap-4 md:px-7 md:py-6 ${selected ? 'border-blue-7' : 'border-transparent group-[.dimmed]/cards:opacity-50'} ${className}`}
    >
      {selected && (
        <SidePanelIcon className="absolute top-2.5 right-2.5 size-6 text-blue-7" />
      )}
      <div className="flex flex-col gap-2 md:gap-4">
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-0.5">
            {categories.map(category => (
              <FilterTag
                key={category}
                variant={
                  category === selectedCategory ? 'primary' : 'secondary'
                }
              >
                <HighlightedText text={category} keyword={keyword} />
              </FilterTag>
            ))}
          </div>
        )}
        <h3 className="text-h10 font-bold">
          <button
            type="button"
            aria-expanded={selected}
            onClick={() => onSelect(id)}
            className="cursor-pointer text-left after:absolute after:inset-0"
          >
            <HighlightedText text={title} keyword={keyword} />
          </button>
        </h3>
      </div>
      <div className="flex flex-col gap-2 border-t border-gray-3 pt-2 md:gap-2.5 md:pt-4">
        <p className="text-b7 font-bold text-gray-6">
          {comments.length} ความคิดเห็น
        </p>
        <div className="flex flex-wrap items-center gap-px">
          {sortedComments.map(({ id, view, comments }) => (
            <CommentDot key={id} view={view} extended={comments.length > 0} />
          ))}
        </div>
        {commentExcerpt && (
          <p className="text-b6 text-gray-6">
            <HighlightedText text={commentExcerpt} keyword={keyword} />
          </p>
        )}
      </div>
      {targetGroupTypes.length > 0 && (
        <div className="flex flex-wrap items-center gap-0.5 border-t border-gray-3 pt-2 md:pt-4">
          <span className="text-b7 text-blue-7">จากวงสนทนาที่มี</span>
          {targetGroupTypes.map(type => (
            <FilterTag
              key={type}
              variant={
                selectedTargetGroupTypes.includes(type)
                  ? 'primary'
                  : 'secondary'
              }
            >
              {type}
            </FilterTag>
          ))}
        </div>
      )}
    </article>
  );
});
