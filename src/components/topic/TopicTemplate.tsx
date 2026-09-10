import { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../store';
import { CommentView } from '../../types/comment';
import { Topic, TopicCategory } from '../../types/topic';
import { usePermission } from '../../hooks/usePermission';
import { flattenComments, linkedEventIds } from '../../utils/mapping';
import AlertPopup from '../AlertPopup';
import CommentWrapper from './CommentWrapper';
import EventListLabel from './EventListLabel';
import JoinTopic from './JoinTopic';
import TopicCard from './TopicCard';

interface PropTypes {
  topic: Topic;
  onChangeTopicCategory: (category: TopicCategory) => void;
  onChangeTopicTitle: (title: string) => void;
  onJoinTopic: () => void;
  onLeaveTopic: () => void;
  onDeleteTopic: () => void;
  onAddComment: (commentView: CommentView, reason: string) => void;
  onPinTopic: () => void;
  onUnpinTopic: () => void;
}

export default function TopicTemplate(props: PropTypes) {
  const { pin: pinContext } = useContext(StoreContext);
  const { isReadOnly, getWriterEvent } = usePermission();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeEvent = getWriterEvent();
  const linkedEvents = linkedEventIds(props.topic);
  const isMember = !!activeEvent && linkedEvents.includes(activeEvent.id);
  const canJoin = !!activeEvent && !isMember;
  const isOnlyEvent =
    !!activeEvent &&
    props.topic.event_ids.length === 1 &&
    props.topic.event_ids[0] === activeEvent.id;
  const canLeave = isMember && !isOnlyEvent;

  useEffect(() => {
    setErrorMessage(null);
  }, [props.topic]);

  const handleLeaveTopic = () => {
    if (!activeEvent) return;
    const ownComments = flattenComments(props.topic).filter(
      comment => comment.event_ids[0] === activeEvent.id
    );
    if (ownComments.length > 0) {
      setErrorMessage(
        `เพราะวงสนทนาของคุณมี ${ownComments.length} ความคิดเห็นในข้อถกเถียงนี้`
      );
      return;
    }
    props.onLeaveTopic();
  };

  const getCommentsByView = (view: CommentView) => {
    return props.topic.comments.filter(
      comment => comment.comment_view === view
    );
  };

  const handleOnDeleteTopic = () => {
    props.onDeleteTopic();
  };

  // TODO: duplicated
  const isTopicPinned = (topic: Topic) => {
    return pinContext.pinnedTopics.some(
      pinnedTopic => pinnedTopic === topic.id
    );
  };

  return (
    <div className="max-w-[920px] w-full py-6">
      <div className="flex w-full items-stretch">
        <div className="w-6 h-auto relative overflow-hidden">
          <div className="absolute w-12 left-0 top-1/2 rounded-2xl border-solid border-2 border-blue3 h-screen"></div>
        </div>
        <div className="w-full h-full header-section flex flex-col gap-3">
          <TopicCard
            topic={props.topic}
            isPinned={isTopicPinned(props.topic)}
            onChangeTopicCategory={props.onChangeTopicCategory}
            onChangeTopicTitle={props.onChangeTopicTitle}
            onDeleteTopic={handleOnDeleteTopic}
            onPinTopic={props.onPinTopic}
            onUnpinTopic={props.onUnpinTopic}
          />
        </div>
      </div>

      <div className="comment-section pl-6 overflow-hidden">
        <EventListLabel
          eventIds={linkedEvents}
          activeEventId={activeEvent?.id}
          canLeave={!isReadOnly() && canLeave}
          onLeave={handleLeaveTopic}
        />
        {!isReadOnly() && (
          <JoinTopic
            key={props.topic.id}
            canJoin={canJoin}
            onJoinTopic={props.onJoinTopic}
            onAddComment={props.onAddComment}
          />
        )}
        {errorMessage && (
          <AlertPopup
            mode="error"
            title="ลบไม่ได้"
            message={errorMessage}
            visible
            onClose={() => setErrorMessage(null)}
          />
        )}
        <p className="text-b2 wv-bold wv-ibmplex mt-6">
          {props.topic.comments.length} ความคิดเห็น
        </p>
        <div className="comment-section-body flex flex-col gap-6">
          <div className="view-wrapper mt-4">
            <div className="relative">
              <p className="relative bg-lightGreen px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.AGREE).length} เห็นด้วย
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue3 h-[1000vh]"></div>
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
              <p className="relative bg-lightYellow px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.PARTIAL_AGREE).length}{' '}
                เห็นด้วยบางส่วน
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue3 h-[1000vh]"></div>
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
              <p className="relative bg-lightRed px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.DISAGREE).length} ไม่เห็นด้วย
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue3 h-[1000vh]"></div>
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
