import { useState } from "react";
import TopicListSection from "../components/home/TopicListSection";
import TopicTemplate from "../components/topic/TopicTemplate";
import { mockTopic1, mockTopics } from "../data/topic";
import { Topic } from "../types/topic";

export default function Home() {
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(mockTopic1);

  return (
    <div className="min-w-screen flex">
      <section className="bg-blue2 w-[60%] h-screen overflow-scroll flex flex-col items-center p-[60px]">
        <TopicListSection
          topics={mockTopics}
          selectedTopic={selectedTopic}
          setSelectedTopic={setSelectedTopic}
        />
      </section>
      <section className="w-[40%] h-screen overflow-scroll flex flex-col items-center">
        <div className="w-full px-[10px] py-[4px] bg-gray2 flex gap-[10px]">
          <button>
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
        <div className="p-[24px] bg-blue4 ">
          {selectedTopic && <TopicTemplate topic={selectedTopic} />}
        </div>
      </section>
    </div>
  );
}
