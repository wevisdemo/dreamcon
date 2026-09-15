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
import { Topic } from '../types/topic';
import { db } from '../utils/firestore';

export const useMoveComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commentsCollection = collection(db, 'comments');

  const fetchChildComments = async (parentId: string) => {
    const childCommentsQuery = query(
      commentsCollection,
      where('parent_comment_ids', 'array-contains', parentId)
    );
    const childCommentsSnapshot = await getDocs(childCommentsQuery);
    return childCommentsSnapshot.docs.map(doc => ({
      id: doc.id,
      parent_comment_ids: doc.data().parent_comment_ids,
    }));
  };

  const moveCommentToComment = async (
    comment: Comment,
    newParentId: string
  ): Promise<boolean> => {
    const commentId = comment.id;
    if (!commentId || !newParentId) {
      setError('Missing comment ID or new parent ID');
      return false;
    }

    setLoading(true);
    setError(null);
    try {
      await runTransaction(db, async transaction => {
        const targetCommentRef = doc(db, `comments/${commentId}`);
        const targetCommentSnap = await transaction.get(targetCommentRef);
        if (!targetCommentSnap.exists())
          throw new Error('Target comment not found');

        const newParentCommentRef = doc(db, `comments/${newParentId}`);
        const newParentSnap = await transaction.get(newParentCommentRef);
        if (!newParentSnap.exists())
          throw new Error('New parent comment not found');

        const newParentData = newParentSnap.data();

        const newParentIds = [...newParentData.parent_comment_ids, newParentId];

        transaction.update(targetCommentRef, {
          parent_comment_ids: newParentIds,
        });

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);
            const oldParentIds = child.parent_comment_ids;
            const parentIndex = oldParentIds.indexOf(parentId);
            if (parentIndex === -1) continue;
            const newChildParentIds = [
              ...newParentIds,
              ...oldParentIds.slice(parentIndex),
            ];
            transaction.update(childRef, {
              parent_comment_ids: newChildParentIds,
            });
          }
        };

        await updateChildComments(commentId);

        const parentTopicId = newParentData.parent_topic_id;
        if (parentTopicId) {
          const parentTopicRef = doc(db, `topics/${parentTopicId}`);
          transaction.update(parentTopicRef, {
            notified_at: new Date(),
          });
        }
      });

      return true;
    } catch (err) {
      console.error('Error moving comment:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const moveCommentToTopic = async (
    commentId: string,
    newTopicId: string
  ): Promise<boolean> => {
    if (!commentId || !newTopicId) {
      setError('Missing comment ID or new topic ID');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async transaction => {
        const targetCommentRef = doc(db, `comments/${commentId}`);
        const targetCommentSnap = await transaction.get(targetCommentRef);
        if (!targetCommentSnap.exists())
          throw new Error('Target comment not found');

        transaction.update(targetCommentRef, {
          parent_comment_ids: [], // Level 1 comment
          parent_topic_id: newTopicId,
        });

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Remove the old parent IDs from the child’s parent_comment_ids
            const oldParentIds = child.parent_comment_ids;
            const parentIndex = oldParentIds.indexOf(parentId);
            if (parentIndex === -1) continue;
            const newParentIds = [...oldParentIds.slice(parentIndex)];

            transaction.update(childRef, {
              parent_comment_ids: newParentIds,
              parent_topic_id: newTopicId,
            });
          }
        };

        await updateChildComments(commentId);

        const parentTopicRef = doc(db, `topics/${newTopicId}`);
        transaction.update(parentTopicRef, {
          notified_at: new Date(),
        });
      });

      return true;
    } catch (err) {
      console.error('Error moving comment to topic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const undoMoveCommentToComment = async (previousComment: Comment) => {
    setLoading(true);
    setError(null);

    // !! known issue: not handling if former parent topic or comment is deleted

    try {
      await runTransaction(db, async transaction => {
        const targetCommentRef = doc(db, `comments/${previousComment.id}`);
        transaction.update(targetCommentRef, {
          parent_comment_ids: previousComment.parent_comment_ids,
          parent_topic_id: previousComment.parent_topic_id,
        });

        const fetchChildComments = async (parentId: string) => {
          const childCommentsQuery = query(
            commentsCollection,
            where('parent_comment_ids', 'array-contains', parentId)
          );
          const childCommentsSnapshot = await getDocs(childCommentsQuery);
          return childCommentsSnapshot.docs.map(doc => ({
            id: doc.id,
            parent_comment_ids: doc.data().parent_comment_ids,
          }));
        };

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Update parent_comment_ids up to the target comment index
            const targetIndex = child.parent_comment_ids.indexOf(
              previousComment.id
            );
            const newParentIds = [
              ...previousComment.parent_comment_ids,
              ...child.parent_comment_ids.slice(targetIndex),
            ];

            await transaction.update(childRef, {
              parent_topic_id: previousComment.parent_topic_id,
              parent_comment_ids: newParentIds,
            });
          }
        };

        await updateChildComments(previousComment.id);

        const oldParentTopicRef = doc(
          db,
          `topics/${previousComment.parent_topic_id}`
        );
        transaction.update(oldParentTopicRef, {
          notified_at: new Date(),
        });
      });
    } catch (err) {
      console.error('Error undo moving comment to topic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const undoMoveCommentToTopic = async (
    previousComment: Comment,
    unusedTopic: Topic
  ) => {
    setLoading(true);
    setError(null);

    // !! known issue: not handling if former parent topic or comment is deleted

    try {
      await runTransaction(db, async transaction => {
        const targetCommentRef = doc(db, `comments/${previousComment.id}`);
        transaction.update(targetCommentRef, {
          parent_comment_ids: previousComment.parent_comment_ids,
          parent_topic_id: previousComment.parent_topic_id,
        });

        const fetchChildComments = async (parentId: string) => {
          const childCommentsQuery = query(
            commentsCollection,
            where('parent_comment_ids', 'array-contains', parentId)
          );
          const childCommentsSnapshot = await getDocs(childCommentsQuery);
          return childCommentsSnapshot.docs.map(doc => ({
            id: doc.id,
            parent_comment_ids: doc.data().parent_comment_ids,
          }));
        };

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Update parent_comment_ids up to the target comment index
            const targetIndex = child.parent_comment_ids.indexOf(
              previousComment.id
            );
            const newParentIds = [
              ...previousComment.parent_comment_ids,
              ...child.parent_comment_ids.slice(targetIndex),
            ];

            await transaction.update(childRef, {
              parent_topic_id: previousComment.parent_topic_id,
              parent_comment_ids: newParentIds,
            });
          }
        };

        await updateChildComments(previousComment.id);

        const oldParentTopicRef = doc(
          db,
          `topics/${previousComment.parent_topic_id}`
        );
        transaction.update(oldParentTopicRef, {
          notified_at: new Date(),
        });

        const newParentTopicRef = doc(db, `topics/${unusedTopic.id}`);
        transaction.update(newParentTopicRef, {
          notified_at: new Date(),
        });
      });
    } catch (err) {
      console.error('Error undo moving comment to topic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    moveCommentToComment,
    undoMoveCommentToComment,
    moveCommentToTopic,
    undoMoveCommentToTopic,
    loading,
    error,
  };
};
