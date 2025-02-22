import React from "react";
import TopicTemplate from "../components/topic/TopicTemplate";
import { mockTopic1 } from "../data/topic";

export default function Topic() {
  return (
    <div className="py-[24px] bg-[#6EB7FE] min-h-screen min-w-screen flex flex-col items-center">
      <TopicTemplate topic={mockTopic1} />
    </div>
  );
}
