import {
  collection,
  doc,
  runTransaction,
  getDocs,
  getDoc,
  getCountFromServer,
  query,
  where,
} from "firebase/firestore";
import {
  AddOrEditEventPayload,
  CreateEventDBPayload,
  DreamConEvent,
  DreamConEventDB,
} from "../types/event";
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

  const getEvents = async (): Promise<DreamConEvent[]> => {
    setLoading(true);
    setError(null);

    try {
      const eventsCollection = collection(db, "events");
      const snapshot = await getDocs(eventsCollection);
      const events = snapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
            created_at: doc.data()?.created_at.toDate(),
            updated_at: doc.data()?.updated_at.toDate(),
          } as DreamConEvent)
      );
      // get topic counts
      const topicsCollection = collection(db, "topics");
      for (const event of events) {
        const queryChain = query(
          topicsCollection,
          where("event_id", "==", event.id)
        );
        const topicsSnapshot = await getCountFromServer(queryChain);
        const count = topicsSnapshot.data().count;
        event.topic_counts = count;
      }

      return events;
    } catch (err) {
      console.error("Error fetching documents: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return [];
    } finally {
      setLoading(false);
    }
  };

  const editEvent = async (id: string, payload: AddOrEditEventPayload) => {
    setLoading(true);
    setError(null);

    if (!id) {
      setError("No event ID provided for editing");
      setLoading(false);
      return;
    }

    try {
      const eventDocRef = doc(db, "events", id);
      const timeNow = new Date();
      const updatedPayload = {
        ...payload,
        updated_at: timeNow,
      };

      await runTransaction(db, async (transaction) => {
        transaction.update(eventDocRef, updatedPayload);
        console.log("Document updated with ID: ", id);
      });
    } catch (err) {
      console.error("Error updating document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const getEventByID = async (id: string): Promise<DreamConEventDB | null> => {
    setLoading(true);
    setError(null);

    if (!id) {
      setError("No event ID provided");
      setLoading(false);
      return null;
    }

    try {
      const eventDocRef = doc(db, "events", id);
      const docSnapshot = await getDoc(eventDocRef);

      if (!docSnapshot.exists()) {
        setError("Event not found");
        return null;
      }

      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
        created_at: docSnapshot.data()?.created_at.toDate(),
        updated_at: docSnapshot.data()?.updated_at.toDate(),
      } as DreamConEventDB;
    } catch (err) {
      console.error("Error fetching document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createEvent, editEvent, getEventByID, getEvents, loading, error };
};
