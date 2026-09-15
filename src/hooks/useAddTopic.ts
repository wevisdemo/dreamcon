import { useState } from 'react';
import { addDoc, collection } from 'firebase/firestore';
import { AddOrEditTopicPayload, CreateTopicDBPayload } from '../types/topic';
import { db } from '../utils/firestore';

export const useAddTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewTopic = async (payload: AddOrEditTopicPayload) => {
    setLoading(true);
    setError(null);

    try {
      const topicsCollection = collection(db, 'topics');

      if (payload.event_ids.length === 0) {
        setError('No event_ids found in Add New Topic Payload');
        setLoading(false);
        return;
      }

      const timeNow = new Date();
      const TopicDBPayload: CreateTopicDBPayload = {
        title: payload.title,
        categories: payload.categories,
        event_ids: payload.event_ids,
        created_at: timeNow,
        updated_at: timeNow,
        notified_at: timeNow,
      };

      await addDoc(topicsCollection, TopicDBPayload);
    } catch (err) {
      console.error('Error adding document:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { addNewTopic, loading, error };
};
