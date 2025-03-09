import { useContext, useEffect, useState } from "react";
import TopicTemplate from "../components/topic/TopicTemplate";
import { Topic } from "../types/topic";
import { mockTopic1 } from "../data/topic";
import { StoreContext } from "../store";
import ModalComment from "../components/share/ModalComment";
import { useEditTopic } from "../hooks/userEditTopic";
import { useDeleteTopicWithChildren } from "../hooks/useDeleteTopicWithChildren";

export default function TopicPage() {
  const [selectedTopic, setSelectedTopic] = useState<Topic>(mockTopic1);
  const { topicPage: topicPageContext, currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue("topic");
  }, []);
  const { editTopic } = useEditTopic();
  const { deleteTopicWithChildren } = useDeleteTopicWithChildren();

  const handleOnDeleteTopic = async (topicId: string) => {
    await deleteTopicWithChildren(topicId);
    window.location.href = "/";
  };

  return (
    <>
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
    </>
  );
}
