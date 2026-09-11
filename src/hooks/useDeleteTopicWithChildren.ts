import { useState } from 'react';
import { db } from '../utils/firestore';
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
} from 'firebase/firestore';
import { usePermission } from './usePermission';
import { Topic } from '../types/topic';

export const useDeleteTopicWithChildren = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canManage, getWriterEvent } = usePermission();

  const deleteTopicWithChildren = async (topic: Topic): Promise<boolean> => {
    const topicId = topic.id;
    if (!topicId) {
      setError('No topic ID provided for deletion');
      return false;
    }

    const writerEvent = getWriterEvent();
    if (!writerEvent) {
      setError('No writer event found');
      setLoading(false);
      return false;
    }

    if (!canManage(topic)) {
      setError('You do not have permission to delete this topic');
      setLoading(false);
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async transaction => {
        const commentsCollection = collection(db, 'comments');

        // Step 1: Find comments with this topic ID
        const commentsQuery = query(
          commentsCollection,
          where('parent_topic_id', '==', topicId)
        );
        const commentsSnapshot = await getDocs(commentsQuery);

        // Step 2: Delete all related comments in the transaction
        commentsSnapshot.docs.forEach(docSnapshot => {
          const commentRef = doc(db, `comments/${docSnapshot.id}`);
          transaction.delete(commentRef);
        });

        // Step 3: Delete the topic itself
        const topicDocRef = doc(db, `topics/${topicId}`);
        transaction.delete(topicDocRef);
      });

      console.log(
        'Topic and all related comments deleted successfully:',
        topicId
      );
      return true;
    } catch (err) {
      console.error('Error deleting topic:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { deleteTopicWithChildren, loading, error };
};
