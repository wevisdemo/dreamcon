import { DreamConEvent } from './event';
import { TopicCategory } from './topic';

export interface TopicFilter {
  selectedEvent: DreamConEvent | null;
  sortedBy: 'latest' | 'most-commented';
  category: TopicFilterCategory;
  searchText: string;
}

export type TopicFilterCategory = 'ทั้งหมด' | TopicCategory;

export const topicFilterCategories: TopicFilterCategory[] = [
  'ทั้งหมด',
  'สิทธิเสรีภาพ',
  'รัฐสภา',
  'ศาล รธน.',
  'การปกครองส่วนท้องถิ่น',
  'สสร.',
  'ไม่ระบุ',
];
