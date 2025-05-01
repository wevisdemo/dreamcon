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
import { Comment } from "../types/comment";
import { usePermission } from "./usePermission";

export const useDeleteCommentWithChildren = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isWriterOwner } = usePermission();

  const deleteCommentWithChildren = async (comment: Comment) => {
    const commentId = comment.id;
    if (!commentId) {
      setError("No comment ID provided for deletion");
      return;
    }
    const isOwner = isWriterOwner(comment.event_id);
    if (!isOwner) {
      setError("You do not have permission to delete this comment");
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

        // Step 4: Update the parent topic to notify of the deletion
        const parentTopicId = comment.parent_topic_id;

        if (parentTopicId) {
          const parentTopicRef = doc(db, `topics/${parentTopicId}`);
          transaction.update(parentTopicRef, {
            notified_at: new Date(),
          });
        }
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
