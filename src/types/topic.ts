import { Comment } from "./comment";

export interface Topic {
  id: string;
  title: string;
  comments: Comment[];
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export interface TopicDB {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export type CreateTopicDBPayload = Omit<TopicDB, "id">;

export type UpdateTopicDBPayload = Omit<TopicDB, "created_at" | "id">;

export interface AddOrEditTopicPayload {
  id?: string;
  title: string;
}
