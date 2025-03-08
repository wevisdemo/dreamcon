export interface Comment {
  id: string;
  comment_view: CommentView;
  reason: string;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface CommentDB {
  id: string;
  comment_view: CommentView;
  reason: string;
  parent_comment_ids: string[];
  parent_topic_id: string;
  created_at: string;
  updated_at: string;
  notified_at: string;
}

export enum CommentView {
  AGREE = "เห็นด้วย",
  PARTIAL_AGREE = "เห็นด้วยบางส่วน",
  DISAGREE = "ไม่เห็นด้วย",
}

export interface AddOrEditCommentPayload {
  comment_view: CommentView;
  reason: string;
}
