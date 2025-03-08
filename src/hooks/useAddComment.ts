import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../utils/firestore";
import {
  AddOrEditCommentPayload,
  CreateCommentDBPayload,
} from "../types/comment";

export const useAddComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addNewComment = async (payload: AddOrEditCommentPayload) => {
    setLoading(true);
    setError(null);

    if (!payload.parent_topic_id) {
      setError("No parent_topic_id found in Add New Comment Payload");
      setLoading(false);
      return;
    }

    try {
      const commentsCollection = collection(db, "comments");
      const timeNow = new Date();
      const CommentDBPayload: CreateCommentDBPayload = {
        comment_view: payload.comment_view,
        reason: payload.reason,
        parent_comment_ids: payload.parent_comment_ids || [],
        parent_topic_id: payload.parent_topic_id,
        created_at: timeNow,
        updated_at: timeNow,
        notified_at: timeNow,
      };

      const docRef = await addDoc(commentsCollection, CommentDBPayload);
      console.log("Document written with ID: ", docRef.id);
    } catch (err) {
      console.error("Error adding document: ", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { addNewComment, loading, error };
};
