import { useState } from "react";
import TopicListSection from "../components/home/TopicListSection";
import TopicTemplate from "../components/topic/TopicTemplate";
import { mockTopics } from "../data/topic";
import { Topic } from "../types/topic";

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const getMainSectionWidth = () => {
    return selectedTopic ? "w-[60%]" : "w-full";
  };
  const getSideSectionWidth = () => {
    return selectedTopic ? "w-[40%] overflow-scroll" : "w-0 overflow-hidden";
  };

  return (
    <div className="min-w-screen flex">
      <section
        className={`bg-blue2 ${getMainSectionWidth()} h-screen overflow-scroll flex flex-col items-center p-[60px] duration-300 ease-in`}
      >
        <TopicListSection
          topics={mockTopics}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      </section>
      <section
        className={`${getSideSectionWidth()} h-screen flex flex-col items-center duration-300 ease-in`}
      >
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
