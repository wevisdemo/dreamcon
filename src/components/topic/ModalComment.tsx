import { Comment, CommentView } from '../../types/comment';
import { Topic } from '../../types/topic';
import { CommentModalStore } from '../../store/modalComment';
import { useAddComment } from '../../hooks/useAddComment';
import { useEditComment } from '../../hooks/useEditComment';
import { useEditTopic } from '../../hooks/useEditTopic';
import { useLeaveEvent } from '../../hooks/useLeaveEvent';
import { usePermission } from '../../hooks/usePermission';
import { useAlertIfNotSaved } from '../../hooks/useShowError';
import { flattenComments, linkedEventIds } from '../../utils/mapping';
import FullPageLoader from '../ui/FullPageLoader';
import EventListLabel from './EventListLabel';
import JoinAndComment from './JoinAndComment';
import Modal from '../ui/Modal';

interface PropTypes {
  store: CommentModalStore;
  /** Live topics from the page, so edits by other writers show up while the modal is open. */
  topics: Topic[];
}

export default function ModalComment(props: PropTypes) {
  const { state } = props.store;
  const { getWriterEvent, canLeave } = usePermission();
  const alertIfNotSaved = useAlertIfNotSaved();
  const { addNewComment, loading: addCommentLoading } = useAddComment();
  const {
    editComment,
    joinComment,
    loading: editCommentLoading,
  } = useEditComment();
  const { joinTopic, loading: editTopicLoading } = useEditTopic();
  const { leave, loading: leaveLoading } = useLeaveEvent();

  const loading =
    addCommentLoading || editCommentLoading || editTopicLoading || leaveLoading;

  // Editing closes the modal right away, so the save runs while it is closed.
  if (!state.isModalOpen) {
    return loading ? <FullPageLoader /> : null;
  }

  const isEdit = state.mode === 'edit';
  const topic = props.topics.find(
    topic =>
      topic.id ===
      (isEdit ? state.defaultState?.parent_topic_id : state.parentTopicId)
  );
  const targetCommentId = isEdit
    ? state.defaultState?.id
    : state.parentCommentIds?.slice(-1)[0];
  const target: Topic | Comment | undefined =
    topic && targetCommentId
      ? flattenComments(topic).find(comment => comment.id === targetCommentId)
      : topic;

  const activeEvent = getWriterEvent();
  const eventIds = target ? linkedEventIds(target) : [];
  const color = target && !('title' in target) ? 'gray' : 'blue';
  const canJoin = !!activeEvent && !eventIds.includes(activeEvent.id);

  const handleClose = () => {
    props.store.dispatch({ type: 'CLOSE_MODAL' });
  };

  const handleJoin = (target: Topic | Comment) =>
    alertIfNotSaved(
      'title' in target ? joinTopic(target) : joinComment(target)
    );

  const handleSubmit = (
    target: Topic | Comment,
    commentView: CommentView,
    reason: string
  ) => {
    if (isEdit && !('title' in target)) {
      alertIfNotSaved(
        editComment(target, { comment_view: commentView, reason })
      );
      handleClose();
      return;
    }
    alertIfNotSaved(
      addNewComment({
        comment_view: commentView,
        reason,
        parent_comment_ids: state.parentCommentIds,
        parent_topic_id: state.parentTopicId,
        event_ids: activeEvent ? [activeEvent.id] : [],
      })
    );
  };

  const viewColor = (comment: Comment) => {
    switch (comment.comment_view) {
      case CommentView.AGREE:
        return 'bg-green-light';
      case CommentView.PARTIAL_AGREE:
        return 'bg-yellow-3';
      case CommentView.DISAGREE:
        return 'bg-red-2';
    }
  };

  const title = () => {
    if (isEdit) return 'แก้ไขความคิดเห็น';
    return canJoin ? 'เพิ่มวงสนทนา' : 'เพิ่มความคิดเห็น';
  };

  return (
    <>
      {loading && <FullPageLoader />}
      <Modal title={title()} onClose={handleClose}>
        {target && !isEdit && (
          <>
            <div className="p-2.5 rounded-2xl bg-white">
              {'title' in target ? (
                target.title
              ) : (
                <div className="flex gap-2 items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${viewColor(target)}`}
                  />
                  <span className="flex-1">{target.reason}</span>
                </div>
              )}
            </div>
            <EventListLabel
              label="จากวงสนทนา:"
              className="pt-3"
              color={color}
              eventIds={eventIds}
              activeEventId={activeEvent?.id}
              canLeave={canLeave(target)}
              onLeave={() => leave(target)}
            />
          </>
        )}
        {target ? (
          <JoinAndComment
            textareaId="add-comment-in-modal"
            color={color}
            canJoin={!isEdit && canJoin}
            defaultState={isEdit && !('title' in target) ? target : undefined}
            onJoin={() => handleJoin(target)}
            onAddComment={(commentView, reason) =>
              handleSubmit(target, commentView, reason)
            }
          />
        ) : (
          <p>
            {targetCommentId
              ? 'ความคิดเห็นนี้ถูกลบแล้ว'
              : 'ข้อถกเถียงนี้ถูกลบแล้ว'}
          </p>
        )}
      </Modal>
    </>
  );
}
