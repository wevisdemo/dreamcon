import { Comment } from "./comment";

export interface Topic {
  id: string;
  title: string;
  comments: Comment[];
  created_at: string;
  updated_at: string;
}
