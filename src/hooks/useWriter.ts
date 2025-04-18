import { collection, doc, getDoc, runTransaction } from "firebase/firestore";
import { useState } from "react";
import { db } from "../utils/firestore";
import {
  CreateWritePayload,
  CreateWriterDBPayload,
  Writer,
} from "../types/writer";

// filepath: /Users/petchsongpon/projects/wevis/dreamcon/src/hooks/useWriter.ts

export const useWriter = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWriterByID = async (id: string): Promise<Writer | null> => {
    setLoading(true);
    setError(null);

    try {
      const writerDocRef = doc(db, "writers", id);
      const writerSnapshot = await getDoc(writerDocRef);

      if (!writerSnapshot.exists()) {
        throw new Error("Writer not found for the given ID");
      }
      const data = writerSnapshot.data();
      if (!data) {
        throw new Error("Writer data is empty");
      }

      return {
        ...data,
        created_at: data.created_at.toDate(),
        expired_at: data.expired_at.toDate(),
      } as Writer;
    } catch (err) {
      console.error("Error fetching writer document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const createWriter = async (payload: CreateWritePayload): Promise<string> => {
    setLoading(true);
    setError(null);
    let id = "";

    if (!payload.event_id) {
      setError("No event_id found in Create Write Payload");
      setLoading(false);
      return "";
    }

    try {
      const eventDocRef = doc(db, "events", payload.event_id);

      const writersCollection = collection(db, "writers");
      const timeNow = new Date();
      const expiredAt = new Date();
      expiredAt.setDate(timeNow.getDate() + 1); // Set expiration to 7 days from now

      const writerDBPayload: CreateWriterDBPayload = {
        event_id: payload.event_id,
        created_at: timeNow,
        expired_at: expiredAt,
      };

      await runTransaction(db, async (transaction) => {
        const eventSnapshot = await transaction.get(eventDocRef);
        if (!eventSnapshot.exists()) {
          throw new Error("Event not found for the given event_id");
          return;
        }
        const docRef = doc(writersCollection);
        transaction.set(docRef, writerDBPayload);

        console.log("Writer document created with ID: ", docRef.id);
        id = docRef.id;
      });
    } catch (err) {
      console.error("Error creating writer document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
    return id;
  };

  return { createWriter, getWriterByID, loading, error };
};
