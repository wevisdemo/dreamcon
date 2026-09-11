import { useContext, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import TopicListSection from '../components/allTopic/TopicListSection';
import FullPageLoader from '../components/FullPageLoader';
import ExpandWideIcon from '../components/icon/ExpandWideIcon';
import KeyboardDoubleArrowRightIcon from '@material-symbols/svg-700/rounded/keyboard_double_arrow_right.svg?react';
import ModalComment from '../components/share/ModalComment';
import ModalTopic from '../components/share/ModalTopic';
import CommentDndContext from '../components/topic/CommentDndContext';
import ShareTopicLink from '../components/topic/ShareTopicLink';
import TopicTemplate from '../components/topic/TopicTemplate';
import { useAddTopic } from '../hooks/useAddTopic';
import { usePageSession } from '../hooks/usePageSession';
import { usePermission } from '../hooks/usePermission';
import { useTopic } from '../hooks/useTopic';
import ViewerLayout from '../layouts/viewer';
import { StoreContext } from '../store';
import { DreamConEvent } from '../types/event';
import { TopicFilter } from '../types/home';
import { ModalTopicPayload, Topic } from '../types/topic';
import { db } from '../utils/firestore';
import { selectTopicIds } from '../utils/topicFilter';

const PAGE_SIZE = 12;

export default function AllTopic() {
  const {
    homePage: homePageContext,
    event: eventContext,
    selectedTopic,
    pin: pinContext,
  } = useContext(StoreContext);
  const location = useLocation();
  const { eventsReady } = usePageSession('all-topic');
  const { getWriterEvent } = usePermission();
  const { addNewTopic, loading: addNewTopicLoading } = useAddTopic();
  const { getLightWeightTopics, getTopicByIds } = useTopic();
  const [lightWeightTopicsLoaded, setLightWeightTopicsLoaded] = useState(false);
  const [displayTopics, setDisplayTopics] = useState<Topic[] | null>(null);
  const [itemLimit, setItemLimit] = useState(PAGE_SIZE);
  const [topicFilter, setTopicFilter] = useState<TopicFilter>({
    selectedEvent: null,
    sortedBy: 'latest',
    category: 'ทั้งหมด',
    searchText: '',
  });
  const observerRef = useRef<HTMLElement | null>(null);
  const lightWeightTopics = homePageContext.lightWeightTopics.state;

  useEffect(() => {
    if (!eventsReady) return;
    const eventId = new URLSearchParams(location.search).get('event');
    const event = eventContext.events.find(event => event.id === eventId);
    if (event) setTopicFilter(filter => ({ ...filter, selectedEvent: event }));
    // eslint-disable-next-line react-hooks/exhaustive-deps -- apply the ?event= filter once, when the events arrive
  }, [eventsReady]);

  useEffect(() => {
    return onSnapshot(collection(db, 'topics'), async () => {
      homePageContext.lightWeightTopics.setState(await getLightWeightTopics());
      setLightWeightTopicsLoaded(true);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- subscribe once on mount; the cleanup unsubscribes
  }, []);

  useEffect(() => {
    if (!lightWeightTopicsLoaded) return;
    let cancelled = false;
    getTopicByIds(
      selectTopicIds(
        lightWeightTopics,
        topicFilter,
        itemLimit,
        pinContext.pinnedTopics
      )
    ).then(topics => {
      if (!cancelled) setDisplayTopics(topics);
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- getTopicByIds is redefined every render
  }, [
    lightWeightTopicsLoaded,
    lightWeightTopics,
    topicFilter,
    itemLimit,
    pinContext.pinnedTopics,
  ]);

  useEffect(() => {
    if (!displayTopics || !selectedTopic.value) return;
    const selectedId = selectedTopic.value.id;
    selectedTopic.setValue(
      displayTopics.find(topic => topic.id === selectedId) ?? null
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refresh the side panel only when the list changes
  }, [displayTopics]);

  useEffect(() => {
    const observer = observerRef.current;
    observer?.addEventListener('scroll', loadMoreAtScrollEnd);
    return () => observer?.removeEventListener('scroll', loadMoreAtScrollEnd);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- re-attach only when the rendered list changes; the handler is redefined every render
  }, [displayTopics]);

  const loadMoreAtScrollEnd = () => {
    if (!observerRef.current || !displayTopics) return;
    if (displayTopics.length < itemLimit) return;
    const { scrollTop, clientHeight, scrollHeight } = observerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      setItemLimit(itemLimit + PAGE_SIZE);
    }
  };

  const openTopicPage = () => {
    if (!selectedTopic.value) return;
    const params = new URLSearchParams(location.search);
    window.location.href = `${window.location.origin}/topics/${
      selectedTopic.value.id
    }?${params.toString()}`;
  };

  // The topic modal is only opened in create mode; topics are edited in place.
  const handleCreateTopic = async (
    _mode: 'create' | 'edit',
    payload: ModalTopicPayload
  ) => {
    const writerEvent = getWriterEvent();
    if (!writerEvent) return;
    await addNewTopic({ ...payload, event_ids: [writerEvent.id] });
  };

  // Snapshot refreshes and filter changes update the list in place without blocking the page.
  const isPageLoading =
    displayTopics === null || !eventsReady || addNewTopicLoading;

  return (
    <ViewerLayout>
      <CommentDndContext>
        {isPageLoading && <FullPageLoader />}
        <div className="min-w-screen flex h-full">
          <section
            className={`bg-blue-2 ${
              selectedTopic.value ? 'w-3/5' : 'w-full'
            } h-full flex flex-col items-center duration-300 ease-in relative`}
          >
            <section className="absolute w-full h-content z-30 bg-transparent">
              <ModalComment
                store={homePageContext.modalCommentMainSection}
                events={eventContext.events}
              />
              <ModalTopic
                mode={homePageContext.modalTopicMainSection.state.mode}
                defaultState={
                  homePageContext.modalTopicMainSection.state.defaultState
                }
                isOpen={homePageContext.modalTopicMainSection.state.isModalOpen}
                onClose={() => {
                  homePageContext.modalTopicMainSection.dispatch({
                    type: 'CLOSE_MODAL',
                  });
                }}
                createdByEvent={getWriterEvent() as DreamConEvent}
                onSubmit={handleCreateTopic}
              />
            </section>
            <section
              ref={observerRef}
              className="p-15 w-full h-full flex justify-center overflow-scroll relative"
            >
              <TopicListSection
                topics={displayTopics ?? []}
                lightWeightTopics={lightWeightTopics}
                selectedTopic={selectedTopic.value}
                setSelectedTopic={selectedTopic.setValue}
                events={eventContext.events}
                topicFilter={topicFilter}
                setTopicFilter={setTopicFilter}
              />
            </section>
          </section>
          <section
            className={`${
              selectedTopic.value ? 'w-2/5' : 'w-0'
            } overflow-hidden h-full flex flex-col items-center duration-300 ease-in relative`}
          >
            <section className="absolute w-full h-content z-30 bg-transparent">
              <ModalComment
                store={homePageContext.modalCommentSideSection}
                events={eventContext.events}
              />
            </section>
            <section className="w-full h-full">
              <div className="w-full px-2.5 py-1 bg-gray-2 flex justify-between items-center">
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => selectedTopic.setValue(null)}
                    aria-label="ปิดแผงด้านข้าง"
                  >
                    <KeyboardDoubleArrowRightIcon
                      className="w-6 h-6 text-gray-5"
                      aria-hidden
                    />
                  </button>
                  <button
                    onClick={openTopicPage}
                    aria-label="เปิดหน้าข้อถกเถียง"
                  >
                    <ExpandWideIcon
                      className="w-6 h-6 text-gray-5"
                      aria-hidden
                    />
                  </button>
                </div>
                {selectedTopic.value && (
                  <ShareTopicLink topicId={selectedTopic.value.id} />
                )}
              </div>
              <div className="p-6 bg-blue-4 w-full h-full overflow-scroll">
                {selectedTopic.value ? (
                  <TopicTemplate
                    topic={selectedTopic.value}
                    onDeleted={() => selectedTopic.setValue(null)}
                  />
                ) : (
                  <div className=" w-full h-full" />
                )}
              </div>
            </section>
          </section>
        </div>
      </CommentDndContext>
    </ViewerLayout>
  );
}
