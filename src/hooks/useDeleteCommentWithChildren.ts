import { useState } from 'react';
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from 'firebase/firestore';
import { Comment } from '../types/comment';
import { db } from '../utils/firestore';
import { usePermission } from './usePermission';

export const useDeleteCommentWithChildren = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canManage } = usePermission();

  const deleteCommentWithChildren = async (
    comment: Comment
  ): Promise<boolean> => {
    const commentId = comment.id;
    if (!commentId) {
      setError('No comment ID provided for deletion');
      return false;
    }
    if (!canManage(comment)) {
      setError('You do not have permission to delete this comment');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async transaction => {
        const commentsCollection = collection(db, 'comments');

        const childCommentsQuery = query(
          commentsCollection,
          where('parent_comment_ids', 'array-contains', commentId)
        );
        const childCommentsSnapshot = await getDocs(childCommentsQuery);

        childCommentsSnapshot.docs.forEach(docSnapshot => {
          const childCommentRef = doc(db, `comments/${docSnapshot.id}`);
          transaction.delete(childCommentRef);
        });

        const commentDocRef = doc(db, `comments/${commentId}`);
        transaction.delete(commentDocRef);

        const parentTopicId = comment.parent_topic_id;

        if (parentTopicId) {
          const parentTopicRef = doc(db, `topics/${parentTopicId}`);
          transaction.update(parentTopicRef, {
            notified_at: new Date(),
          });
        }
      });

      return true;
    } catch (err) {
      console.error('Error deleting comment:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteCommentWithChildren, loading, error };
};
