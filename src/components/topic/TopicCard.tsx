import { Topic } from "../../types/topic";

interface PropTypes {
  topic: Topic;
}

export default function TopicCard(props: PropTypes) {
  return (
    <div className="p-[16px] bg-white rounded-[16px] shadow-[0px 4px 16px rgba(0, 0, 0, 0.1)] flex flex-col gap-[10px]">
      <div className="flex justify-between items-start">
        <div className="badge px-[8px] py-[4px] rounded-[48px] bg-accent text-white w-fit">
          สสร.
        </div>
        <img
          className="w-[18px] h-[18px] hover:cursor-pointer"
          src="/icon/menu.svg"
          alt="menu-icon"
        />
      </div>
      <h2 className="p-[10px] wv-ibmplex text-[20px] wv-bold">
        {props.topic.title}
      </h2>
      <div className="flex gap-[8px]">
        <button className="py-[10px] bg-lightGreen/25 hover:bg-lightGreen border-solid border-[1px] border-lightGreen rounded-[48px] w-full">
          เห็นด้วย
        </button>
        <button className="py-[10px] bg-lightYellow/25 hover:bg-lightYellow border-solid border-[1px] border-lightYellow rounded-[48px] w-full">
          เห็นด้วยบ้าง
        </button>
        <button className="py-[10px] bg-lightRed/25 hover:bg-lightRed border-solid border-[1px] border-lightRed rounded-[48px] w-full">
          ไม่เห็นด้วย
        </button>
      </div>
    </div>
  );
}
