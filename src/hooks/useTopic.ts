import {
  collection,
  query,
  where,
  getDocs,
  getCountFromServer,
} from "firebase/firestore";
import { useState } from "react";
import { db } from "../utils/firestore";
import { LightWeightTopic, Topic } from "../types/topic";

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/hooks/useTopic.ts

export const useTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getTopicByEventId = async (eventId: string): Promise<Topic[]> => {
    setLoading(true);
    setError(null);

    try {
      const topicsCollection = collection(db, "topics");
      const q = query(topicsCollection, where("event_id", "==", eventId));
      const snapshot = await getDocs(q);
      const topics = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title,
          comments: data.comments || [],
          created_at: data.created_at.toDate(),
          updated_at: data.updated_at.toDate(),
          notified_at: data.notified_at.toDate(),
        } as Topic;
      });

      return topics;
    } catch (err) {
      console.error("Error fetching topics: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getCommentLevel1Count = async (topicId: string): Promise<number> => {
    const commentsCollection = collection(db, "comments");
    const commentQuery = query(
      commentsCollection,
      where("parent_topic_id", "==", topicId),
      where("parent_comment_ids", "==", [])
    );
    const snapshot = await getCountFromServer(commentQuery);
    const count = snapshot.data().count;
    return count;
  };

  const getLightWeightTopics = async (): Promise<LightWeightTopic[]> => {
    try {
      const topicsCollection = collection(db, "topics");
      const snapshot = await getDocs(topicsCollection);
      const topics = Promise.all(
        snapshot.docs.map(async (doc) => {
          const data = doc.data();
          const commentLv1Count = await getCommentLevel1Count(doc.id);
          return {
            id: doc.id,
            title: data.title,
            created_at: data.created_at.toDate(),
            event_id: data.event_id,
            comment_level1_count: commentLv1Count,
          } as LightWeightTopic;
        })
      );
      return topics;
    } catch (err) {
      console.error("Error fetching light weight topics: ", err);
      return [];
    }
  };

  return { getTopicByEventId, getLightWeightTopics, loading, error };
};
