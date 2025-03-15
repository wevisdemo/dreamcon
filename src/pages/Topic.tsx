import { useContext, useEffect, useState } from "react";
import TopicTemplate from "../components/topic/TopicTemplate";
import { Topic, TopicDB } from "../types/topic";
import { AddOrEditCommentPayload, Comment } from "../types/comment";
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
  MoveCommentEvent,
} from "../types/dragAndDrop";
import { useMoveComment } from "../hooks/useMoveComment";
import { SmartPointerSensor } from "../utils/SmartSenson";
import { useEditComment } from "../hooks/useEditComment";
import FullPageLoader from "../components/FullPageLoader";
import AlertPopup from "../components/AlertMoveComment";
import { useHotkeys } from "react-hotkeys-hook";

export default function TopicPage() {
  const { id: topicId } = useParams();
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [showCopyAlert, setShowCopyAlert] = useState(false);
  const [showPasteAlert, setShowPasteAlert] = useState(false);
  const [previousMoveCommentEvent, setPreviousMoveCommentEvent] =
    useState<MoveCommentEvent | null>(null);
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const [firstTimeLoading, setFirstTimeLoading] = useState(true);
  const {
    topicPage: topicPageContext,
    currentPage,
    clipboard: clipboardContext,
  } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue("topic");
    const unsubscribe = subscribeTopic();
    return () => unsubscribe();
  }, []);
  const { editTopic, loading: editTopicLoading } = useEditTopic();
  const { addNewComment, loading: addNewCommentLoading } = useAddComment();
  const { editComment, loading: editCommentLoading } = useEditComment();
  const { deleteTopicWithChildren, loading: deleteTopicLoading } =
    useDeleteTopicWithChildren();
  const {
    moveCommentToComment,
    undoMoveCommentToComment,
    loading: moveCommentLoading,
  } = useMoveComment();

  const handleOnDeleteTopic = async (topicId: string) => {
    await deleteTopicWithChildren(topicId);
    window.location.href = "/";
  };

  const isPageLoading = () => {
    return (
      firstTimeLoading ||
      editTopicLoading ||
      addNewCommentLoading ||
      editCommentLoading ||
      deleteTopicLoading ||
      moveCommentLoading
    );
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
    setFirstTimeLoading(false);
  };

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

  const subscribeClipboardEvent = (
    copiedComment: Comment,
    droppableData: DroppableData
  ) => {
    setPreviousMoveCommentEvent({ comment: copiedComment, droppableData });
    handleMoveComment(copiedComment, droppableData);
  };

  const handleMoveComment = async (
    copiedComment: Comment,
    droppableData: DroppableData
  ) => {
    setPreviousMoveCommentEvent({ comment: copiedComment, droppableData });
    switch (droppableData.type) {
      case "comment": {
        const destinationComment = (droppableData as DroppableDataComment)
          .comment;
        await handleDropToComment(copiedComment, destinationComment);
        break;
      }
    }
  };

  useEffect(() => {
    clipboardContext.subscribeMoveComment(subscribeClipboardEvent);
  }, [clipboardContext.subscribeMoveComment]);

  useEffect(() => {
    clipboardContext.subscribeCopyComment(subscribeCopyComment);
  }, [clipboardContext.subscribeCopyComment]);

  const subscribeCopyComment = () => {
    setShowPasteAlert(false);
    setShowCopyAlert(true);
    setPreviousMoveCommentEvent(null);
  };

  useHotkeys("Meta+z, ctrl+z", () => {
    handleUndoMoveComment();
  });

  const handleUndoMoveComment = async () => {
    console.log("undo move comment", previousMoveCommentEvent);
    if (!previousMoveCommentEvent) return;
    const { comment, droppableData } = previousMoveCommentEvent;
    switch (droppableData.type) {
      case "comment": {
        await undoMoveCommentToComment(comment);
        break;
      }
    }
    setPreviousMoveCommentEvent(null);
    setShowPasteAlert(false);
  };

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        {isPageLoading() ? <FullPageLoader /> : null}
        {selectedTopic ? (
          <div className="relative bg-[#6EB7FE] w-screen h-full flex flex-col items-center">
            <div className="w-full h-[32px] bg-gray2 flex justify-center items-center">
              <div className="w-full max-w-[920px] flex">
                <a
                  className="text-accent text-[13px] wv-ibmplex underline!"
                  href="/"
                >
                  กลับหน้าหลัก
                </a>
              </div>
            </div>
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
            <section className="absolute w-full h-content z-30 bg-transparent">
              <ModalComment
                mode={topicPageContext.modalComment.state.mode}
                defaultState={topicPageContext.modalComment.state.defaultState}
                isOpen={topicPageContext.modalComment.state.isModalOpen}
                onClose={() => {
                  topicPageContext.modalComment.dispatch({
                    type: "CLOSE_MODAL",
                  });
                }}
                parentCommentIds={
                  topicPageContext.modalComment.state.parentCommentIds
                }
                parentTopicId={
                  topicPageContext.modalComment.state.parentTopicId
                }
                onSubmit={handleOnSubmitComment}
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
          </div>
        ) : (
          <div className="relative bg-[#6EB7FE] w-screen h-full flex flex-col items-center"></div>
        )}
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
    </>
  );
}
