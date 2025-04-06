import { collection, doc, runTransaction } from "firebase/firestore";
import { AddOrEditEventPayload, CreateEventDBPayload } from "../types/event";
import { db } from "../utils/firestore";
import { useState } from "react";

export const useEvent = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const createEvent = async (payload: AddOrEditEventPayload) => {
    setLoading(true);
    setError(null);

    if (!payload.display_name) {
      setError("No display_name found in Add New Event Payload");
      setLoading(false);
      return;
    }

    try {
      const eventsCollection = collection(db, "events");
      const timeNow = new Date();
      const eventDBPayload: CreateEventDBPayload = {
        display_name: payload.display_name,
        avatar_url: payload.avatar_url,
        title_en: payload.title_en,
        title_th: payload.title_th,
        description: payload.description,
        location: payload.location,
        date: payload.date,
        target_group: payload.target_group,
        participants: payload.participants || 0,
        news_link: payload.news_link,
        created_at: timeNow,
        updated_at: timeNow,
      };

      await runTransaction(db, async (transaction) => {
        const docRef = doc(eventsCollection);
        transaction.set(docRef, eventDBPayload);

        console.log("Document written with ID: ", docRef.id);
      });
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, loading, error };
};
