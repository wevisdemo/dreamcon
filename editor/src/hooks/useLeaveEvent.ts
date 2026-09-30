import { Comment } from '../types/comment';
import { Topic } from '../types/topic';
import { flattenComments } from '../utils/mapping';
import { useEditComment } from './useEditComment';
import { useEditTopic } from './useEditTopic';
import { usePermission } from './usePermission';
import { useAlertIfNotSaved, useShowError } from './useShowError';

export const useLeaveEvent = () => {
  const { getWriterEvent } = usePermission();
  const showError = useShowError();
  const alertIfNotSaved = useAlertIfNotSaved();
  const { leaveTopic, loading: leaveTopicLoading } = useEditTopic();
  const { leaveComment, loading: leaveCommentLoading } = useEditComment();

  const leave = async (parent: Topic | Comment) => {
    const activeEvent = getWriterEvent();
    if (!activeEvent) return;

    const isTopic = 'title' in parent;
    const ownReplies = flattenComments(parent).filter(
      comment => comment.event_ids[0] === activeEvent.id
    );
    if (ownReplies.length > 0) {
      showError({
        title: 'ลบไม่ได้',
        message: isTopic
          ? `เพราะวงสนทนาของคุณมี ${ownReplies.length} ความคิดเห็นในข้อถกเถียงนี้`
          : `เพราะวงสนทนาของคุณมี ${ownReplies.length} ความคิดเห็นต่อยอดในความคิดเห็นนี้`,
      });
      return;
    }

    await alertIfNotSaved(isTopic ? leaveTopic(parent) : leaveComment(parent));
  };

  return { leave, loading: leaveTopicLoading || leaveCommentLoading };
};
