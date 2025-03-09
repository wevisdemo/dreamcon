import { useContext, useEffect, useState } from "react";
import TopicTemplate from "../components/topic/TopicTemplate";
import { Topic, TopicDB } from "../types/topic";
import { Comment } from "../types/comment";
import { StoreContext } from "../store";
import ModalComment from "../components/share/ModalComment";
import { useEditTopic } from "../hooks/userEditTopic";
import { useDeleteTopicWithChildren } from "../hooks/useDeleteTopicWithChildren";
import { useAddComment } from "../hooks/useAddComment";
import { useParams } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  Unsubscribe,
  where,
} from "firebase/firestore";
import { db } from "../utils/firestore";
import { CommentDB } from "../types/comment";
import { convertTopicDBToTopic } from "../utils/mapping";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import CommentAndChildren from "../components/topic/CommentAndChildren";
import {
  DraggableCommentProps,
  DroppableData,
  DroppableDataComment,
} from "../types/dragAndDrop";
import { useMoveComment } from "../hooks/useMoveComment";
import { SmartPointerSensor } from "../utils/SmartSenson";

export default function TopicPage() {
  const { id: topicId } = useParams();
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const { topicPage: topicPageContext, currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue("topic");
    const unsubscribe = subscribeTopic();
    return () => unsubscribe();
  }, []);
  const { editTopic } = useEditTopic();
  const { addNewComment } = useAddComment();
  const { deleteTopicWithChildren } = useDeleteTopicWithChildren();
  const { moveCommentToComment } = useMoveComment();

  const handleOnDeleteTopic = async (topicId: string) => {
    await deleteTopicWithChildren(topicId);
    window.location.href = "/";
  };

  useEffect(() => {
    if (topicId) {
      fetchTopicById(topicId);
    } else {
      window.location.href = "/";
    }
  }, [topicId]);

  const subscribeTopic = (): Unsubscribe => {
    const topicRef = doc(db, `topics/${topicId}`);
    return onSnapshot(topicRef, () => {
      console.log("watch topic", topicId);
      if (topicId) fetchTopicById(topicId);
    });
  };

  const fetchTopicById = async (topicId: string) => {
    const topicRef = doc(db, "topics", topicId);
    const commentsCollection = collection(db, "comments");

    // Fetch the topic
    const topicSnapshot = await getDoc(topicRef);
    if (!topicSnapshot.exists()) {
      console.error("Topic not found");
      window.location.href = "/";
      return null;
    }
    const topic = { id: topicSnapshot.id, ...topicSnapshot.data() } as TopicDB;

    // Fetch comments related to this topic
    const commentsQuery = query(
      commentsCollection,
      where("parent_topic_id", "==", topicId)
    );
    const commentsSnapshot = await getDocs(commentsQuery);

    const comments: CommentDB[] = commentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CommentDB[];

    // Convert the data into Topic format
    setSelectedTopic(convertTopicDBToTopic(topic, comments));
  };

  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setDraggedCommentProps(active.data.current as DraggableCommentProps);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over, active } = event;
    const draggedCommentProps = active.data.current as DraggableCommentProps;
    const draggedComment = draggedCommentProps.comment;

    switch ((over?.data.current as DroppableData)?.type) {
      case "comment": {
        const destinationComment = (over?.data.current as DroppableDataComment)
          .comment;
        handleDropToComment(draggedComment, destinationComment);
        break;
      }
    }
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

  return (
    <>
      {selectedTopic ? (
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={handleDragStart}
          sensors={sensors}
        >
          <div className="relative bg-[#6EB7FE] w-screen h-screen flex flex-col items-center">
            <section className="py-[24px] overflow-scroll w-full flex justify-center">
              <TopicTemplate
                topic={selectedTopic}
                onChangeTopicTitle={(newTitle) => {
                  editTopic({
                    id: selectedTopic.id,
                    title: newTitle,
                  });
                }}
                onAddComment={(commentView, reason) => {
                  addNewComment({
                    parent_topic_id: selectedTopic.id,
                    parent_comment_ids: [],
                    comment_view: commentView,
                    reason,
                  });
                }}
                onDeleteTopic={() => handleOnDeleteTopic(selectedTopic.id)}
              />
            </section>
            <section className="absolute w-full h-content z-20 bg-transparent">
              <ModalComment
                mode={topicPageContext.modalComment.state.mode}
                defaultState={topicPageContext.modalComment.state.defaultState}
                isOpen={topicPageContext.modalComment.state.isModalOpen}
                onClose={() => {
                  topicPageContext.modalComment.dispatch({
                    type: "CLOSE_MODAL",
                  });
                }}
                onSubmit={() => {}}
              />
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
      ) : (
        <div></div>
      )}
    </>
  );
}
