import type { Conversation } from '../../data/conversations';
import type { Event } from '../../data/events';
import { EventSet } from '../event/event-set';
import { FilterTag } from '../filter-tag';
import { CommentList } from './comment-list';

export function ConversationTree({
  conversation,
  events,
  onEventSelect,
  className = '',
}: {
  conversation: Conversation;
  events: Event[];
  onEventSelect?: (eventId: string) => void;
  className?: string;
}) {
  const eventNames = new Map(
    events.map(({ id, displayName }) => [id, displayName])
  );
  const categories = [
    ...new Set(conversation.groups.map(({ category }) => category)),
  ];

  return (
    <div
      className={`flex h-full min-h-0 scrollbar-thin scrollbar-thumb-blue-4 flex-col gap-2.5 overflow-y-auto [view-transition-name:conversation-tree] ${className}`}
    >
      <div className="flex flex-col gap-2.5">
        <div className="flex flex-col gap-2.5 rounded-2xl bg-white p-5">
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-0.5">
              {categories.map(category => (
                <FilterTag key={category} as="span">
                  {category}
                </FilterTag>
              ))}
            </div>
          )}
          <h2 className="text-h9 font-bold">{conversation.title}</h2>
        </div>
        <EventSet
          label="ข้อถกเถียง"
          eventIds={conversation.eventIds}
          eventNames={eventNames}
          onSelect={onEventSelect}
        />
      </div>
      {conversation.comments.length > 0 ? (
        <CommentList
          comments={conversation.comments}
          eventNames={eventNames}
          onEventSelect={onEventSelect}
        />
      ) : (
        <p className="py-7.5 text-center text-b5">
          ยังไม่มีความคิดเห็นเกี่ยวกับข้อถกเถียงนี้
        </p>
      )}
    </div>
  );
}
