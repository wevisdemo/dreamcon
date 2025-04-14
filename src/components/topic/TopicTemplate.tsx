import { useContext } from "react";
import { StoreContext } from "../../store";
import { CommentView } from "../../types/comment";
import { Topic, TopicCategory } from "../../types/topic";
import CommentWrapper from "./CommentWrapper";
import TopicCard from "./TopicCard";
import { DreamConEvent } from "../../types/event";

interface PropTypes {
  topic: Topic;
  onChangeTopicCategory: (category: TopicCategory) => void;
  onChangeTopicTitle: (title: string) => void;
  onDeleteTopic: () => void;
  onAddComment: (commentView: CommentView, reason: string) => void;
}

export default function TopicTemplate(props: PropTypes) {
  const { event: eventContext } = useContext(StoreContext);
  const getCommentsByView = (view: CommentView) => {
    return props.topic.comments.filter(
      (comment) => comment.comment_view === view
    );
  };

  const handleOnDeleteTopic = () => {
    props.onDeleteTopic();
  };

  const getOwnerEvent = (): DreamConEvent | null => {
    const event = eventContext.events.find(
      (event) => event.id === props.topic.event_id
    );
    if (event) {
      return event;
    }
    return null;
  };

  return (
    <div className="max-w-[920px] w-full py-[24px]">
      <div className="flex w-full items-stretch">
        <div className="w-[24px] h-auto relative overflow-hidden">
          <div className="absolute w-[48px] left-0 top-[50%] rounded-[16px] border-solid border-[2px] border-blue3 h-[100vh]"></div>
        </div>
        <div className="w-full h-full header-section flex flex-col gap-[10px]">
          {getOwnerEvent() && (
            <div className="flex gap-[8px] items-center text-[10px] pl-[16px]">
              <img
                className="rounded-full w-[25px] h-[25px]"
                src={getOwnerEvent()?.avatar_url}
                alt={`avatar-event-${getOwnerEvent()?.display_name}`}
              />
              <span className="wv-bold">{getOwnerEvent()?.display_name}</span>
              <span>สร้างข้อถกเถียงนี้</span>
            </div>
          )}
          <div className="w-full flex justify-end z-10">
            <TopicCard
              topic={props.topic}
              onChangeTopicCategory={props.onChangeTopicCategory}
              onChangeTopicTitle={props.onChangeTopicTitle}
              onAddComment={(commentView: CommentView, reason: string) => {
                props.onAddComment(commentView, reason);
              }}
              onDeleteTopic={handleOnDeleteTopic}
            />
          </div>
        </div>
      </div>

      <div className="comment-section pl-[24px] pt-[10px] pb-[24px] overflow-hidden ">
        <p className="text-[16px] wv-bold wv-ibmplex mt-[24px]">
          {props.topic.comments.length} ความคิดเห็น
        </p>
        <div className="comment-section-body flex flex-col gap-[24px]">
          <div className="view-wrapper mt-[16px]">
            <div className="relative">
              <p className="relative bg-lightGreen px-[10px] py-[4px] w-fit rounded-[16px] text[13px] z-10">
                {getCommentsByView(CommentView.AGREE).length} เห็นด้วย
              </p>
              <div className="absolute w-[40px] left-[-24px] bottom-[50%] rounded-bl-[16px] border-solid border-l-[2px] border-b-[2px] border-blue3 h-[1000vh]"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.AGREE)}
              level={1}
              parent={props.topic}
              isLastChildOfParent
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative bg-lightYellow px-[10px] py-[4px] w-fit rounded-[16px] text[13px] z-10">
                {getCommentsByView(CommentView.PARTIAL_AGREE).length}{" "}
                เห็นด้วยบางส่วน
              </p>
              <div className="absolute w-[40px] left-[-24px] bottom-[50%] rounded-bl-[16px] border-solid border-l-[2px] border-b-[2px] border-blue3 h-[1000vh]"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.PARTIAL_AGREE)}
              level={1}
              parent={props.topic}
              isLastChildOfParent
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative bg-lightRed px-[10px] py-[4px] w-fit rounded-[16px] text[13px] z-10">
                {getCommentsByView(CommentView.DISAGREE).length} ไม่เห็นด้วย
              </p>
              <div className="absolute w-[40px] left-[-24px] bottom-[50%] rounded-bl-[16px] border-solid border-l-[2px] border-b-[2px] border-blue3 h-[1000vh]"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.DISAGREE)}
              level={1}
              parent={props.topic}
              isLastChildOfParent
            />
          </div>
        </div>
      </div>
    </div>
  );
}
