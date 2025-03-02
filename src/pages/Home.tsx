import { useContext } from "react";
import TopicListSection from "../components/home/TopicListSection";
import TopicTemplate from "../components/topic/TopicTemplate";
import { mockTopics } from "../data/topic";
import ModalComment from "../components/share/ModalComment";
import { StoreContext } from "../store";

export default function Home() {
  const getMainSectionWidth = () => {
    return selectedTopic ? "w-[60%]" : "w-full";
  };
  const getSideSectionWidth = () => {
    return selectedTopic ? "w-[40%] overflow-scroll" : "w-0 overflow-hidden";
  };

  const { homePage: homePageContext } = useContext(StoreContext);
  const { state: selectedTopic, setState: setSelectedTopic } =
    homePageContext.selectedTopic;

  return (
    <div className="min-w-screen flex">
      <section
        className={`bg-blue2 ${getMainSectionWidth()} h-screen overflow-scroll flex flex-col items-center p-[60px] duration-300 ease-in`}
      >
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
        <TopicListSection
          topics={mockTopics}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      </section>
      <section
        className={`${getSideSectionWidth()} h-screen flex flex-col items-center duration-300 ease-in relative`}
      >
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
        <div className="w-full px-[10px] py-[4px] bg-gray2 flex gap-[10px]">
          <button onClick={() => setSelectedTopic(null)}>
            <img
              className="w-[24px] h-[24px]"
              src="/icon/double-arrow-right.svg"
              alt="double-arrow-right-icon"
            />
          </button>
          <button>
            <img
              className="w-[24px] h-[24px]"
              src="/icon/expand-wide.svg"
              alt="expand-icon"
            />
          </button>
        </div>
        <div className="p-[24px] bg-blue4 w-full h-full overflow-scroll">
          {selectedTopic ? (
            <TopicTemplate topic={selectedTopic} />
          ) : (
            <div className=" w-full h-full" />
          )}
        </div>
      </section>
    </div>
  );
}
