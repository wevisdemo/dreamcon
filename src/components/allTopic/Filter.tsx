import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import SearchIcon from '@material-symbols/svg-700/rounded/search.svg?react';
import { useDraggable } from 'react-use-draggable-scroll';
import { StoreContext } from '../../store';
import { DreamConEvent } from '../../types/event';
import {
  TopicFilter,
  topicFilterCategories,
  TopicFilterCategory,
} from '../../types/home';
import { LightWeightTopic } from '../../types/topic';
import DefaultFilterEvent from './DefaultFilterEvent';
import FilterEvent from './FilterEvent';

interface PropTypes {
  allTopicCount: number;
  lightWeightTopics: LightWeightTopic[];
  events: DreamConEvent[];
  filter: TopicFilter;
  setFilter: (filter: TopicFilter) => void;
}

export default function Filter(props: PropTypes) {
  const { user: userContext } = useContext(StoreContext);
  const [searchText, setSearchText] = useState<string>('');
  const [debouncedValue, setDebouncedValue] = useState(searchText);
  const eventFilterRef = useRef<HTMLDivElement>(null!);
  const { events: eventFilterEvents } = useDraggable(eventFilterRef);
  const categoryRef = useRef<HTMLDivElement>(null!);
  const { events: categoryEvents } = useDraggable(categoryRef);
  const [showEventGradient, setShowEventGradient] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: true });
  const [showCategoryGradient, setShowCategoryGradient] = useState<{
    left: boolean;
    right: boolean;
  }>({ left: false, right: true });

  const handleEventChange = (event: DreamConEvent | null) => {
    props.setFilter({
      ...props.filter,
      selectedEvent: event,
    });
  };

  const handleSortChange = (sort: 'latest' | 'most-commented') => {
    props.setFilter({
      ...props.filter,
      sortedBy: sort,
    });
  };

  const handleCategoryChange = (category: TopicFilterCategory) => {
    props.setFilter({
      ...props.filter,
      category: category,
    });
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(searchText);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchText]);

  useEffect(() => {
    props.setFilter({
      ...props.filter,
      searchText: debouncedValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- push up only when the debounced text settles; depending on props.filter would loop, as setFilter replaces it
  }, [debouncedValue]);

  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
  };

  const getEventHighlightedTopic = (event: DreamConEvent) => {
    const filteredTopics = props.lightWeightTopics.filter(
      topic =>
        topic.event_ids.includes(event.id) && topic.comment_level1_count >= 10
    );
    if (filteredTopics.length > 0) {
      return filteredTopics[0].title;
    }
    return undefined;
  };

  const isEventOwner = (targetEvent: DreamConEvent) => {
    if (userContext.userState?.role === 'writer') {
      return userContext.userState.event.id === targetEvent.id;
    }
    return false;
  };

  const filteredEvents = useMemo<DreamConEvent[]>(
    () =>
      props.events
        .filter(event => props.filter.selectedEvent?.id !== event.id)
        .sort((a, z) => z.date.localeCompare(a.date)),
    [props.events, props.filter.selectedEvent]
  );

  // TODO: this is for temp fix, should be controller by fetch event
  const getFreshFilteredEventData = (): DreamConEvent | null => {
    const topicCount = props.lightWeightTopics.filter(topic =>
      topic.event_ids.includes(props.filter.selectedEvent?.id ?? '')
    ).length;

    if (props.filter.selectedEvent !== null) {
      return {
        ...props.filter.selectedEvent,
        topic_counts: topicCount,
      };
    }
    return null;
  };

  useEffect(() => {
    const handleScroll = () => {
      const maxWidth = eventFilterRef.current?.scrollWidth;
      const containerWidth = eventFilterRef.current?.clientWidth;
      const scrollLeft = eventFilterRef.current?.scrollLeft;
      if (maxWidth - containerWidth - scrollLeft > 10) {
        setShowEventGradient(curr => ({ ...curr, right: true }));
      } else {
        setShowEventGradient(curr => ({ ...curr, right: false }));
      }

      if (scrollLeft > 10) {
        setShowEventGradient(curr => ({ ...curr, left: true }));
      } else {
        setShowEventGradient(curr => ({ ...curr, left: false }));
      }
    };

    const currentRef = eventFilterRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [eventFilterRef]);

  useEffect(() => {
    const handleScroll = () => {
      const maxWidth = categoryRef.current?.scrollWidth;
      const containerWidth = categoryRef.current?.clientWidth;
      const scrollLeft = categoryRef.current?.scrollLeft;
      if (maxWidth - containerWidth - scrollLeft > 10) {
        setShowCategoryGradient(curr => ({ ...curr, right: true }));
      } else {
        setShowCategoryGradient(curr => ({ ...curr, right: false }));
      }

      if (scrollLeft > 10) {
        setShowCategoryGradient(curr => ({ ...curr, left: true }));
      } else {
        setShowCategoryGradient(curr => ({ ...curr, left: false }));
      }
    };

    const currentRef = categoryRef.current;
    if (currentRef) {
      currentRef.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [categoryRef]);

  return (
    <div className="flex w-full flex-col gap-4 rounded-2xl bg-white py-4">
      <div className="flex w-full items-center gap-4.5 pl-6">
        <div className="relative">
          {props.filter.selectedEvent === null ? (
            <DefaultFilterEvent
              count={props.allTopicCount}
              onClick={() => handleEventChange(null)}
              isSelected
            />
          ) : (
            <FilterEvent
              event={getFreshFilteredEventData()!}
              onClick={handleEventChange}
              isSelected
              isOwner={isEventOwner(props.filter.selectedEvent)}
            />
          )}
          <p className="wv-bold wv-ibmplex absolute -top-6 -left-1/2 shrink-0 rounded-l-full rounded-tr-full bg-blue-6 px-4 py-2 text-b2 whitespace-nowrap text-white">
            สำรวจข้อถกเถียง
          </p>
        </div>
        <div className="h-3 w-3 shrink-0 rounded-full bg-blue-2" />
        <div className="w-full] relative overflow-hidden">
          <div
            className={`pointer-events-none absolute top-0 right-0 z-20 h-full w-11.5 bg-gradient-to-l from-white to-transparent ${
              showEventGradient.right ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
          <div
            className={`pointer-events-none absolute top-0 left-0 z-20 h-full w-11.5 bg-gradient-to-r from-white to-transparent ${
              showEventGradient.left ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
          <div
            className="no-scrollbar relative flex w-full gap-4 overflow-scroll"
            {...eventFilterEvents}
            ref={eventFilterRef}
          >
            {props.filter.selectedEvent !== null && (
              <DefaultFilterEvent
                count={props.allTopicCount}
                onClick={() => handleEventChange(null)}
              />
            )}
            {filteredEvents.map(event => (
              <FilterEvent
                isOwner={isEventOwner(event)}
                event={event}
                onClick={handleEventChange}
                key={`filter-event-${event.display_name}`}
                highlightedTopic={getEventHighlightedTopic(event)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-full items-center justify-between gap-3 px-6">
        <div className="flex w-full shrink-2 items-center gap-1">
          <span className="text-nowrap text-blue-7">เรียงลำดับ:</span>
          <div className="flex w-32.5 text-b3">
            <button
              className={`w-full rounded-l-full border border-solid py-1.5 ${
                props.filter.sortedBy === 'most-commented'
                  ? 'border-blue-7 bg-blue-6 text-white'
                  : 'border-blue-3 text-blue-3'
              }`}
              onClick={() => handleSortChange('most-commented')}
            >
              มากที่สุด
            </button>
            <button
              className={`w-full rounded-r-full border border-solid py-1.5 ${
                props.filter.sortedBy === 'latest'
                  ? 'border-blue-7 bg-blue-6 text-white'
                  : 'border-blue-3 text-blue-3'
              }`}
              onClick={() => handleSortChange('latest')}
            >
              ล่าสุด
            </button>
          </div>
        </div>

        <div className="flex w-full items-center gap-1 overflow-x-scroll">
          <span className="text-nowrap text-blue-7">หัวข้อ:</span>
          <div className="w-full] relative overflow-hidden">
            <div
              className={`pointer-events-none absolute top-0 right-0 z-20 h-full w-11.5 bg-gradient-to-l from-white to-transparent ${
                showCategoryGradient.right ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            />
            <div
              className={`pointer-events-none absolute top-0 left-0 z-20 h-full w-11.5 bg-gradient-to-r from-white to-transparent ${
                showCategoryGradient.left ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            />
            <div
              className="no-scrollbar flex gap-2 overflow-scroll text-b3"
              {...categoryEvents}
              ref={categoryRef}
            >
              {topicFilterCategories.map(category => (
                <button
                  key={category}
                  className={`rounded-full border-[1.5px] border-solid px-3 py-1.5 whitespace-nowrap ${
                    props.filter.category === category
                      ? 'bg-blue-6 text-white'
                      : 'border-blue-3 text-blue-3'
                  }`}
                  onClick={() => handleCategoryChange(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="relative w-37.5">
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-37.5 rounded-full border border-blue-3 bg-white px-2 py-1.5 outline-none"
            value={searchText}
            onChange={e => {
              handleSearchTextChange(e.target.value);
            }}
          />
          <SearchIcon
            className="absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 transform text-blue-5"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
