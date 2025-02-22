import TopicTemplate from "../components/topic/TopicTemplate";
import TopicWrapper from "../components/TopicWrapper";
import { mockTopic1 } from "../data/topic";

export default function Home() {
  return (
    <div className="min-w-scree flex">
      <section className="bg-blue2 w-[60%] min-h-screen flex flex-col items-center ">
        <TopicWrapper />
      </section>
      <section className="w-[40%] min-h-screen flex flex-col items-center">
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
          <TopicTemplate topic={mockTopic1} />
        </div>
      </section>
    </div>
  );
}
