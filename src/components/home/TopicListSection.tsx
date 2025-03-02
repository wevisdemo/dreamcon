import { useContext } from "react";
import { Topic } from "../../types/topic";
import TopicWrapper from "./TopicWrapper";
import { StoreContext } from "../../store";

interface PropTypes {
  topics: Topic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
}

export default function TopicListSection(props: PropTypes) {
  const { homePage: homePageContext } = useContext(StoreContext);

  const handleAddTopic = () => {
    homePageContext.modalTopicMainSection.dispatch({
      type: "OPEN_MODAL",
      payload: {
        mode: "create",
      },
    });
  };
  return (
    <div className="max-w-[920px] flex flex-col items-center gap-[24px] w-full">
      <button
        className="flex items-center gap-[8px] py-[10px] px-[60px] bg-blue6 rounded-[48px] text-white"
        onClick={handleAddTopic}
      >
        <img
          className="w-[24px] h-[24px]"
          src="/icon/plus.svg"
          alt="plus-icon"
        />
        <span className="text-[16px] wv-bold wv-ibmplex">
          เพิ่มข้อถกเถียงใหม่
        </span>
      </button>
      <TopicWrapper
        topics={props.topics}
        selectedTopic={props.selectedTopic}
        setSelectedTopic={props.setSelectedTopic}
      />
    </div>
  );
}
