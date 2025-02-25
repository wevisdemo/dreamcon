import React from "react";
import Masonry from "@mui/lab/Masonry";
import { Topic } from "../../types/topic";
import TopicSummary from "./TopicSummary";

interface PropTypes {
  topics: Topic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
}

export default function TopicWrapper(props: PropTypes) {
  const handleAddComment = () => {
    console.log("Add comment");
    // TODO: do it later with context for open modal
  };
  const handleSelectTopic = (topic: Topic) => {
    props.setSelectedTopic(topic);
  };

  const isSelected = (topic: Topic) => {
    return props.selectedTopic?.id === topic.id;
  };

  return (
    <div className="w-full h-full flex justify-center">
      <Masonry columns={3} spacing={3}>
        {props.topics.map((topic) => (
          <TopicSummary
            key={topic.id}
            topic={topic}
            isSelected={isSelected(topic)}
            onClick={() => handleSelectTopic(topic)}
            onAddComment={handleAddComment}
          />
        ))}
      </Masonry>
    </div>
  );
}
