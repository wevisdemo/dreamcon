import { useCallback, useMemo, useState } from 'react';
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
import { PhraseSortingHint } from '../components/dashboard/phrase-sorting-hint';
import { TopicCard } from '../components/dashboard/topic-card';
import { Dropdown } from '../components/dropdown';
import {
  phraseSortOption,
  relevanceSortOption,
  sortOptions,
} from '../constants/sort-options';
import {
  getConversations,
  getEvents,
  getGroupQuestions,
} from '../data/server-functions';
import { useScrollIntoView } from '../hooks/use-scroll-into-view';
import {
  matchesCategorySelection,
  type CategorySelection,
  getDistanceToPhrase,
  getSelectedTargetGroupTypes,
  isCategorySelection,
  isEventSelection,
  matchesEventSelection,
  type EventSelection,
  searchConversations,
} from '../utils/filter';

type DashboardSearch = {
  keyword?: string;
  category?: CategorySelection;
  event?: EventSelection;
};

export const Route = createFileRoute('/dashboard')({
  validateSearch: ({
    keyword,
    category,
    event,
  }: Record<string, unknown>): DashboardSearch => ({
    keyword: typeof keyword === 'string' && keyword ? keyword : undefined,
    category: isCategorySelection(category) ? category : undefined,
    event: isEventSelection(event) ? event : undefined,
  }),
  staleTime: Infinity,
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
    const {
      keyword = '',
      category: categorySelection,
      event: eventSelection,
    } = Route.useSearch();
    const navigate = Route.useNavigate();
    const [sortBy, setSortBy] = useState(sortOptions[0].value);
    const [searchResetKey, setSearchResetKey] = useState(0);
    const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
    const [filterTab, setFilterTab] = useState<FilterTab>('category');
    const [conversationSidebar, setConversationSidebar] = useState<{
      isOpen: boolean;
      id?: string;
    }>({ isOpen: false });
    const { isOpen: isConversationSidebarOpen, id: selectedConversationId } =
      conversationSidebar;
    const selectedCardId = isConversationSidebarOpen
      ? selectedConversationId
      : undefined;
    const selectedCardRef = useScrollIntoView(selectedCardId);

    const updateFilters = (filters: DashboardSearch) =>
      navigate({
        search: prev => ({ ...prev, ...filters }),
        replace: true,
        resetScroll: false,
      });

    const setEventSelection = (event?: EventSelection) =>
      updateFilters({ event });

    const resetFilters = (filters: DashboardSearch = {}) =>
      updateFilters({
        keyword: undefined,
        category: undefined,
        event: undefined,
        ...filters,
      }).then(() => setSearchResetKey(key => key + 1));

    const closeConversationSidebar = () =>
      setConversationSidebar(sidebar => ({ ...sidebar, isOpen: false }));

    const toggleFilterSidebar = (tab: FilterTab) => {
      setIsFilterSidebarOpen(isOpen => !(isOpen && filterTab === tab));
      setFilterTab(tab);
      closeConversationSidebar();
    };

    const toggleConversationSidebar = useCallback((id: string) => {
      setConversationSidebar(sidebar => ({
        isOpen: !(sidebar.isOpen && sidebar.id === id),
        id,
      }));
      setIsFilterSidebarOpen(false);
    }, []);

    const selectCategory = (selection?: CategorySelection) => {
      updateFilters({ category: selection });
      if (selection?.groupId !== undefined && !keyword) {
        setSortBy(phraseSortOption.value);
      }
    };

    const isGroupSelected = categorySelection?.groupId !== undefined;

    const availableSortOptions = [
      ...(keyword ? [relevanceSortOption] : []),
      ...(isGroupSelected ? [phraseSortOption] : []),
      ...sortOptions,
    ];

    const activeSortBy = availableSortOptions.some(
      ({ value }) => value === sortBy
    )
      ? sortBy
      : availableSortOptions[0].value;

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
      .toSorted((a, b) => {
        if (activeSortBy === relevanceSortOption.value) {
          return (a.searchScore ?? 0) - (b.searchScore ?? 0);
        }
        if (activeSortBy === phraseSortOption.value && categorySelection) {
          return (
            getDistanceToPhrase(a.groups, categorySelection) -
            getDistanceToPhrase(b.groups, categorySelection)
          );
        }
        return 0;
      });

    const selectedTargetGroupTypes = useMemo(
      () => getSelectedTargetGroupTypes(eventSelection),
      [eventSelection]
    );

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
                onSelect={selectCategory}
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
              searchResetKey={searchResetKey}
              categorySelection={categorySelection}
              eventSelection={eventSelection}
              expandedTab={isFilterSidebarOpen ? filterTab : undefined}
              onSearch={query => {
                updateFilters({ keyword: query || undefined });
                if (query) setSortBy(relevanceSortOption.value);
              }}
              onToggle={toggleFilterSidebar}
              onClear={() => resetFilters()}
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
                    <div className="flex items-center gap-1.25">
                      <label className="flex items-center gap-2 text-gray-6">
                        เรียงตาม
                        <Dropdown
                          options={availableSortOptions}
                          value={activeSortBy}
                          onChange={event => setSortBy(event.target.value)}
                        />
                      </label>
                      {activeSortBy === phraseSortOption.value && (
                        <PhraseSortingHint />
                      )}
                    </div>
                  </div>
                  <Legend />
                </div>
                <Masonry
                  maxColumnWidth={500}
                  className={`group/cards mt-3 gap-3 md:gap-5 ${isConversationSidebarOpen ? 'dimmed' : ''}`}
                >
                  {filteredConversations.map(conversation => (
                    <TopicCard
                      key={conversation.id}
                      keyword={keyword}
                      selectedCategory={categorySelection?.category}
                      selectedTargetGroupTypes={selectedTargetGroupTypes}
                      selected={conversation.id === selectedCardId}
                      ref={
                        conversation.id === selectedCardId
                          ? selectedCardRef
                          : undefined
                      }
                      className="scroll-my-3 md:scroll-mt-44 md:scroll-mb-7.5"
                      onSelect={toggleConversationSidebar}
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
            conversations={conversations}
            onClose={closeConversationSidebar}
            onEventFilter={eventId => resetFilters({ event: { eventId } })}
          />
        </div>
        <BackToTopButton />
      </div>
    );
  },
});
