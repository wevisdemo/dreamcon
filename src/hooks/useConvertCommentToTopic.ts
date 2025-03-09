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
import { CreateTopicDBPayload } from "../types/topic";
import { Comment } from "../types/comment";

export const useConvertCommentToTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertCommentToTopic = async (comment: Comment) => {
    const commentId = comment.id;
    if (!commentId) {
      setError("Missing comment ID");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await runTransaction(db, async (transaction) => {
        const commentsCollection = collection(db, "comments");
        const topicsCollection = collection(db, "topics");

        // Step 1: Fetch the target comment
        const targetCommentRef = doc(db, `comments/${commentId}`);
        const targetCommentSnap = await transaction.get(targetCommentRef);
        if (!targetCommentSnap.exists()) throw new Error("Comment not found");

        const targetCommentData = targetCommentSnap.data();

        // Step 2: Create a new topic using `reason` as the title
        const newTopicDocRef = doc(topicsCollection);
        const newTopicId = newTopicDocRef.id;
        const timeNow = new Date();
        const topicPayload: CreateTopicDBPayload = {
          title: targetCommentData.reason, // Convert reason to title
          created_at: timeNow,
          updated_at: timeNow,
          notified_at: timeNow,
        };
        await transaction.set(newTopicDocRef, topicPayload);

        // Step 3: Fetch all child comments recursively
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

        const updateChildComments = async (parentId: string) => {
          const childComments = await fetchChildComments(parentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Remove parent_comment_ids up to the target comment index
            const targetIndex = child.parent_comment_ids.indexOf(parentId);
            const newParentIds = child.parent_comment_ids.slice(
              targetIndex + 1
            );

            transaction.update(childRef, {
              parent_topic_id: newTopicId,
              parent_comment_ids: newParentIds,
            });
          }
        };

        // Step 4: Recursively update all children
        await updateChildComments(commentId);

        // Step 5: Delete the old comment after conversion
        transaction.delete(targetCommentRef);

        // Step 6: Update the notified_at field of the new topic
        const oldParentTopicRef = doc(db, `topics/${comment.parent_topic_id}`);
        transaction.update(oldParentTopicRef, {
          notified_at: new Date(),
        });
      });

      console.log(`Comment ${commentId} converted to topic successfully.`);
    } catch (err) {
      console.error("Error converting comment to topic:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { convertCommentToTopic, loading, error };
};
