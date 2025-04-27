import { useCallback, useContext, useEffect, useRef, useState } from "react";
import TopicListSection from "../components/allTopic/TopicListSection";
import TopicTemplate from "../components/topic/TopicTemplate";
import ModalComment from "../components/share/ModalComment";
import { StoreContext } from "../store";
import ModalTopic from "../components/share/ModalTopic";
import { SmartPointerSensor } from "../utils/SmartSenson";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  DraggableCommentProps,
  DroppableData,
  DroppableDataComment,
  DroppableDataTopic,
  MoveCommentEvent,
} from "../types/dragAndDrop";
import CommentAndChildren from "../components/topic/CommentAndChildren";
import {
  LightWeightTopic,
  ModalTopicPayload,
  Topic,
  TopicCategory,
} from "../types/topic";
import {
  collection,
  query,
  onSnapshot,
  Unsubscribe,
  // limit,
  // orderBy,
} from "firebase/firestore";
import { db } from "../utils/firestore";
import { AddOrEditCommentPayload, Comment } from "../types/comment";
import { useAddTopic } from "../hooks/useAddTopic";
import { useEditTopic } from "../hooks/useEditTopic";
import { useAddComment } from "../hooks/useAddComment";
import { useEditComment } from "../hooks/useEditComment";
import { useDeleteTopicWithChildren } from "../hooks/useDeleteTopicWithChildren";
import { useMoveComment } from "../hooks/useMoveComment";
import { useConvertCommentToTopic } from "../hooks/useConvertCommentToTopic";
import FullPageLoader from "../components/FullPageLoader";
import AlertPopup from "../components/AlertMoveComment";
import { useHotkeys } from "react-hotkeys-hook";
import { useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { DreamConEvent } from "../types/event";
import { useEvent } from "../hooks/useEvent";
import { TopicFilter } from "../types/home";
import ChainIcon from "../components/icon/ChainIcon";
import { useTopic } from "../hooks/useTopic";
import ViewerLayout from "../layouts/viewer";
import { usePermission } from "../hooks/usePermission";

export default function AllTopic() {
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [itemLimit, setItemLimit] = useState(12);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const [displayTopics, setDisplayTopics] = useState<Topic[]>([]);
  const [previousMoveCommentEvent, setPreviousMoveCommentEvent] =
    useState<MoveCommentEvent | null>(null);
  const observerRef = useRef<HTMLElement | null>(null);
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const {
    homePage: homePageContext,
    currentPage,
    clipboard: clipboardContext,
    user: userContext,
    event: eventContext,
    selectedTopic,
    pin: pinContext,
    mode: modeContext,
  } = useContext(StoreContext);
  const { addNewTopic, loading: addNewTopicLoading } = useAddTopic();
  const { editTopic, loading: editTopicLoading } = useEditTopic();
  const { addNewComment, loading: addNewCommentLoading } = useAddComment();
  const { editComment, loading: editCommentLoading } = useEditComment();
  const { deleteTopicWithChildren, loading: deleteTopicLoading } =
    useDeleteTopicWithChildren();
  const {
    moveCommentToComment,
    moveCommentToTopic,
    undoMoveCommentToComment,
    undoMoveCommentToTopic,
    loading: moveCommentLoading,
  } = useMoveComment();
  const {
    convertCommentToTopic,
    undoConvertCommentToTopic,
    loading: convertCommentLoading,
  } = useConvertCommentToTopic();
  const { getEvents, loading: eventLoading } = useEvent();
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const { loginFromToken, setUserStoreFromToken } = useAuth();
  const location = useLocation();
  const [events, setEvents] = useState<DreamConEvent[]>([]);
  const [topicFilter, setTopicFilter] = useState<TopicFilter>({
    selectedEvent: null,
    sortedBy: "latest",
    category: "ทั้งหมด",
    searchText: "",
  });
  const { getLightWeightTopics, getTopicByIds } = useTopic();
  const [topicLink, setTopicLink] = useState<string>("");
  const [readyToFetchParams, setReadyToFetchParams] = useState(false);
  const { isReadOnly } = usePermission();

  useEffect(() => {
    if (readyToFetchParams) {
      doToken();
    }
  }, [readyToFetchParams]);

  useEffect(() => {
    manageMode();
  }, [userContext.userState]);

  const fetchLightWeightTopics = async () => {
    const topics = await getLightWeightTopics();
    homePageContext.lightWeightTopics.setState(topics);
    return topics;
  };

  const doToken = async () => {
    const params = new URLSearchParams(location.search);
    const writerToken = params.get("writer");

    if (writerToken) {
      await loginFromToken(writerToken);
      params.delete("writer");
      window.location.href = `${location.pathname}?${params.toString()}`;
      return;
    }

    setUserStoreFromToken();
    manageMode();
    manageEvent();
  };

  const manageEvent = () => {
    const params = new URLSearchParams(location.search);
    const eventID = params.get("event");
    if (eventID) {
      const event = events.find((event) => event.id === eventID);
      if (event) {
        setTopicFilter({ ...topicFilter, selectedEvent: event });
      }
    }
  };

  const manageMode = () => {
    const params = new URLSearchParams(location.search);
    const mode = params.get("mode");
    switch (mode) {
      case "view":
        modeContext.setValue("view");
        break;
      default: {
        if (userContext.userState?.role === "writer") {
          modeContext.setValue("write");
        }
      }
    }

    return;
  };

  const fetchTopic2 = async (
    lightWeightTopics: LightWeightTopic[],
    itemLimit: number,
    topicFilter: TopicFilter,
    pinnedIDs: string[]
  ) => {
    const query = getQueryTopicIds(
      lightWeightTopics,
      topicFilter,
      itemLimit,
      pinnedIDs
    );
    if (query.length === 0) {
      setDisplayTopics([]);
      return [];
    }
    const topics = await getTopicByIds(query);
    setDisplayTopics(topics);
    // setFirstTimeLoading(false);
    return topics;
  };

  const refreshTopicsWithLoading = async (
    lightWeightTopics: LightWeightTopic[],
    itemLimit: number,
    topicFilter: TopicFilter,
    pinnedIDs: string[]
  ) => {
    setFirstTimeLoading(true);
    await fetchTopic2(lightWeightTopics, itemLimit, topicFilter, pinnedIDs);
    setFirstTimeLoading(false);
  };

  const fetchTopicAfterSubscribe = useCallback(async () => {
    const lightWeightTopics = await fetchLightWeightTopics();
    fetchTopic2(
      lightWeightTopics,
      itemLimit,
      topicFilter,
      pinContext.pinnedTopics
    );
  }, [itemLimit, topicFilter, pinContext.pinnedTopics]);

  const latestFunctionRef = useRef(fetchTopicAfterSubscribe);

  useEffect(() => {
    latestFunctionRef.current = fetchTopicAfterSubscribe;
  }, [fetchTopicAfterSubscribe]);

  useEffect(() => {
    refreshTopicsWithLoading(
      homePageContext.lightWeightTopics.state,
      itemLimit,
      topicFilter,
      pinContext.pinnedTopics
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemLimit, topicFilter, pinContext.pinnedTopics]);

  useEffect(() => {
    fetchFirstTime();
    const unsubscribeTopic = subscribeTopics();
    const unsubscribeEvent = subscribeEvents();
    return () => {
      unsubscribeTopic();
      unsubscribeEvent();
    };
  }, []);

  const fetchFirstTime = async () => {
    currentPage.setValue("all-topic");
    await fetchEvents();
    const topicLW = await fetchLightWeightTopics();
    let pinnedTopics: string[] = [];
    if (!isReadOnly) {
      pinnedTopics = pinContext.getPinnedTopics();
    }
    await fetchTopic2(topicLW, itemLimit, topicFilter, pinnedTopics);
    setFirstTimeLoading(false);
  };

  useEffect(() => {
    observerRef.current?.addEventListener("scroll", handleScroll);

    return () => {
      observerRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, [displayTopics]);

  useEffect(() => {
    clipboardContext.subscribeMoveComment(subscribeClipboardEvent);
  }, [clipboardContext.subscribeMoveComment]);

  useEffect(() => {
    clipboardContext.subscribeCopyComment(subscribeCopyComment);
  }, [clipboardContext.subscribeCopyComment]);

  useEffect(() => {
    refreshSelectedTopicFromDisplayTopic(displayTopics);
  }, [displayTopics]);

  useHotkeys("Meta+z, ctrl+z", () => {
    handleUndoMoveComment();
  });

  const handleUndoMoveComment = async () => {
    if (!previousMoveCommentEvent) return;
    const { comment, droppableData } = previousMoveCommentEvent;
    switch (droppableData.type) {
      case "convert-to-topic": {
        if (!previousMoveCommentEvent.initialTopic) return;
        const topic = previousMoveCommentEvent.initialTopic;
        await undoConvertCommentToTopic(comment, topic);
        break;
      }
      case "topic": {
        await undoMoveCommentToTopic(comment, droppableData.topic);
        break;
      }
      case "comment": {
        await undoMoveCommentToComment(comment);
        break;
      }
    }
    setPreviousMoveCommentEvent(null);
    setShowPasteAlert(false);
  };

  const handleScroll = () => {
    if (!observerRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = observerRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      fetchMoreTopics(); // Load more topics when scrolled to bottom
    }
  };

  const subscribeCopyComment = () => {
    setShowPasteAlert(false);
    setShowCopyAlert(true);
    setPreviousMoveCommentEvent(null);
  };

  const isPageLoading = () => {
    return (
      firstTimeLoading ||
      addNewTopicLoading ||
      editTopicLoading ||
      addNewCommentLoading ||
      editCommentLoading ||
      deleteTopicLoading ||
      moveCommentLoading ||
      convertCommentLoading ||
      eventLoading
    );
  };

  const fetchEvents = async () => {
    const events = await getEvents();
    events.sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    setEvents(events);
    eventContext.setEvents(events);

    setReadyToFetchParams(true);
  };

  const getQueryTopicIds = (
    lightWeightTopics: LightWeightTopic[],
    topicFilter: TopicFilter,
    limit: number,
    pinList: string[]
  ) => {
    const filteredTopic = lightWeightTopics.filter((topic) => {
      // regex to check if topic.title contains the search text
      const regex = new RegExp(topicFilter.searchText, "i");
      // sorted by filter
      const isFilteredByEvent =
        topicFilter.selectedEvent === null ||
        topic.event_id === topicFilter.selectedEvent.id;
      const isFilteredByCategory =
        topicFilter.category === "ทั้งหมด" ||
        topic.category === topicFilter.category;
      return (
        regex.test(topic.title) && isFilteredByEvent && isFilteredByCategory
      );
    });
    // sort by latest or most-commented
    filteredTopic
      .sort((a, b) => {
        if (topicFilter.sortedBy === "latest") {
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        } else if (topicFilter.sortedBy === "most-commented") {
          return b.comment_level1_count - a.comment_level1_count;
        }
        return 0;
      })
      // sort pinned topics to the top
      .sort((a, b) => {
        const aPinnedIndex = pinList.indexOf(a.id);
        const bPinnedIndex = pinList.indexOf(b.id);
        if (aPinnedIndex !== -1 && bPinnedIndex === -1) {
          return -1;
        } else if (aPinnedIndex === -1 && bPinnedIndex !== -1) {
          return 1;
        } else {
          return 0;
        }
      });
    const topicIds = filteredTopic.map((topic) => topic.id);
    return topicIds.slice(0, limit);
  };

  const fetchMoreTopics = async () => {
    if (displayTopics.length < itemLimit) return;
    const limitCount = itemLimit + 12;
    setItemLimit(limitCount);
  };

  const subscribeTopics = (): Unsubscribe => {
    const topicsQuery = query(collection(db, "topics"));
    const unsubscribe = onSnapshot(topicsQuery, async () => {
      await latestFunctionRef.current();
    });
    return unsubscribe;
  };

  const subscribeEvents = (): Unsubscribe => {
    const eventsQuery = query(collection(db, "events"));
    const unsubscribe = onSnapshot(eventsQuery, () => {
      fetchEvents();
    });
    return unsubscribe;
  };

  const subscribeClipboardEvent = (
    copiedComment: Comment,
    droppableData: DroppableData
  ) => {
    handleMoveComment(copiedComment, droppableData);
  };

  const handleMoveComment = (
    copiedComment: Comment,
    droppableData: DroppableData
  ) => {
    const { type } = droppableData;
    setPreviousMoveCommentEvent({ comment: copiedComment, droppableData });
    switch (type) {
      case "topic": {
        const destinationTopic = (droppableData as DroppableDataTopic).topic;
        handleDropToTopic(copiedComment, destinationTopic);
        break;
      }
      case "comment": {
        const destinationComment = (droppableData as DroppableDataComment)
          .comment;
        handleDropToComment(copiedComment, destinationComment);
        break;
      }
      case "convert-to-topic": {
        handleDropToAddTopic(copiedComment);
      }
    }
  };

  const getMainSectionWidth = () => {
    return selectedTopic.value ? "w-[60%]" : "w-full";
  };
  const getSideSectionWidth = () => {
    return selectedTopic.value
      ? "w-[40%] overflow-hidden"
      : "w-0 overflow-hidden";
  };

  const redirectToTopicPage = () => {
    if (!selectedTopic.value) return;
    const params = new URLSearchParams(location.search);
    const hostUrl = window.location.origin;

    window.location.href = `${hostUrl}/topics/${
      selectedTopic.value.id
    }?${params.toString()}`;
  };

  const handleOnSubmitTopic = async (
    mode: "create" | "edit",
    payload: ModalTopicPayload
  ) => {
    switch (mode) {
      case "create": {
        // TODO: validate
        let eventID = "";
        if (userContext.userState?.role == "writer") {
          eventID = userContext.userState?.event.id;
        }
        if (!eventID) return;
        await addNewTopic({ ...payload, event_id: eventID });
        break;
      }
      case "edit":
        if (!payload.event_id) return;
        await editTopic({
          id: payload.id,
          title: payload.title,
          event_id: payload.event_id,
          category: payload.category as TopicCategory,
        });

        break;
    }
  };

  const refreshSelectedTopicFromDisplayTopic = (topics: Topic[]) => {
    if (!selectedTopic) return;
    const topic = topics.find((topic) => topic.id === selectedTopic.value?.id);
    if (!topic) {
      selectedTopic.setValue(null);
    } else {
      selectedTopic.setValue(topic);
    }
  };

  const handleOnSubmitComment = async (
    mode: "create" | "edit",
    payload: AddOrEditCommentPayload
  ) => {
    switch (mode) {
      case "create":
        await addNewComment(payload);
        break;
      case "edit":
        await editComment(payload);
        break;
    }
  };

  const handleOnDeleteTopic = async (topicId: string) => {
    await deleteTopicWithChildren(topicId);
    selectedTopic.setValue(null);
  };

  const getCreatedByEvent = () => {
    if (userContext.userState?.role === "writer") {
      return userContext.userState?.event;
    }
  };

  return (
    <ViewerLayout>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        {isPageLoading() ? <FullPageLoader /> : null}
        <div className="min-w-screen flex h-full">
          <section
            className={`bg-blue2 ${getMainSectionWidth()} h-full flex flex-col items-center duration-300 ease-in relative`}
          >
            <section className="absolute w-full h-content z-30 bg-transparent">
              <ModalComment
                events={events}
                mode={homePageContext.modalCommentMainSection.state.mode}
                defaultState={
                  homePageContext.modalCommentMainSection.state.defaultState
                }
                isOpen={
                  homePageContext.modalCommentMainSection.state.isModalOpen
                }
                onClose={() => {
                  homePageContext.modalCommentMainSection.dispatch({
                    type: "CLOSE_MODAL",
                  });
                }}
                parentCommentIds={
                  homePageContext.modalCommentMainSection.state.parentCommentIds
                }
                parentTopicId={
                  homePageContext.modalCommentMainSection.state.parentTopicId
                }
                createdByEvent={getCreatedByEvent() as DreamConEvent}
                onSubmit={handleOnSubmitComment}
                fromTopic={
                  homePageContext.modalCommentMainSection.state.fromTopic
                }
                fromComment={
                  homePageContext.modalCommentMainSection.state.fromComment
                }
              />
              <ModalTopic
                mode={homePageContext.modalTopicMainSection.state.mode}
                defaultState={
                  homePageContext.modalTopicMainSection.state.defaultState
                }
                isOpen={homePageContext.modalTopicMainSection.state.isModalOpen}
                onClose={() => {
                  homePageContext.modalTopicMainSection.dispatch({
                    type: "CLOSE_MODAL",
                  });
                }}
                createdByEvent={getCreatedByEvent() as DreamConEvent}
                onSubmit={handleOnSubmitTopic}
              />
            </section>
            <section
              ref={observerRef}
              className="p-[60px] w-full h-full flex justify-center overflow-scroll relative"
            >
              <TopicListSection
                topics={displayTopics}
                lightWeightTopics={homePageContext.lightWeightTopics.state}
                selectedTopic={selectedTopic.value}
                setSelectedTopic={selectedTopic.setValue}
                events={events}
                topicFilter={topicFilter}
                setTopicFilter={setTopicFilter}
              />
            </section>
            <div className="absolute bottom-0 right-0 py-[24px] px-[75px]">
              <AlertPopup
                visible={showCopyAlert}
                onClose={() => setShowCopyAlert(false)}
                onUndo={() => handleUndoMoveComment()}
                mode="copy"
              />
              <AlertPopup
                visible={showPasteAlert}
                onClose={() => setShowPasteAlert(false)}
                onUndo={() => handleUndoMoveComment()}
                mode="paste"
              />
            </div>
          </section>
          <section
            className={`${getSideSectionWidth()} h-full flex flex-col items-center duration-300 ease-in relative`}
          >
            <section className="absolute w-full h-content z-30 bg-transparent">
              <ModalComment
                events={events}
                mode={homePageContext.modalCommentSideSection.state.mode}
                defaultState={
                  homePageContext.modalCommentSideSection.state.defaultState
                }
                isOpen={
                  homePageContext.modalCommentSideSection.state.isModalOpen
                }
                onClose={() => {
                  homePageContext.modalCommentSideSection.dispatch({
                    type: "CLOSE_MODAL",
                  });
                }}
                parentCommentIds={
                  homePageContext.modalCommentSideSection.state.parentCommentIds
                }
                parentTopicId={
                  homePageContext.modalCommentSideSection.state.parentTopicId
                }
                createdByEvent={getCreatedByEvent() as DreamConEvent}
                fromTopic={
                  homePageContext.modalCommentSideSection.state.fromTopic
                }
                fromComment={
                  homePageContext.modalCommentSideSection.state.fromComment
                }
                onSubmit={handleOnSubmitComment}
              />
            </section>
            <section className="w-full h-full">
              <div className="w-full px-[10px] py-[4px] bg-gray2 flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <button onClick={() => selectedTopic.setValue(null)}>
                    <img
                      className="w-[24px] h-[24px]"
                      src="/icon/double-arrow-right.svg"
                      alt="double-arrow-right-icon"
                    />
                  </button>
                  <button onClick={redirectToTopicPage}>
                    <img
                      className="w-[24px] h-[24px]"
                      src="/icon/expand-wide.svg"
                      alt="expand-icon"
                    />
                  </button>
                </div>
                <div
                  className="flex gap-[4px] items-center hover:cursor-pointer"
                  onClick={async () => {
                    const hostUrl = window.location.origin;
                    const topicLink =
                      hostUrl + "/topics/" + selectedTopic.value?.id;
                    await navigator.clipboard.writeText(topicLink);
                    setTopicLink(topicLink);
                  }}
                >
                  <ChainIcon color={topicLink ? "#4999FA" : "#979797"} />
                  <span className={topicLink ? "text-[#4999FA]" : "text-gray5"}>
                    {topicLink ? "คัดลอกแล้ว!" : "แชร์ลิงก์"}
                  </span>
                </div>
              </div>
              <div className="p-[24px] bg-blue4 w-full h-full overflow-scroll">
                {selectedTopic.value ? (
                  <TopicTemplate
                    topic={selectedTopic.value}
                    onAddComment={(commentView, reason) => {
                      addNewComment({
                        comment_view: commentView,
                        reason,
                        parent_topic_id: selectedTopic.value?.id,
                        parent_comment_ids: [],
                        event_id: getCreatedByEvent()?.id || "",
                      });
                    }}
                    onChangeTopicTitle={(newTitle) => {
                      editTopic({
                        id: selectedTopic.value?.id,
                        title: newTitle,
                        event_id: selectedTopic.value?.event_id || "",
                        category: selectedTopic.value
                          ?.category as TopicCategory,
                      });
                    }}
                    onChangeTopicCategory={(newCategory) => {
                      editTopic({
                        id: selectedTopic.value?.id,
                        title: selectedTopic.value?.title || "",
                        event_id: selectedTopic.value?.event_id || "",
                        category: newCategory as TopicCategory,
                      });
                    }}
                    onDeleteTopic={() =>
                      handleOnDeleteTopic(selectedTopic.value?.id || "")
                    }
                    onPinTopic={() => {
                      pinContext.pinTopic(selectedTopic.value?.id || "");
                    }}
                    onUnpinTopic={() => {
                      pinContext.unpinTopic(selectedTopic.value?.id || "");
                    }}
                  />
                ) : (
                  <div className=" w-full h-full" />
                )}
              </div>
            </section>
          </section>
        </div>
        <DragOverlay>
          {draggedCommentProps ? (
            <CommentAndChildren
              comment={draggedCommentProps.comment}
              previousComment={draggedCommentProps.previousComment}
              nextComment={draggedCommentProps.nextComment}
              level={draggedCommentProps.level}
              isLastChildOfParent={draggedCommentProps.isLastChildOfParent}
              parent={draggedCommentProps.parent}
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </ViewerLayout>
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setDraggedCommentProps(active.data.current as DraggableCommentProps);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    if (!active || !over) return;
    const draggedCommentProps = active.data.current as DraggableCommentProps;
    const draggedComment = draggedCommentProps.comment;
    const droppableData = over?.data.current as DroppableData;

    handleMoveComment(draggedComment, droppableData);
  }

  async function handleDropToTopic(
    draggedComment: Comment,
    destinationTopic: Topic
  ) {
    if (draggedComment.parent_topic_id === destinationTopic.id) return;
    await moveCommentToTopic(draggedComment.id, destinationTopic.id);
    setShowCopyAlert(false);
    setShowPasteAlert(true);
  }

  async function handleDropToComment(
    draggedComment: Comment,
    destinationComment: Comment
  ) {
    // Prevent dropping to itself
    if (draggedComment.id === destinationComment.id) return;
    // Prevent dropping to its last parent
    if (draggedComment.parent_comment_ids.length !== 0) {
      if (
        draggedComment.parent_comment_ids[
          destinationComment.parent_comment_ids.length - 1
        ] === destinationComment.id
      )
        return;
    }
    // prevent dropping to its children
    if (destinationComment.parent_comment_ids.includes(draggedComment.id))
      return;
    await moveCommentToComment(draggedComment, destinationComment.id);
    setShowCopyAlert(false);
    setShowPasteAlert(true);
  }

  async function handleDropToAddTopic(draggedComment: Comment) {
    const eventID = getCreatedByEvent()?.id;
    if (!eventID) return;
    const topic = await convertCommentToTopic(draggedComment, eventID);
    if (!topic) return;
    setPreviousMoveCommentEvent({
      comment: draggedComment,
      droppableData: { type: "convert-to-topic" },
      initialTopic: topic,
    });
    // fetchTopics();
    setShowCopyAlert(false);
    setShowPasteAlert(true);
  }
}
