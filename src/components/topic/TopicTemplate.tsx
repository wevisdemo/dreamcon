import { useContext } from 'react';
import { useAddComment } from '../../hooks/useAddComment';
import { useDeleteTopicWithChildren } from '../../hooks/useDeleteTopicWithChildren';
import { useEditTopic } from '../../hooks/useEditTopic';
import { useLeaveEvent } from '../../hooks/useLeaveEvent';
import { usePermission } from '../../hooks/usePermission';
import { useAlertIfNotSaved, useShowError } from '../../hooks/useShowError';
import { StoreContext } from '../../store';
import { CommentView } from '../../types/comment';
import { Topic } from '../../types/topic';
import { linkedEventIds } from '../../utils/mapping';
import FullPageLoader from '../ui/FullPageLoader';
import CommentWrapper from './CommentWrapper';
import EventListLabel from './EventListLabel';
import JoinAndComment from './JoinAndComment';
import TopicCard from './TopicCard';

interface PropTypes {
  topic: Topic;
  onDeleted?: () => void;
}

export default function TopicTemplate(props: PropTypes) {
  const { pin: pinContext } = useContext(StoreContext);
  const { isReadOnly, getWriterEvent, canLeave } = usePermission();
  const showError = useShowError();
  const alertIfNotSaved = useAlertIfNotSaved();
  const { editTopic, joinTopic, loading: editTopicLoading } = useEditTopic();
  const { leave, loading: leaveLoading } = useLeaveEvent();
  const { addNewComment, loading: addCommentLoading } = useAddComment();
  const { deleteTopicWithChildren, loading: deleteTopicLoading } =
    useDeleteTopicWithChildren();

  const activeEvent = getWriterEvent();
  const linkedEvents = linkedEventIds(props.topic);
  const canJoin = !!activeEvent && !linkedEvents.includes(activeEvent.id);

  const handleAddComment = (commentView: CommentView, reason: string) => {
    addNewComment({
      parent_topic_id: props.topic.id,
      parent_comment_ids: [],
      comment_view: commentView,
      reason,
      event_ids: activeEvent ? [activeEvent.id] : [],
    });
  };

  const handleDeleteTopic = async () => {
    if (await deleteTopicWithChildren(props.topic)) {
      props.onDeleted?.();
    } else {
      showError({ title: 'ลบไม่สำเร็จ', message: 'กรุณาลองใหม่อีกครั้ง' });
    }
  };

  const getCommentsByView = (view: CommentView) => {
    return props.topic.comments.filter(
      comment => comment.comment_view === view
    );
  };

  return (
    <div className="w-full max-w-230 py-6">
      {(editTopicLoading ||
        leaveLoading ||
        addCommentLoading ||
        deleteTopicLoading) && <FullPageLoader />}
      <div className="flex w-full items-stretch">
        <div className="relative h-auto w-6 overflow-hidden">
          <div className="absolute top-1/2 left-0 h-screen w-12 rounded-2xl border-2 border-solid border-blue-3"></div>
        </div>
        <div className="header-section flex h-full w-full flex-col gap-3">
          <TopicCard
            topic={props.topic}
            isPinned={pinContext.pinnedTopics.includes(props.topic.id)}
            onChangeTopic={(title, categories) =>
              alertIfNotSaved(editTopic(props.topic, { title, categories }))
            }
            onDeleteTopic={handleDeleteTopic}
            onPinTopic={() => pinContext.pinTopic(props.topic.id)}
            onUnpinTopic={() => pinContext.unpinTopic(props.topic.id)}
          />
        </div>
      </div>

      <div className="comment-section overflow-hidden pl-6">
        <EventListLabel
          label={`ข้อถกเถียงจาก ${linkedEvents.length} วงสนทนา:`}
          eventIds={linkedEvents}
          activeEventId={activeEvent?.id}
          canLeave={!isReadOnly() && canLeave(props.topic)}
          onLeave={() => leave(props.topic)}
          className="py-3"
        />
        {!isReadOnly() && (
          <JoinAndComment
            key={props.topic.id}
            textareaId="add-comment-in-topic-card"
            canJoin={canJoin}
            onJoin={() => alertIfNotSaved(joinTopic(props.topic))}
            onAddComment={handleAddComment}
          />
        )}
        <p className="wv-bold wv-ibmplex mt-6 text-b2">
          {props.topic.comments.length} ความคิดเห็น
        </p>
        <div className="comment-section-body flex flex-col gap-6">
          <div className="view-wrapper mt-4">
            <div className="relative">
              <p className="relative z-10 w-fit rounded-2xl bg-green-light px-2.5 py-1 text-b3">
                {getCommentsByView(CommentView.AGREE).length} เห็นด้วย
              </p>
              <div className="absolute bottom-1/2 -left-6 h-[1000vh] w-10 rounded-bl-2xl border-b-2 border-l-2 border-solid border-blue-3"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.AGREE)}
              level={1}
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative z-10 w-fit rounded-2xl bg-yellow-3 px-2.5 py-1 text-b3">
                {getCommentsByView(CommentView.PARTIAL_AGREE).length}{' '}
                เห็นด้วยบางส่วน
              </p>
              <div className="absolute bottom-1/2 -left-6 h-[1000vh] w-10 rounded-bl-2xl border-b-2 border-l-2 border-solid border-blue-3"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.PARTIAL_AGREE)}
              level={1}
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative z-10 w-fit rounded-2xl bg-red-2 px-2.5 py-1 text-b3">
                {getCommentsByView(CommentView.DISAGREE).length} ไม่เห็นด้วย
              </p>
              <div className="absolute bottom-1/2 -left-6 h-[1000vh] w-10 rounded-bl-2xl border-b-2 border-l-2 border-solid border-blue-3"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.DISAGREE)}
              level={1}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
