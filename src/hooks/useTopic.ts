import { collection, query, where, getDocs } from "firebase/firestore";
import { useState } from "react";
import { db } from "../utils/firestore";
import { Topic } from "../types/topic";

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

  return { getTopicByEventId, loading, error };
};
