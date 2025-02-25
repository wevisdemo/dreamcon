import { Topic } from "../../types/topic";
import TopicWrapper from "./TopicWrapper";

interface PropTypes {
  topics: Topic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
}

export default function TopicListSection(props: PropTypes) {
  return (
    <div className="flex flex-col items-center gap-[24px] w-full">
      <button className="flex items-center gap-[8px] py-[10px] px-[60px] bg-blue6 rounded-[48px] text-white">
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
