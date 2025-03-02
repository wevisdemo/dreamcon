import { useContext, useEffect } from "react";
import TopicTemplate from "../components/topic/TopicTemplate";
import { mockTopic1 } from "../data/topic";
import { StoreContext } from "../store";
import ModalComment from "../components/share/ModalComment";

export default function Topic() {
  const { topicPage: topicPageContext, currentPage } = useContext(StoreContext);
  useEffect(() => {
    currentPage.setValue("topic");
  }, []);

  return (
    <>
      <div className="relative bg-[#6EB7FE] w-screen h-screen flex flex-col items-center">
        <section className="py-[24px] overflow-scroll w-full flex justify-center">
          <TopicTemplate topic={mockTopic1} />
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
