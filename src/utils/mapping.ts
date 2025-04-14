import { CommentDB, Comment } from "../types/comment";
import { Topic, TopicDB } from "../types/topic";

export const convertTopicDBToTopic = (
  topicDB: TopicDB,
  commentDBs: CommentDB[]
): Topic => {
  const comments = mapCommentsHierarchy(commentDBs);
  return {
    id: topicDB.id,
    title: topicDB.title,
    comments: comments,
    created_at: topicDB.created_at,
    updated_at: topicDB.updated_at,
    notified_at: topicDB.notified_at,
    event_id: topicDB.event_id,
    category: topicDB.category,
  };
};

export const mapCommentsHierarchy = (commentDBList: CommentDB[]): Comment[] => {
  const commentMap: Map<string, Comment> = new Map();

  // Convert CommentDB objects to Comment and store in map
  commentDBList.forEach((commentDB) => {
    commentMap.set(commentDB.id, {
      ...commentDB,
      comments: [],
    });
  });

  const rootComments: Comment[] = [];

  commentDBList.forEach((commentDB) => {
    const comment = commentMap.get(commentDB.id);
    if (!comment) return;

    if (comment.parent_comment_ids.length === 0) {
      // No parent, it's a root comment
      rootComments.push(comment);
    } else {
      // Find the direct parent (last ID in parent_comment_ids)
      const parentId =
        comment.parent_comment_ids[comment.parent_comment_ids.length - 1];
      const parentComment = commentMap.get(parentId);

      if (parentComment) {
        parentComment.comments.push(comment);
      } else {
        // If no valid parent is found, treat it as root (should not happen normally)
        rootComments.push(comment);
      }
    }
  });

  return rootComments;
};
