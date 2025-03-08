import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firestore"; // Adjust based on your file structure
import { AddOrEditTopicPayload, CreateTopicDBPayload } from "../types/topic";

export const useAddTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewTopic = async (payload: AddOrEditTopicPayload) => {
    setLoading(true);
    setError(null);

    try {
      const topicsCollection = collection(db, "topics");

      const timeNow = new Date();
      const TopicDBPayload: CreateTopicDBPayload = {
        title: payload.title,
        created_at: timeNow,
        updated_at: timeNow,
        notified_at: timeNow,
      };

      const docRef = await addDoc(topicsCollection, TopicDBPayload);
      console.log("Document written with ID:", docRef.id);
    } catch (err) {
      console.error("Error adding document:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { addNewTopic, loading, error };
};
