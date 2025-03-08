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
import { DraggableCommentProps } from "../types/dragAndDrop";
import CommentAndChildren from "../components/topic/CommentAndChildren";
import {
  AddOrEditTopicPayload,
  CreateTopicDBPayload,
  Topic,
  TopicDB,
  UpdateTopicDBPayload,
} from "../types/topic";
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDocs,
  where,
  query,
} from "firebase/firestore";
import { db } from "../utils/firestore";
import { CommentDB } from "../types/comment";

export default function Home() {
  const sensors = useSensors(useSensor(SmartPointerSensor));
  const [displayTopics, setDisplayTopics] = useState<Topic[]>([]);
  const [draggedCommentProps, setDraggedCommentProps] =
    useState<DraggableCommentProps | null>(null);
  const { homePage: homePageContext, currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue("home");
    fetchTopics();
  }, []);

  const getMainSectionWidth = () => {
    return selectedTopic ? "w-[60%]" : "w-full";
  };
  const getSideSectionWidth = () => {
    return selectedTopic ? "w-[40%] overflow-hidden" : "w-0 overflow-hidden";
  };

  const { state: selectedTopic, setState: setSelectedTopic } =
    homePageContext.selectedTopic;

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
        await handleAddNewTopic(payload);
        break;
      case "edit":
        await handleEditTopic(payload);
        break;
    }
  };

  const handleAddNewTopic = async (payload: AddOrEditTopicPayload) => {
    const topicsCollection = collection(db, "topics");

    const timeNow = new Date();
    const TopicDBPayload: CreateTopicDBPayload = {
      title: payload.title,
      created_at: timeNow,
      updated_at: timeNow,
      notified_at: timeNow,
    };
    await addDoc(topicsCollection, TopicDBPayload) // Changed payload to TopicDBPayload
      .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  const handleEditTopic = async (payload: AddOrEditTopicPayload) => {
    if (!payload.id) {
      console.error("No ID found in Edit Topic Payload");
      return;
    }

    const topicDocRef = doc(db, `topics/${payload.id}`);

    const timeNow = new Date();
    const TopicDBPayload: UpdateTopicDBPayload = {
      title: payload.title,
      updated_at: timeNow,
      notified_at: timeNow,
    };

    await updateDoc(topicDocRef, TopicDBPayload)
      .then(() => {
        console.log("Document updated with ID: ", payload.id);
      })
      .catch((error) => {
        console.error("Error updating document: ", error);
      });
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
    const fineTopics = topics.map((topic) => {
      const comments = commentsByTopic[topic.id] || [];
      return convertTopicDBToTopic(topic, comments);
    });

    setDisplayTopics(fineTopics);
  };

  const convertTopicDBToTopic = (
    topicDB: TopicDB,
    commentDBs: CommentDB[]
  ): Topic => {
    // TODO: map comment Level
    return {
      id: topicDB.id,
      title: topicDB.title,
      comments: commentDBs.map((commentDB) => {
        return {
          id: commentDB.id,
          comment_view: commentDB.comment_view,
          reason: commentDB.reason,
          comments: [],
          created_at: commentDB.created_at,
          updated_at: commentDB.updated_at,
          notified_at: commentDB.notified_at,
        };
      }),
      created_at: topicDB.created_at,
      updated_at: topicDB.updated_at,
      notified_at: topicDB.notified_at,
    };
  };

  return (
    <DndContext
      onDragEnd={handleDragEnd}
      onDragStart={handleDragStart}
      sensors={sensors}
    >
      <div className="min-w-screen flex">
        <section
          className={`bg-blue2 ${getMainSectionWidth()} h-screen flex flex-col items-center duration-300 ease-in relative`}
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
              onSubmit={() => {}}
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
          className={`${getSideSectionWidth()} h-screen flex flex-col items-center duration-300 ease-in relative`}
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
              onSubmit={() => {}}
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
                  onChangeTopicTitle={(newTitle) => {
                    handleEditTopic({
                      id: selectedTopic.id,
                      title: newTitle,
                    });
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
  );

  function handleDragStart(event: DragStartEvent) {
    console.log("drag start", event);
    const { active } = event;
    setDraggedCommentProps(active.data.current as DraggableCommentProps);
  }

  function handleDragEnd(event: DragEndEvent) {
    console.log("drag end", event);
    const { over } = event;
    console.log("over", over);
  }
}
