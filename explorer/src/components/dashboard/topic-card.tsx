import { commentViews } from '../../constants/comment-views';
import type { Comment, Conversation } from '../../data/conversations';
import { excerptAroundKeyword } from '../../utils/excerpt';
import { CommentDot } from '../comment-dot';
import { FilterTag } from '../filter-tag';
import { HighlightedText } from './highlighted-text';

export function TopicCard({
  title,
  groups,
  comments,
  targetGroupTypes,
  keyword,
  matchedComment,
  selectedCategory,
}: Pick<Conversation, 'title' | 'groups' | 'comments'> & {
  targetGroupTypes: string[];
  keyword: string;
  matchedComment?: Comment;
  selectedCategory?: string;
}) {
  const categories = [...new Set(groups.map(({ category }) => category))];
  const commentExcerpt =
    matchedComment && excerptAroundKeyword(matchedComment.reason, keyword);
  const sortedComments = comments.toSorted(
    (a, b) => commentViews.indexOf(a.view) - commentViews.indexOf(b.view)
  );

  return (
    <article className="flex flex-col gap-2 rounded-xl bg-white px-3 py-4 transition-shadow hover:shadow-[3px_7px_17.2px_rgb(0_0_0/0.1)] md:gap-4 md:px-7 md:py-6">
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
          <HighlightedText text={title} keyword={keyword} />
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
            <FilterTag key={type}>{type}</FilterTag>
          ))}
        </div>
      )}
    </article>
  );
}
