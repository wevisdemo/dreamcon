import { Comment } from './comment';

export interface Topic {
  id: string;
  title: string;
  categories: string[];
  comments: Comment[];
  event_ids: string[];
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export interface TopicDB {
  id: string;
  ref_id?: string; // reference to ID in Google Sheets
  title: string;
  categories: string[];
  event_ids: string[];
  created_at: Date;
  updated_at: Date;
  notified_at: Date;
}

export type CreateTopicDBPayload = Omit<TopicDB, 'id'>;

/** `event_ids` is written on its own through join/leave, never by a text edit. */
export type UpdateTopicDBPayload = Omit<
  TopicDB,
  'created_at' | 'id' | 'event_ids'
>;

export interface AddOrEditTopicPayload {
  id?: string;
  title: string;
  event_ids: string[];
  categories: TopicCategory[];
}

export interface ModalTopicPayload {
  id?: string;
  title: string;
  categories: TopicCategory[];
  event_ids?: string[];
}

/** Renaming or retiring a string here needs a matching pass in `04-event-ids.ts`. */
export const topicCategories = [
  'สิทธิเสรีภาพ',
  'ฝ่ายนิติบัญญัติ',
  'ฝ่ายตุลาการ',
  'การปกครองส่วนท้องถิ่น',
  'สสร.',
  'สิ่งแวดล้อม',
  'การศึกษา',
  'สวัสดิการ',
  'ฝ่ายบริหาร',
  'พระมหากษัตริย์และองคมนตรี',
  'องค์กรอิสระ',
  'การเลือกตั้งและประชามติ',
  'ความเสมอภาค',
  'งบประมาณ',
  'สาธารณสุข',
  'ที่ดินและสิทธิชุมชน',
  'พลังงาน',
  'เศรษฐกิจ',
  'แรงงาน',
  'ความมั่นคง',
  'การปราบทุจริต',
  'การแก้ รธน.',
  'อื่น ๆ',
] as const;

export type TopicCategory = (typeof topicCategories)[number];

/**
 * A real stored category, not a stand-in for "uncategorised" — that is the empty
 * array, which the retired `'ไม่ระบุ'` migrates to. It only excludes the others:
 * picking it means the topic fits none of them, so combining is contradictory.
 */
const EXCLUSIVE_CATEGORY: TopicCategory = 'อื่น ๆ';

export const disabledCategories = (selected: string[]): string[] =>
  selected.includes(EXCLUSIVE_CATEGORY)
    ? topicCategories.filter(category => category !== EXCLUSIVE_CATEGORY)
    : selected.length > 0
      ? [EXCLUSIVE_CATEGORY]
      : [];

// gcloud firestore export gs://my-project-test-269510.appspot.com --collection-ids='topics','collections'

export interface LightWeightTopic {
  id: string;
  title: string;
  categories: string[];
  created_at: Date;
  event_ids: string[];
  comment_level1_count: number;
}
