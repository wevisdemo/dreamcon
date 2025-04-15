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
import { CreateTopicDBPayload, TopicDB } from "../types/topic";
import { Comment, CreateCommentDBPayload } from "../types/comment";

export const useConvertCommentToTopic = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertCommentToTopic = async (
    comment: Comment,
    event_id: string
  ): Promise<TopicDB | null> => {
    const commentId = comment.id;
    setLoading(true);
    setError(null);

    let newTopicId = "";
    const timeNow = new Date();

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
        newTopicId = newTopicDocRef.id;
        const topicPayload: CreateTopicDBPayload = {
          title: targetCommentData.reason, // Convert reason to title
          created_at: timeNow,
          updated_at: timeNow,
          notified_at: timeNow,
          category: "ไม่ระบุ",
          event_id: event_id,
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
      return {
        id: newTopicId,
        title: comment.reason,
        created_at: timeNow,
        updated_at: timeNow,
        notified_at: timeNow,
        category: "ไม่ระบุ",
        event_id: event_id,
      };
    } catch (err) {
      console.error("Error converting comment to topic:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const undoConvertCommentToTopic = async (
    previousComment: Comment,
    topic: TopicDB
  ) => {
    setLoading(true);
    setError(null);

    // !! known issue: not handling if former parent topic or comment is deleted

    try {
      await runTransaction(db, async (transaction) => {
        const commentsCollection = collection(db, "comments");

        // Step 1: Create a new comment using the topic title as the reason
        const newCommentDocRef = doc(db, `comments/${previousComment.id}`);
        const timeNow = new Date();
        const commentPayload: CreateCommentDBPayload = {
          reason: previousComment.reason, // Convert title to reason
          comment_view: previousComment.comment_view,
          parent_comment_ids: previousComment.parent_comment_ids,
          parent_topic_id: previousComment.parent_topic_id,
          created_at: previousComment.created_at,
          updated_at: timeNow,
          notified_at: timeNow,
          event_id: previousComment.event_id,
        };

        await transaction.set(newCommentDocRef, commentPayload);

        // Step 2: Fetch all child comments
        const fetchChildComments = async (topicParentId: string) => {
          const childCommentsQuery = query(
            commentsCollection,
            where("parent_topic_id", "==", topicParentId)
          );
          const childCommentsSnapshot = await getDocs(childCommentsQuery);
          return childCommentsSnapshot.docs.map((doc) => ({
            id: doc.id,
            parent_comment_ids: doc.data().parent_comment_ids,
          }));
        };

        const parentsOfAllChildren = [
          ...previousComment.parent_comment_ids,
          previousComment.id,
        ];
        // step 3: update all children
        const updateChildComments = async (topicParentId: string) => {
          const childComments = await fetchChildComments(topicParentId);
          for (const child of childComments) {
            const childRef = doc(db, `comments/${child.id}`);

            // Remove parent_comment_ids up to the target comment index
            const newParentIds = [
              ...parentsOfAllChildren,
              ...child.parent_comment_ids,
            ];
            const newTopicParentId = previousComment.parent_topic_id;

            await transaction.update(childRef, {
              parent_topic_id: newTopicParentId,
              parent_comment_ids: newParentIds,
            });
          }
        };

        // Step 4: Recursively update all children
        await updateChildComments(topic.id);

        // Step 5: Delete the old comment after conversion
        const targetCommentRef = doc(db, `topics/${topic.id}`);
        await transaction.delete(targetCommentRef);

        // Step 6: Update the notified_at field of parent topic
        const oldParentTopicRef = doc(
          db,
          `topics/${previousComment.parent_topic_id}`
        );
        await transaction.update(oldParentTopicRef, {
          notified_at: new Date(),
        });
      });

      console.log(
        `undo convert comment ${previousComment.id} to topic ${topic.id} successfully.`
      );
    } catch (err) {
      console.error("Error undo converting comment to topic:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return { convertCommentToTopic, undoConvertCommentToTopic, loading, error };
};
