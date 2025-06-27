import { Comment } from './comment';

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
  ref_id?: string; // reference to ID in Google Sheets
  title: string;
  category: string;
  event_id: string;
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export type CreateTopicDBPayload = Omit<TopicDB, 'id'>;

export type UpdateTopicDBPayload = Omit<TopicDB, 'created_at' | 'id'>;

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
  | 'สิทธิเสรีภาพ'
  | 'รัฐสภา'
  | 'ศาล รธน.'
  | 'การปกครองส่วนท้องถิ่น'
  | 'สสร.'
  | 'ไม่ระบุ'
  | 'สิ่งแวดล้อม'
  | 'การศึกษา'
  | 'สวัสดิการ'
  | 'อื่น ๆ';

export const topicCategories: TopicCategory[] = [
  'สิทธิเสรีภาพ',
  'รัฐสภา',
  'ศาล รธน.',
  'การปกครองส่วนท้องถิ่น',
  'สสร.',
  'ไม่ระบุ',
  'สิ่งแวดล้อม',
  'การศึกษา',
  'สวัสดิการ',
  'อื่น ๆ',
];

// gcloud firestore export gs://my-project-test-269510.appspot.com --collection-ids='topics','collections'

export interface LightWeightTopic {
  id: string;
  title: string;
  category: string;
  created_at: Date;
  event_id: string;
  comment_level1_count: number;
}
