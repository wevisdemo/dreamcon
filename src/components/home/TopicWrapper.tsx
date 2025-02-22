import React from "react";
import Masonry from "@mui/lab/Masonry";
import { Topic } from "../../types/topic";
import TopicSummary from "./TopicSummary";

interface PropTypes {
  topics: Topic[];
}

export default function TopicWrapper(props: PropTypes) {
  return (
    <div className="w-full h-full flex justify-center">
      <Masonry columns={3} spacing={3}>
        {props.topics.map((topic) => (
          <TopicSummary
            key={topic.id}
            topic={topic}
            isSelected={topic.id === "T1"}
          />
        ))}
      </Masonry>
    </div>
  );
}
