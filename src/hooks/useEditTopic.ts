import { useState } from 'react';
import {
  arrayRemove,
  arrayUnion,
  doc,
  DocumentData,
  FieldValue,
  updateDoc,
  UpdateData,
} from 'firebase/firestore';
import { db } from '../utils/firestore';
import {
  AddOrEditTopicPayload,
  Topic,
  UpdateTopicDBPayload,
} from '../types/topic';
import { usePermission } from './usePermission';

export const useEditTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { canManageTopic, getWriterEvent } = usePermission();

  /** Takes the whole topic because permission depends on its comments. */
  const editTopic = async (
    topic: Topic,
    changes: Pick<AddOrEditTopicPayload, 'title' | 'category'>
  ) => {
    if (!canManageTopic(topic)) {
      setError('You do not have permission to edit this topic');
      return;
    }

    const TopicDBPayload: UpdateTopicDBPayload = {
      title: changes.title,
      category: changes.category,
      updated_at: new Date(),
      notified_at: new Date(),
    };

    await writeTopic(topic.id, TopicDBPayload);
  };

  const joinTopic = async (topicId: string) => {
    const writerEventId = getWriterEvent()?.id;
    if (!writerEventId) {
      setError('Only a writer can add an event to a topic');
      return;
    }
    await writeTopicEvents(topicId, arrayUnion(writerEventId));
  };

  /**
   * `currentEventIds` are the ids stored before this edit. A topic must keep at
   * least one event, which is what `firestore.rules` enforces on its side.
   */
  const leaveTopic = async (topicId: string, currentEventIds: string[]) => {
    const writerEventId = getWriterEvent()?.id;
    if (!writerEventId) {
      setError('Only a writer can remove an event from a topic');
      return;
    }
    if (currentEventIds.length < 2) {
      setError('A topic must stay linked to at least one event');
      return;
    }
    await writeTopicEvents(topicId, arrayRemove(writerEventId));
  };

  /**
   * Written as an array transform rather than a whole array so two writers
   * joining or leaving at once cannot overwrite each other.
   */
  const writeTopicEvents = (topicId: string, event_ids: FieldValue) =>
    writeTopic(topicId, {
      event_ids,
      updated_at: new Date(),
      notified_at: new Date(),
    });

  const writeTopic = async (
    topicId: string,
    payload: UpdateData<DocumentData>
  ) => {
    setLoading(true);
    setError(null);

    try {
      await updateDoc(doc(db, `topics/${topicId}`), payload);
      console.log('Document updated with ID:', topicId);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  return { editTopic, joinTopic, leaveTopic, loading, error };
};
