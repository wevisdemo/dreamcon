export interface Comment {
  id: string;
  comment_view: CommentView;
  reason: string;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export enum CommentView {
  AGREE = "เห็นด้วย",
  PARTIAL_AGREE = "เห็นด้วยบางส่วน",
  DISAGREE = "ไม่เห็นด้วย",
}
