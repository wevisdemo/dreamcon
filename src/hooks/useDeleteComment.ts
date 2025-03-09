import { useState } from "react";
import { db } from "../utils/firestore";
import {
  doc,
  collection,
  query,
  where,
  getDocs,
  runTransaction,
} from "firebase/firestore";

export const useDeleteCommentWithChildren = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCommentWithChildren = async (commentId: string) => {
    if (!commentId) {
      setError("No comment ID provided for deletion");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        const commentsCollection = collection(db, "comments");

        // Step 1: Find child comments where parent_comment_ids contains the comment ID
        const childCommentsQuery = query(
          commentsCollection,
          where("parent_comment_ids", "array-contains", commentId)
        );
        const childCommentsSnapshot = await getDocs(childCommentsQuery);

        // Step 2: Delete all child comments in the transaction
        childCommentsSnapshot.docs.forEach((docSnapshot) => {
          const childCommentRef = doc(db, `comments/${docSnapshot.id}`);
          transaction.delete(childCommentRef);
        });

        // Step 3: Delete the main comment
        const commentDocRef = doc(db, `comments/${commentId}`);
        transaction.delete(commentDocRef);
      });

      console.log(
        "Comment and all child comments deleted successfully:",
        commentId
      );
    } catch (err) {
      console.error("Error deleting comment:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { deleteCommentWithChildren, loading, error };
};
