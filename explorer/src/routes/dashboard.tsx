import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Legend } from '../components/dashboard/legend';
import { Masonry } from '../components/dashboard/masonry';
import { TopicCard } from '../components/dashboard/topic-card';
import { Dropdown } from '../components/dropdown';
import { commentViews, type CommentView } from '../constants/comment-views';
import { getConversations } from '../data/conversations';
import { getEvents } from '../data/events';

const sortOptions: {
  value: string;
  label: string;
  views: readonly CommentView[];
}[] = [
  { value: 'comments', label: 'จำนวนความคิดเห็น', views: commentViews },
  { value: 'agree', label: 'จำนวนเห็นด้วย', views: ['เห็นด้วย'] },
  {
    value: 'disagree',
    label: 'จำนวนเห็นด้วยบางส่วน และไม่เห็นด้วย',
    views: ['เห็นด้วยบางส่วน', 'ไม่เห็นด้วย'],
  },
];

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const [events, conversations] = await Promise.all([
      getEvents(),
      getConversations(),
    ]);
    const targetGroupTypesByEvent = new Map(
      events.map(({ id, targetGroup }) => [id, targetGroup.types])
    );
    return {
      conversations: conversations.map(({ eventIds, ...conversation }) => ({
        ...conversation,
        targetGroupTypes: [
          ...new Set(
            eventIds.flatMap(id => targetGroupTypesByEvent.get(id) ?? [])
          ),
        ],
      })),
    };
  },
  component: function Dashboard() {
    const { conversations } = Route.useLoaderData();
    const [sortBy, setSortBy] = useState(sortOptions[0].value);

    const { views } =
      sortOptions.find(({ value }) => value === sortBy) ?? sortOptions[0];

    const countViews = ({ comments }: (typeof conversations)[number]) =>
      comments.filter(({ view }) => views.includes(view)).length;

    const sortedConversations = conversations.toSorted(
      (a, b) => countViews(b) - countViews(a)
    );

    return (
      <div className="bg-blue-3">
        <div className="mx-auto flex w-[95vw] max-w-[calc(3*500px+2*(--spacing(5)))] flex-col gap-3 md:py-5">
          <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 whitespace-nowrap">
            <div className="flex flex-wrap items-center gap-3 text-b7 text-gray-8">
              <p className="text-gray-8">
                แสดง <b>{conversations.length}</b> จากทั้งหมด{' '}
                {conversations.length} ข้อถกเถียง
              </p>
              <label className="flex items-center gap-2 text-gray-6">
                เรียงตาม
                <Dropdown
                  options={sortOptions}
                  value={sortBy}
                  onChange={event => setSortBy(event.target.value)}
                />
              </label>
            </div>
            <Legend />
          </div>
          <Masonry maxColumnWidth={500} className="gap-3 md:gap-5">
            {sortedConversations.map(({ id, ...conversation }) => (
              <TopicCard key={id} {...conversation} />
            ))}
          </Masonry>
        </div>
      </div>
    );
  },
});
