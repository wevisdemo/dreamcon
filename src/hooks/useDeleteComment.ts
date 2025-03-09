import { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../utils/firestore"; // Ensure correct Firestore import

export const useDeleteComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteComment = async (commentId: string) => {
    if (!commentId) {
      setError("No comment ID provided for deletion");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const commentDocRef = doc(db, `comments/${commentId}`);
      await deleteDoc(commentDocRef);
      console.log("Comment deleted successfully:", commentId);
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { deleteComment, loading, error };
};
