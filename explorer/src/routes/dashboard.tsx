import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '../components/button';
import { Legend } from '../components/dashboard/legend';
import { Masonry } from '../components/dashboard/masonry';
import { TopicCard } from '../components/dashboard/topic-card';
import { Dropdown } from '../components/dropdown';
import { SearchBar } from '../components/search-bar';
import { commentViews, type CommentView } from '../constants/comment-views';
import { getConversations, type Comment } from '../data/conversations';
import { getEvents } from '../data/events';
import { CloseIcon } from '../icons/close';

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

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

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
    const [keyword, setKeyword] = useState('');
    const [searchBarKey, setSearchBarKey] = useState(0);

    const { views } =
      sortOptions.find(({ value }) => value === sortBy) ?? sortOptions[0];

    const countViews = ({ comments }: (typeof conversations)[number]) =>
      comments.filter(({ view }) => views.includes(view)).length;

    const sortedConversations = conversations.toSorted(
      (a, b) => countViews(b) - countViews(a)
    );

    const indexOfKeyword = (text: string) =>
      text.toLowerCase().indexOf(keyword.toLowerCase());

    const filteredConversations = sortedConversations.flatMap(conversation => {
      const matchedComment = keyword
        ? flattenComments(conversation.comments).find(
            ({ reason }) => indexOfKeyword(reason) >= 0
          )
        : undefined;
      const isMatched =
        indexOfKeyword(conversation.title) >= 0 ||
        conversation.groups.some(
          ({ category }) => indexOfKeyword(category) >= 0
        ) ||
        matchedComment;

      return isMatched ? [{ ...conversation, matchedComment }] : [];
    });

    return (
      <div className="flex flex-1 bg-blue-3">
        <div className="mx-auto flex w-[95vw] max-w-[calc(3*500px+2*(--spacing(5)))] flex-col gap-3 md:py-5">
          <div className="flex flex-row flex-wrap justify-start gap-2 rounded-xl bg-blue-1 p-2 md:gap-2 md:p-4">
            <SearchBar
              key={searchBarKey}
              onSearch={query => setKeyword(query.trim())}
            />
            <Button
              variant="tertiary-gray"
              icon={<CloseIcon />}
              onClick={() => {
                setKeyword('');
                setSearchBarKey(key => key + 1);
              }}
            >
              ล้างตัวกรอง
            </Button>
          </div>

          {filteredConversations.length === 0 ? (
            <div className="flex flex-1 flex-col items-center justify-center gap-1 text-center">
              <p className="font-bold">ไม่พบข้อถกเถียงตามตัวกรองที่เลือก</p>
              <p>ลองเปลี่ยนตัวกรอง</p>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3 whitespace-nowrap">
                <div className="flex flex-wrap items-center gap-3 text-b7 text-gray-8">
                  <p className="text-gray-8">
                    แสดง <b>{filteredConversations.length}</b> จากทั้งหมด{' '}
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
                {filteredConversations.map(({ id, ...conversation }) => (
                  <TopicCard key={id} keyword={keyword} {...conversation} />
                ))}
              </Masonry>
            </>
          )}
        </div>
      </div>
    );
  },
});
