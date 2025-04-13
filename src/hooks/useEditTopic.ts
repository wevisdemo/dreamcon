import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firestore"; // ✅ Correct Firestore import
import { AddOrEditTopicPayload, UpdateTopicDBPayload } from "../types/topic";

export const useEditTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editTopic = async (payload: AddOrEditTopicPayload) => {
    setLoading(true);
    setError(null);

    if (!payload.id) {
      setError("No ID found in Edit Topic Payload");
      setLoading(false);
      return;
    }

    try {
      const topicDocRef = doc(db, `topics/${payload.id}`);

      const timeNow = new Date();
      const TopicDBPayload: UpdateTopicDBPayload = {
        title: payload.title,
        category: payload.category,
        event_id: payload.event_id,
        updated_at: timeNow,
        notified_at: timeNow,
      };

      await updateDoc(topicDocRef, TopicDBPayload);
      console.log("Document updated with ID:", payload.id);
    } catch (err) {
      console.error("Error updating document:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { editTopic, loading, error };
};
