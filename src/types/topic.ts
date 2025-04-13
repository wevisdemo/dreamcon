import { Comment } from "./comment";

export interface Topic {
  id: string;
  title: string;
  category: string;
  comments: Comment[];
  event_id: string;
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export interface TopicDB {
  id: string;
  title: string;
  category: string;
  event_id: string;
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export type CreateTopicDBPayload = Omit<TopicDB, "id">;

export type UpdateTopicDBPayload = Omit<TopicDB, "created_at" | "id">;

export interface AddOrEditTopicPayload {
  id?: string;
  title: string;
  event_id: string;
  category: TopicCategory;
}

export interface ModalTopicPayload {
  id?: string;
  title: string;
  category: TopicCategory;
  event_id?: string;
}

export type TopicCategory =
  | "สิทธิเสรีภาพ"
  | "รัฐสภา"
  | "ศาล รธน."
  | "การปกครองส่วนท้องถิ่น"
  | "สสร."
  | "ไม่ระบุ";

export const topicCategories: TopicCategory[] = [
  "สิทธิเสรีภาพ",
  "รัฐสภา",
  "ศาล รธน.",
  "การปกครองส่วนท้องถิ่น",
  "สสร.",
  "ไม่ระบุ",
];
