import { useContext } from "react";
import Masonry from "@mui/lab/Masonry";
import { Topic } from "../../types/topic";
import TopicSummary from "./TopicSummary";
import { StoreContext } from "../../store";
import { Droppable } from "../Droppable";
import EmptyTopic from "./EmptyTopic";

interface PropTypes {
  topics: Topic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
}

export default function TopicWrapper(props: PropTypes) {
  const { homePage: homePageContext, pin: pinContext } =
    useContext(StoreContext);
  const handleAddComment = (topic: Topic) => {
    homePageContext.modalCommentMainSection.dispatch({
      type: "OPEN_MODAL",
      payload: {
        mode: "create",
        parentTopicId: topic.id,
        parentCommentIds: [],
        fromTopic: topic,
      },
    });
  };
  const handleSelectTopic = (topic: Topic) => {
    props.setSelectedTopic(topic);
  };

  const isSelected = (topic: Topic) => {
    return props.selectedTopic?.id === topic.id;
  };

  const isTopicPinned = (topic: Topic) => {
    return pinContext.pinnedTopics.some(
      (pinnedTopic) => pinnedTopic === topic.id
    );
  };

  return props.topics.length === 0 ? (
    <EmptyTopic />
  ) : (
    <div className="w-full h-full flex justify-center">
      <Masonry columns={3} spacing={3}>
        {props.topics.map((topic) => (
          <Droppable
            id={`droppable-topic-${topic.id}`}
            key={topic.id}
            data={{ type: "topic", topic }}
          >
            {(isOver) => (
              <TopicSummary
                topic={topic}
                isSelected={isSelected(topic)}
                onClick={() => handleSelectTopic(topic)}
                onAddComment={() => handleAddComment(topic)}
                isOver={isOver}
                isPinned={isTopicPinned(topic)}
              />
            )}
          </Droppable>
        ))}
      </Masonry>
    </div>
  );
}
