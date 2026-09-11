import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { DreamConEvent } from '../../types/event';
import {
  TopicFilter,
  topicFilterCategories,
  TopicFilterCategory,
} from '../../types/home';
import DefaultFilterEvent from './DefaultFilterEvent';
import FilterEvent from './FilterEvent';
import { StoreContext } from '../../store';
import { LightWeightTopic } from '../../types/topic';
import { useDraggable } from 'react-use-draggable-scroll';
import SearchIcon from '@material-symbols/svg-700/rounded/search.svg?react';

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
    <div className="bg-white w-full rounded-2xl py-4 flex flex-col gap-4">
      <div className="flex items-center gap-4.5 w-full pl-6">
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
          <p className="absolute whitespace-nowrap text-b2 text-white wv-bold wv-ibmplex px-4 py-2 -top-6 -left-1/2 bg-blue-6 rounded-l-full rounded-tr-full shrink-0">
            สำรวจข้อถกเถียง
          </p>
        </div>
        <div className="w-3 h-3 bg-blue-2 rounded-full shrink-0" />
        <div className="relative overflow-hidden w-full]">
          <div
            className={`z-20 absolute top-0 right-0 h-full w-11.5 bg-gradient-to-l from-white to-transparent pointer-events-none ${
              showEventGradient.right ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
          <div
            className={`z-20 absolute top-0 left-0 h-full w-11.5 bg-gradient-to-r from-white to-transparent pointer-events-none ${
              showEventGradient.left ? 'opacity-100' : 'opacity-0'
            } transition-opacity duration-300`}
          />
          <div
            className="flex gap-4 w-full overflow-scroll no-scrollbar relative"
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
      <div className="flex gap-3 items-center justify-between w-full px-6">
        <div className="flex gap-1 items-center w-full shrink-2">
          <span className="text-blue-7 text-nowrap">เรียงลำดับ:</span>
          <div className="flex w-32.5 text-b3">
            <button
              className={`w-full py-1.5 rounded-l-full border border-solid ${
                props.filter.sortedBy === 'most-commented'
                  ? 'bg-blue-6 text-white border-blue-7'
                  : 'text-blue-3 border-blue-3'
              }`}
              onClick={() => handleSortChange('most-commented')}
            >
              มากที่สุด
            </button>
            <button
              className={`w-full py-1.5 rounded-r-full border border-solid ${
                props.filter.sortedBy === 'latest'
                  ? 'bg-blue-6 text-white border-blue-7'
                  : 'text-blue-3 border-blue-3'
              }`}
              onClick={() => handleSortChange('latest')}
            >
              ล่าสุด
            </button>
          </div>
        </div>

        <div className="flex gap-1 items-center w-full overflow-x-scroll">
          <span className="text-blue-7 text-nowrap">หัวข้อ:</span>
          <div className="relative overflow-hidden w-full]">
            <div
              className={`z-20 absolute top-0 right-0 h-full w-11.5 bg-gradient-to-l from-white to-transparent pointer-events-none ${
                showCategoryGradient.right ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            />
            <div
              className={`z-20 absolute top-0 left-0 h-full w-11.5 bg-gradient-to-r from-white to-transparent pointer-events-none ${
                showCategoryGradient.left ? 'opacity-100' : 'opacity-0'
              } transition-opacity duration-300`}
            />
            <div
              className="flex overflow-scroll text-b3 gap-2 no-scrollbar"
              {...categoryEvents}
              ref={categoryRef}
            >
              {topicFilterCategories.map(category => (
                <button
                  key={category}
                  className={`whitespace-nowrap px-3 py-1.5 border-solid border-[1.5px] rounded-full ${
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
            className="bg-white w-37.5 border border-blue-3 outline-none px-2 py-1.5 rounded-full"
            value={searchText}
            onChange={e => {
              handleSearchTextChange(e.target.value);
            }}
          />
          <SearchIcon
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-blue-5"
            aria-hidden
          />
        </div>
      </div>
    </div>
  );
}
