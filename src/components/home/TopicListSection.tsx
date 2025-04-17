import { useContext, useEffect, useState } from "react";
import { LightWeightTopic, Topic } from "../../types/topic";
import TopicWrapper from "./TopicWrapper";
import { StoreContext } from "../../store";
import { Droppable } from "../Droppable";
import { useHotkeys } from "react-hotkeys-hook";
import Filter from "./Filter";
import { TopicFilter } from "../../types/home";
import { DreamConEvent } from "../../types/event";
import { Tooltip } from "@mui/material";

interface PropTypes {
  topics: Topic[];
  lightWeightTopics: LightWeightTopic[];
  selectedTopic: Topic | null;
  setSelectedTopic: (topic: Topic) => void;
  events: DreamConEvent[];
  topicFilter: TopicFilter;
  setTopicFilter: (filter: TopicFilter) => void;
}

export default function TopicListSection(props: PropTypes) {
  const {
    homePage: homePageContext,
    clipboard: clipboardContext,
    pin: pinContext,
    mode: modeContext,
    user: userContext,
  } = useContext(StoreContext);
  const [hoveredAddTopic, setHoveredAddTopic] = useState(false);
  const [displayTopics, setDisplayTopics] = useState<Topic[]>([]);
  useEffect(() => {
    const filteredTopics = props.topics.filter((topic) => {
      // regex to check if topic.title contains the search text
      const regex = new RegExp(props.topicFilter.searchText, "i");
      // sorted by filter
      const isFilteredByEvent =
        props.topicFilter.selectedEvent === null ||
        topic.event_id === props.topicFilter.selectedEvent.id;
      const isFilteredByCategory =
        props.topicFilter.category === "ทั้งหมด" ||
        topic.category === props.topicFilter.category;
      return (
        regex.test(topic.title) && isFilteredByEvent && isFilteredByCategory
      );
    });

    // sort by latest or most-commented
    if (props.topicFilter.sortedBy === "latest") {
      filteredTopics.sort((a, b) => {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      });
    } else if (props.topicFilter.sortedBy === "most-commented") {
      filteredTopics.sort((a, b) => {
        return b.comments.length - a.comments.length;
      });
    }

    const pinnedTopicIds = pinContext.pinnedTopics;

    //sort pinned topics to the top
    filteredTopics.sort((a, b) => {
      const aPinnedIndex = pinnedTopicIds.indexOf(a.id);
      const bPinnedIndex = pinnedTopicIds.indexOf(b.id);
      if (aPinnedIndex !== -1 && bPinnedIndex === -1) {
        return -1;
      } else if (aPinnedIndex === -1 && bPinnedIndex !== -1) {
        return 1;
      } else {
        return 0;
      }
    });

    setDisplayTopics(filteredTopics);
  }, [props.topics, props.topicFilter, pinContext.pinnedTopics]);

  const handleAddTopic = () => {
    homePageContext.modalTopicMainSection.dispatch({
      type: "OPEN_MODAL",
      payload: {
        mode: "create",
      },
    });
  };

  const onlyReadMode = () => {
    return (
      userContext.userState?.role === "user" || modeContext.value === "view"
    );
  };

  useHotkeys("Meta+v, ctrl+v", () => {
    if (hoveredAddTopic) {
      clipboardContext.emitMoveComment({
        type: "convert-to-topic",
      });
    }
  });

  const addTopicDisable = () => {
    return (
      userContext.userState?.role === "admin" &&
      props.topicFilter.selectedEvent === null
    );
  };

  const allTopicCount = () => {
    return props.lightWeightTopics.length;
  };
  return (
    <div className="max-w-[920px] flex flex-col items-center gap-[24px] w-full">
      {!onlyReadMode() && (
        <Droppable
          disabled={addTopicDisable()}
          id="add-topic"
          data={{ type: "convert-to-topic" }}
        >
          {(isOver) => (
            <Tooltip
              title={addTopicDisable() ? "คุณต้องเลือกอีเวนต์ก่อน" : ""}
              placement="bottom"
              className="hover:cursor-pointer"
              classes={{ tooltip: "tooltip-1" }}
            >
              <button
                disabled={addTopicDisable()}
                onMouseEnter={() => setHoveredAddTopic(true)}
                onMouseLeave={() => setHoveredAddTopic(false)}
                className={`flex items-center gap-[8px] py-[10px] px-[60px] bg-blue6 rounded-[48px] text-white ${
                  isOver
                    ? "border-blue7 border-[2px]"
                    : "border-transparent border-[2px]"
                } ${addTopicDisable() ? "bg-gray3 !cursor-not-allowed" : ""}`}
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
            </Tooltip>
          )}
        </Droppable>
      )}
      <Filter
        lightWeightTopics={props.lightWeightTopics}
        events={props.events}
        filter={props.topicFilter}
        setFilter={props.setTopicFilter}
        allTopicCount={allTopicCount()}
      />
      <TopicWrapper
        topics={displayTopics}
        selectedTopic={props.selectedTopic}
        setSelectedTopic={props.setSelectedTopic}
      />
    </div>
  );
}
