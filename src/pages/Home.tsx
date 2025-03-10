import { useContext, useEffect, useState } from "react";
import TopicListSection from "../components/home/TopicListSection";
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
} from "../types/dragAndDrop";
import CommentAndChildren from "../components/topic/CommentAndChildren";
import { AddOrEditTopicPayload, Topic, TopicDB } from "../types/topic";
import {
  collection,
  getDocs,
  where,
  query,
  onSnapshot,
  Unsubscribe,
} from "firebase/firestore";
import { db } from "../utils/firestore";
import { AddOrEditCommentPayload, CommentDB, Comment } from "../types/comment";
import { useAddTopic } from "../hooks/useAddTopic";
import { useEditTopic } from "../hooks/userEditTopic";
import { useAddComment } from "../hooks/useAddComment";
import { useEditComment } from "../hooks/useEditComment";
import { useDeleteTopicWithChildren } from "../hooks/useDeleteTopicWithChildren";
import { useMoveComment } from "../hooks/useMoveComment";
import { useConvertCommentToTopic } from "../hooks/useConvertCommentToTopic";
import { convertTopicDBToTopic } from "../utils/mapping";

export default function Home() {
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [displayTopics, setDisplayTopics] = useState<Topic[]>([]);
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const { homePage: homePageContext, currentPage } = useContext(StoreContext);
  const { addNewTopic } = useAddTopic();
  const { editTopic } = useEditTopic();
  const { addNewComment } = useAddComment();
  const { editComment } = useEditComment();
  const { deleteTopicWithChildren } = useDeleteTopicWithChildren();
  const { moveCommentToComment, moveCommentToTopic } = useMoveComment();
  const { convertCommentToTopic } = useConvertCommentToTopic();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  useEffect(() => {
    currentPage.setValue("home");
    fetchTopics();
    const unsubscribe = subscribeTopics();
    return () => {
      unsubscribe();
    };
  }, []);

  const subscribeTopics = (): Unsubscribe => {
    const topicsQuery = query(collection(db, "topics"));
    const unsubscribe = onSnapshot(topicsQuery, () => {
      fetchTopics();
    });
    return unsubscribe;
  };

  useEffect(() => {
    refreshSelectedTopicFromDisplayTopic(displayTopics);
  }, [displayTopics]);

  const getMainSectionWidth = () => {
    return selectedTopic ? "w-[60%]" : "w-full";
  };
  const getSideSectionWidth = () => {
    return selectedTopic ? "w-[40%] overflow-hidden" : "w-0 overflow-hidden";
  };

  const redirectToTopicPage = () => {
    if (!selectedTopic) return;
    window.location.href = `/topic/${selectedTopic.id}`;
  };

  const handleOnSubmitTopic = async (
    mode: "create" | "edit",
    payload: AddOrEditTopicPayload
  ) => {
    switch (mode) {
      case "create":
        await addNewTopic(payload);
        break;
      case "edit":
        await editTopic(payload);
        break;
    }
  };
  const fetchTopics = async () => {
    const topicsCollection = collection(db, "topics");
    const commentsCollection = collection(db, "comments");
    const topicsSnapshot = await getDocs(topicsCollection);
    const topics = topicsSnapshot.docs.map((doc) => {
      return { id: doc.id, ...doc.data() } as TopicDB;
    });
    const topicIds = topics.map((topic) => topic.id);

    const commentsQuery = query(
      commentsCollection,
      where("parent_topic_id", "in", topicIds)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const commentsByTopic: Record<string, CommentDB[]> = {};
    commentsSnapshot.forEach((doc) => {
      const commentDB = { id: doc.id, ...doc.data() } as CommentDB;
      const topicId = commentDB.parent_topic_id;

      if (!commentsByTopic[topicId]) {
        commentsByTopic[topicId] = [];
      }
      commentsByTopic[topicId].push(commentDB);
    });

    // Map comments to topics
    const fineTopics = topics
      .map((topic) => {
        const comments = commentsByTopic[topic.id] || [];
        return convertTopicDBToTopic(topic, comments);
      })
      .sort((a, b) => {
        return a.created_at > b.created_at ? -1 : 1;
      });

    setDisplayTopics(fineTopics);
  };

  const refreshSelectedTopicFromDisplayTopic = (topics: Topic[]) => {
    if (!selectedTopic) return;
    const topic = topics.find((topic) => topic.id === selectedTopic.id);
    if (!topic) {
      setSelectedTopic(null);
    } else {
      setSelectedTopic(topic);
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
    setSelectedTopic(null);
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="min-w-screen flex h-full">
        <section
          className={`bg-blue2 ${getMainSectionWidth()} h-full flex flex-col items-center duration-300 ease-in relative`}
        >
          <section className="absolute w-full h-content z-20 bg-transparent">
            <ModalComment
              mode={homePageContext.modalCommentMainSection.state.mode}
              defaultState={
                homePageContext.modalCommentMainSection.state.defaultState
              }
              isOpen={homePageContext.modalCommentMainSection.state.isModalOpen}
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
              onSubmit={handleOnSubmitComment}
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
              onSubmit={handleOnSubmitTopic}
            />
          </section>
          <section className="p-[60px] w-full flex justify-center overflow-scroll relative">
            <TopicListSection
              topics={displayTopics}
              selectedTopic={selectedTopic}
              setSelectedTopic={setSelectedTopic}
            />
          </section>
        </section>
        <section
          className={`${getSideSectionWidth()} h-full flex flex-col items-center duration-300 ease-in relative`}
        >
          <section className="absolute w-full h-content z-20 bg-transparent">
            <ModalComment
              mode={homePageContext.modalCommentSideSection.state.mode}
              defaultState={
                homePageContext.modalCommentSideSection.state.defaultState
              }
              isOpen={homePageContext.modalCommentSideSection.state.isModalOpen}
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
              onSubmit={handleOnSubmitComment}
            />
          </section>
          <section className="w-full h-full">
            <div className="w-full px-[10px] py-[4px] bg-gray2 flex gap-[10px]">
              <button onClick={() => setSelectedTopic(null)}>
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
            <div className="p-[24px] bg-blue4 w-full h-full overflow-scroll">
              {selectedTopic ? (
                <TopicTemplate
                  topic={selectedTopic}
                  onAddComment={(commentView, reason) => {
                    addNewComment({
                      comment_view: commentView,
                      reason,
                      parent_topic_id: selectedTopic.id,
                      parent_comment_ids: [],
                    });
                  }}
                  onChangeTopicTitle={(newTitle) => {
                    editTopic({
                      id: selectedTopic.id,
                      title: newTitle,
                    });
                  }}
                  onDeleteTopic={() => handleOnDeleteTopic(selectedTopic.id)}
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
  );

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setDraggedCommentProps(active.data.current as DraggableCommentProps);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const draggedCommentProps = active.data.current as DraggableCommentProps;
    const draggedComment = draggedCommentProps.comment;

    switch ((over?.data.current as DroppableData)?.type) {
      case "topic": {
        const destinationTopic = (over?.data.current as DroppableDataTopic)
          .topic;
        handleDropToTopic(draggedComment, destinationTopic);
        break;
      }
      case "comment": {
        const destinationComment = (over?.data.current as DroppableDataComment)
          .comment;
        handleDropToComment(draggedComment, destinationComment);
        break;
      }
      case "convert-to-topic": {
        handleDropToAddTopic(draggedComment);
      }
    }
  }

  function handleDropToTopic(draggedComment: Comment, destinationTopic: Topic) {
    if (draggedComment.parent_topic_id === destinationTopic.id) return;
    moveCommentToTopic(draggedComment.id, destinationTopic.id);
  }

  function handleDropToComment(
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
    moveCommentToComment(draggedComment, destinationComment.id);
  }

  function handleDropToAddTopic(draggedComment: Comment) {
    convertCommentToTopic(draggedComment);
    fetchTopics();
  }
}
