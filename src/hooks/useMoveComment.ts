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

export const useMoveComment = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const commentsCollection = collection(db, "comments");

  const fetchChildComments = async (parentId: string) => {
    const childCommentsQuery = query(
      commentsCollection,
      where("parent_comment_ids", "array-contains", parentId)
    );
    const childCommentsSnapshot = await getDocs(childCommentsQuery);
    return childCommentsSnapshot.docs.map((doc) => ({
      id: doc.id,
      parent_comment_ids: doc.data().parent_comment_ids,
    }));
  };

  const moveCommentToComment = async (
    commentId: string,
    newParentId: string
  ) => {
    if (!commentId || !newParentId) {
      setError("Missing comment ID or new parent ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        // Step 1: Fetch the target comment
        const targetCommentRef = doc(db, `comments/${commentId}`);
        const targetCommentSnap = await transaction.get(targetCommentRef);
        if (!targetCommentSnap.exists())
          throw new Error("Target comment not found");

        // Step 2: Fetch the new parent comment
        const newParentCommentRef = doc(db, `comments/${newParentId}`);
        const newParentSnap = await transaction.get(newParentCommentRef);
        if (!newParentSnap.exists())
          throw new Error("New parent comment not found");

        const newParentData = newParentSnap.data();

        // Step 3: Compute the new `parent_comment_ids`
        const newParentIds = [...newParentData.parent_comment_ids, newParentId];

        // Step 4: Update the target comment with new parent IDs
        transaction.update(targetCommentRef, {
          parent_comment_ids: newParentIds,
        });

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);
            const oldParentIds = child.parent_comment_ids;
            const parentIndex = oldParentIds.indexOf(parentId);
            if (parentIndex === -1) continue;
            const newChildParentIds = [
              ...newParentIds,
              ...oldParentIds.slice(parentIndex),
            ];
            transaction.update(childRef, {
              parent_comment_ids: newChildParentIds,
            });
          }
        };

        // Step 6: Recursively update child comments with the new hierarchy
        await updateChildComments(commentId);
      });

      console.log("Comment moved successfully:", commentId);
    } catch (err) {
      console.error("Error moving comment:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  const moveCommentToTopic = async (commentId: string, newTopicId: string) => {
    if (!commentId || !newTopicId) {
      setError("Missing comment ID or new topic ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        // Step 1: Fetch the target comment
        const targetCommentRef = doc(db, `comments/${commentId}`);
        const targetCommentSnap = await transaction.get(targetCommentRef);
        if (!targetCommentSnap.exists())
          throw new Error("Target comment not found");

        // Step 2: Update the target comment
        transaction.update(targetCommentRef, {
          parent_comment_ids: [], // Level 1 comment
          parent_topic_id: newTopicId,
        });

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Remove the old parent IDs from the child’s parent_comment_ids
            const oldParentIds = child.parent_comment_ids;
            const parentIndex = oldParentIds.indexOf(parentId);
            if (parentIndex === -1) continue;
            const newParentIds = [...oldParentIds.slice(parentIndex)];

            transaction.update(childRef, {
              parent_comment_ids: newParentIds,
              parent_topic_id: newTopicId,
            });
          }
        };

        // Step 4: Recursively update all children
        await updateChildComments(commentId);
      });

      console.log(
        `Comment ${commentId} moved to topic ${newTopicId} successfully.`
      );
    } catch (err) {
      console.error("Error moving comment to topic:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { moveCommentToComment, moveCommentToTopic, loading, error };
};
