import { useState } from 'react';
import { commentViews, type CommentView } from '../../constants/comment-views';
import type { Comment } from '../../data/conversations';
import { CommentDot } from '../comment-dot';
import { CommentTag } from '../comment-tag';
import { EventSet } from '../event/event-set';

export function CommentList({
  comments,
  eventNames,
  onEventSelect,
  nested = false,
}: {
  comments: Comment[];
  eventNames: Map<string, string>;
  onEventSelect?: (eventId: string) => void;
  nested?: boolean;
}) {
  const viewCounts = commentViews
    .map(view => ({
      view,
      count: comments.filter(comment => comment.view === view).length,
    }))
    .filter(({ count }) => count > 0);

  const [selectedView, setSelectedView] = useState<CommentView>(
    viewCounts[0]?.view
  );

  const visibleComments = comments.filter(({ view }) => view === selectedView);

  return (
    <div className={nested ? 'pl-3.5' : 'flex flex-col gap-2.5'}>
      <div
        className={`flex flex-wrap items-center gap-1.5 text-b6 ${nested ? 'border-l-2 border-blue-4 pb-2.5 pl-3.5' : 'pt-2.5'}`}
      >
        {viewCounts.map(({ view, count }) => (
          <CommentTag
            key={view}
            view={view}
            count={count}
            size={nested ? 'small' : 'medium'}
            selected={view === selectedView}
            onClick={() => setSelectedView(view)}
          />
        ))}
        {nested ? 'กับความคิดเห็นนี้' : 'กับข้อถกเถียงนี้'}
      </div>
      <ul className={nested ? 'flex flex-col' : 'flex flex-col gap-2.5'}>
        {visibleComments.map(comment => (
          <li
            key={comment.id}
            className={
              nested
                ? 'flex border-l-2 border-blue-4 pb-2.5 last:border-transparent'
                : ''
            }
          >
            {nested && (
              <svg
                viewBox="0 0 11 11"
                aria-hidden
                className="size-2.5 shrink-0 stroke-blue-4 stroke-2"
              >
                <path d="M0 0 11 11" />
              </svg>
            )}
            <div className="flex min-w-0 flex-1 flex-col gap-2.5">
              <div className="flex flex-col gap-1.5">
                <p className="flex gap-2.5 rounded-2xl bg-white p-3.5 text-b5">
                  <CommentDot
                    view={comment.view}
                    extended={comment.comments.length > 0}
                  />
                  {comment.reason}
                </p>
                <EventSet
                  className="ml-4"
                  eventIds={comment.eventIds}
                  eventNames={eventNames}
                  onSelect={onEventSelect}
                />
              </div>
              {comment.comments.length > 0 && (
                <CommentList
                  comments={comment.comments}
                  eventNames={eventNames}
                  onEventSelect={onEventSelect}
                  nested
                />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
