import { useState } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { BackToTopButton } from '../components/back-to-top-button';
import { ConversationSidebar } from '../components/dashboard/conversation-sidebar';
import { FilterCategory } from '../components/dashboard/filter-category';
import { FilterEvent } from '../components/dashboard/filter-event';
import {
  FilterSidebar,
  type FilterTab,
} from '../components/dashboard/filter-sidebar';
import { FilterToolbar } from '../components/dashboard/filter-toolbar';
import { Legend } from '../components/dashboard/legend';
import { Masonry } from '../components/dashboard/masonry';
import { TopicCard } from '../components/dashboard/topic-card';
import { Dropdown } from '../components/dropdown';
import { commentViews, type CommentView } from '../constants/comment-views';
import { getConversations } from '../data/conversations';
import { getEvents } from '../data/events';
import { getGroupQuestions } from '../data/group-questions';
import {
  matchesCategorySelection,
  type CategorySelection,
  getSelectedTargetGroupTypes,
  matchesEventSelection,
  type EventSelection,
  searchConversations,
} from '../utils/filter';

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

const relevanceSortOption = {
  value: 'relevance',
  label: 'ความใกล้เคียงคำค้น',
};

export const Route = createFileRoute('/dashboard')({
  loader: async () => {
    const [events, conversations, categories] = await Promise.all([
      getEvents(),
      getConversations(),
      getGroupQuestions(),
    ]);
    const targetGroupTypesByEvent = new Map(
      events.map(({ id, targetGroup }) => [id, targetGroup.types])
    );
    return {
      categories,
      events: events.toSorted((a, b) => b.date.getTime() - a.date.getTime()),
      conversations: conversations.map(({ eventIds, ...conversation }) => ({
        ...conversation,
        eventIds,
        targetGroupTypes: [
          ...new Set(
            eventIds.flatMap(id => targetGroupTypesByEvent.get(id) ?? [])
          ),
        ],
      })),
    };
  },
  component: function Dashboard() {
    const { categories, events, conversations } = Route.useLoaderData();
    const [sortBy, setSortBy] = useState(sortOptions[0].value);
    const [keyword, setKeyword] = useState('');
    const [categorySelection, setCategorySelection] =
      useState<CategorySelection>();
    const [eventSelection, setEventSelection] = useState<EventSelection>();
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [filterTab, setFilterTab] = useState<FilterTab>('category');
    const [isConversationSidebarOpen, setIsConversationSidebarOpen] =
      useState(false);
    const [selectedConversationId, setSelectedConversationId] =
      useState<string>();

    const toggleFilterSidebar = (tab: FilterTab) => {
      setIsFilterSidebarOpen(isOpen => !(isOpen && filterTab === tab));
      setFilterTab(tab);
      setIsConversationSidebarOpen(false);
    };

    const toggleConversationSidebar = (id: string) => {
      setIsConversationSidebarOpen(
        isOpen => !(isOpen && selectedConversationId === id)
      );
      setSelectedConversationId(id);
      setIsFilterSidebarOpen(false);
    };

    const activeSortBy =
      !keyword && sortBy === relevanceSortOption.value
        ? sortOptions[0].value
        : sortBy;

    const { views } =
      sortOptions.find(({ value }) => value === activeSortBy) ?? sortOptions[0];

    const countViews = ({ comments }: (typeof conversations)[number]) =>
      comments.filter(({ view }) => views.includes(view)).length;

    const sortedConversations = conversations.toSorted(
      (a, b) => countViews(b) - countViews(a)
    );

    const searchedConversations = searchConversations(
      sortedConversations,
      keyword
    );

    const matchesCategory = ({ groups }: (typeof conversations)[number]) =>
      !categorySelection || matchesCategorySelection(groups, categorySelection);

    const matchesEvent = (conversation: (typeof conversations)[number]) =>
      !eventSelection || matchesEventSelection(conversation, eventSelection);

    const filteredConversations = searchedConversations
      .filter(
        conversation =>
          matchesCategory(conversation) && matchesEvent(conversation)
      )
      .toSorted((a, b) =>
        activeSortBy === relevanceSortOption.value
          ? (a.searchScore ?? 0) - (b.searchScore ?? 0)
          : 0
      );

    const selectedTargetGroupTypes =
      getSelectedTargetGroupTypes(eventSelection);

    return (
      <div className="flex flex-1 bg-blue-3">
        <div className="mx-auto flex w-[95vw] justify-center py-3 md:py-5">
          <FilterSidebar
            isOpen={isFilterSidebarOpen}
            tab={filterTab}
            onTabChange={setFilterTab}
            onClose={() => setIsFilterSidebarOpen(false)}
          >
            {filterTab === 'category' ? (
              <FilterCategory
                categories={categories}
                conversations={searchedConversations.filter(matchesEvent)}
                selection={categorySelection}
                onSelect={setCategorySelection}
              />
            ) : (
              <FilterEvent
                events={events}
                conversations={searchedConversations.filter(matchesCategory)}
                selection={eventSelection}
                onSelect={setEventSelection}
              />
            )}
          </FilterSidebar>
          <div className="flex max-w-[calc(3*500px+2*(--spacing(5)))] min-w-0 flex-1 flex-col">
            <FilterToolbar
              categories={categories}
              events={events}
              keyword={keyword}
              categorySelection={categorySelection}
              eventSelection={eventSelection}
              expandedTab={isFilterSidebarOpen ? filterTab : undefined}
              onSearch={query => {
                setKeyword(query);
                if (query) setSortBy(relevanceSortOption.value);
              }}
              onToggle={toggleFilterSidebar}
              onClear={() => {
                setKeyword('');
                setCategorySelection(undefined);
                setEventSelection(undefined);
              }}
            />

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
                        options={
                          keyword
                            ? [relevanceSortOption, ...sortOptions]
                            : sortOptions
                        }
                        value={activeSortBy}
                        onChange={event => setSortBy(event.target.value)}
                      />
                    </label>
                  </div>
                  <Legend />
                </div>
                <Masonry maxColumnWidth={500} className="mt-3 gap-3 md:gap-5">
                  {filteredConversations.map(({ id, ...conversation }) => (
                    <TopicCard
                      key={id}
                      keyword={keyword}
                      selectedCategory={categorySelection?.category}
                      selectedTargetGroupTypes={selectedTargetGroupTypes}
                      selected={
                        isConversationSidebarOpen &&
                        id === selectedConversationId
                      }
                      dimmed={
                        isConversationSidebarOpen &&
                        id !== selectedConversationId
                      }
                      onSelect={() => toggleConversationSidebar(id)}
                      {...conversation}
                    />
                  ))}
                </Masonry>
              </>
            )}
          </div>
          <ConversationSidebar
            isOpen={isConversationSidebarOpen}
            conversation={conversations.find(
              ({ id }) => id === selectedConversationId
            )}
            events={events}
            onClose={() => setIsConversationSidebarOpen(false)}
          />
        </div>
        <BackToTopButton />
      </div>
    );
  },
});
