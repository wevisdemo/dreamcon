import { useState } from 'react';
import { doc, runTransaction } from 'firebase/firestore';
import { db } from '../utils/firestore';
import {
  AddOrEditCommentPayload,
  UpdateCommentDBPayload,
} from '../types/comment';
import { usePermission } from './usePermission';

export const useEditComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isWriterOwner, getWriterEvent } = usePermission();

  const editComment = async (payload: AddOrEditCommentPayload) => {
    setLoading(true);
    setError(null);

    if (!payload.id) {
      setError('No ID found in Edit Comment Payload');
      setLoading(false);
      return;
    }

    if (!payload.parent_topic_id) {
      setError('No parent_topic_id found in Edit Comment Payload');
      setLoading(false);
      return;
    }

    const writerEvent = getWriterEvent();
    if (!writerEvent) {
      setError('No writer event found');
      setLoading(false);
      return;
    }

    if (!isWriterOwner(payload.event_id)) {
      setError('You do not have permission to edit this comment');
      setLoading(false);
      return;
    }

    try {
      const timeNow = new Date();
      const CommentDBPayload: UpdateCommentDBPayload = {
        comment_view: payload.comment_view,
        reason: payload.reason,
        updated_at: timeNow,
        notified_at: timeNow,
        event_id: writerEvent.id, // use event from writer because in firebase rule will validate again
      };

      const commentDocRef = doc(db, `comments/${payload.id}`);
      const parentDocRef = doc(db, `topics/${payload.parent_topic_id}`);

      await runTransaction(db, async transaction => {
        transaction.update(commentDocRef, CommentDBPayload);
        transaction.update(parentDocRef, {
          notified_at: timeNow,
        });
      });
      console.log('Document updated with ID:', payload.id);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { editComment, loading, error };
};
