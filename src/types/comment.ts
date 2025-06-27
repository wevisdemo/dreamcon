export interface Comment {
  id: string;
  comment_view: CommentView;
  reason: string;
  parent_comment_ids: string[];
  event_id: string;
  parent_topic_id: string;
  comments: Comment[];
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export interface CommentDB {
  id: string;
  ref_id?: string; // optional for legacy comments
  comment_view: CommentView;
  reason: string;
  parent_comment_ids: string[];
  parent_topic_id: string;
  event_id: string;
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export type CreateCommentDBPayload = Omit<CommentDB, 'id'>;

export type UpdateCommentDBPayload = Omit<
  CommentDB,
  'created_at' | 'id' | 'parent_topic_id' | 'parent_comment_ids'
>;

export enum CommentView {
  AGREE = 'เห็นด้วย',
  PARTIAL_AGREE = 'เห็นด้วยบางส่วน',
  DISAGREE = 'ไม่เห็นด้วย',
}

export interface AddOrEditCommentPayload {
  id?: string;
  comment_view: CommentView;
  reason: string;
  parent_comment_ids?: string[];
  parent_topic_id?: string;
  event_id: string;
}
