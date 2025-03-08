import { Comment } from "./comment";

export interface Topic {
  id: string;
  title: string;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}

export interface TopicDB {
  id: string;
  title: string;
  created_at: Date;
  updated_at: Date;
}

export type CreateTopicDBPayload = Omit<TopicDB, "id">;

export interface AddOrEditTopicPayload {
  title: string;
}
