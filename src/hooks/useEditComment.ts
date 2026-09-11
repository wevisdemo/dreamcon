import { useState } from 'react';
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  FieldValue,
  runTransaction,
  UpdateData,
} from 'firebase/firestore';
import { db } from '../utils/firestore';
import { Comment, UpdateCommentDBPayload } from '../types/comment';
import { usePermission } from './usePermission';

export const useEditComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canManage, getWriterEvent } = usePermission();

  /** Takes the whole comment because permission depends on its replies. */
  const editComment = async (
    comment: Comment,
    changes: Pick<Comment, 'comment_view' | 'reason'>
  ): Promise<boolean> => {
    if (!canManage(comment)) {
      setError('You do not have permission to edit this comment');
      return false;
    }

    const CommentDBPayload: UpdateCommentDBPayload = {
      comment_view: changes.comment_view,
      reason: changes.reason,
      updated_at: new Date(),
      notified_at: new Date(),
    };

    return writeComment(comment, CommentDBPayload);
  };

  const joinComment = async (comment: Comment): Promise<boolean> => {
    const writerEventId = getWriterEvent()?.id;
    if (!writerEventId) {
      setError('Only a writer can add an event to a comment');
      return false;
    }
    return writeCommentEvents(comment, arrayUnion(writerEventId));
  };

  /**
   * A comment must keep at least one event, which is what `firestore.rules` enforces on its side.
   * Its author (`event_ids[0]`) cannot leave, or the next event would become the author.
   */
  const leaveComment = async (comment: Comment): Promise<boolean> => {
    const writerEventId = getWriterEvent()?.id;
    if (!writerEventId) {
      setError('Only a writer can remove an event from a comment');
      return false;
    }
    if (comment.event_ids[0] === writerEventId) {
      setError('The author event cannot leave its own comment');
      return false;
    }
    if (comment.event_ids.length < 2) {
      setError('A comment must stay linked to at least one event');
      return false;
    }
    return writeCommentEvents(comment, arrayRemove(writerEventId));
  };

  /**
   * Written as an array transform rather than a whole array so two writers
   * joining or leaving at once cannot overwrite each other.
   */
  const writeCommentEvents = (comment: Comment, event_ids: FieldValue) =>
    writeComment(comment, {
      event_ids,
      updated_at: new Date(),
      notified_at: new Date(),
    });

  /** Also bumps the parent topic, whose snapshot is what refreshes the page. */
  const writeComment = async (
    comment: Comment,
    payload: UpdateData<DocumentData>
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async transaction => {
        transaction.update(doc(db, `comments/${comment.id}`), payload);
        transaction.update(doc(db, `topics/${comment.parent_topic_id}`), {
          notified_at: new Date(),
        });
      });
      console.log('Document updated with ID:', comment.id);
      return true;
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { editComment, joinComment, leaveComment, loading, error };
};
