import { useContext } from 'react';
import { StoreContext } from '../../store';
import { CommentView } from '../../types/comment';
import { Topic, TopicCategory } from '../../types/topic';
import { useAddComment } from '../../hooks/useAddComment';
import { useDeleteTopicWithChildren } from '../../hooks/useDeleteTopicWithChildren';
import { useEditTopic } from '../../hooks/useEditTopic';
import { useLeaveEvent } from '../../hooks/useLeaveEvent';
import { usePermission } from '../../hooks/usePermission';
import { useAlertIfNotSaved, useShowError } from '../../hooks/useShowError';
import { linkedEventIds } from '../../utils/mapping';
import FullPageLoader from '../FullPageLoader';
import JoinAndComment from '../share/JoinAndComment';
import CommentWrapper from './CommentWrapper';
import EventListLabel from './EventListLabel';
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
    <div className="max-w-230 w-full py-6">
      {(editTopicLoading ||
        leaveLoading ||
        addCommentLoading ||
        deleteTopicLoading) && <FullPageLoader />}
      <div className="flex w-full items-stretch">
        <div className="w-6 h-auto relative overflow-hidden">
          <div className="absolute w-12 left-0 top-1/2 rounded-2xl border-solid border-2 border-blue-3 h-screen"></div>
        </div>
        <div className="w-full h-full header-section flex flex-col gap-3">
          <TopicCard
            topic={props.topic}
            isPinned={pinContext.pinnedTopics.includes(props.topic.id)}
            onChangeTopicCategory={category =>
              alertIfNotSaved(
                editTopic(props.topic, { title: props.topic.title, category })
              )
            }
            onChangeTopicTitle={title =>
              alertIfNotSaved(
                editTopic(props.topic, {
                  title,
                  category: props.topic.category as TopicCategory,
                })
              )
            }
            onDeleteTopic={handleDeleteTopic}
            onPinTopic={() => pinContext.pinTopic(props.topic.id)}
            onUnpinTopic={() => pinContext.unpinTopic(props.topic.id)}
          />
        </div>
      </div>

      <div className="comment-section pl-6 overflow-hidden">
        <EventListLabel
          label={`ข้อถกเถียงจาก ${linkedEvents.length} วงสนทนา:`}
          eventIds={linkedEvents}
          activeEventId={activeEvent?.id}
          canLeave={!isReadOnly() && canLeave(props.topic)}
          onLeave={() => leave(props.topic)}
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
        <p className="text-b2 wv-bold wv-ibmplex mt-6">
          {props.topic.comments.length} ความคิดเห็น
        </p>
        <div className="comment-section-body flex flex-col gap-6">
          <div className="view-wrapper mt-4">
            <div className="relative">
              <p className="relative bg-green-light px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.AGREE).length} เห็นด้วย
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue-3 h-[1000vh]"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.AGREE)}
              level={1}
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative bg-yellow-3 px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.PARTIAL_AGREE).length}{' '}
                เห็นด้วยบางส่วน
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue-3 h-[1000vh]"></div>
            </div>
            <CommentWrapper
              comments={getCommentsByView(CommentView.PARTIAL_AGREE)}
              level={1}
            />
          </div>
          <div className="view-wrapper">
            <div className="relative">
              <p className="relative bg-red-2 px-2.5 py-1 w-fit rounded-2xl text-b3 z-10">
                {getCommentsByView(CommentView.DISAGREE).length} ไม่เห็นด้วย
              </p>
              <div className="absolute w-10 -left-6 bottom-1/2 rounded-bl-2xl border-solid border-l-2 border-b-2 border-blue-3 h-[1000vh]"></div>
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
