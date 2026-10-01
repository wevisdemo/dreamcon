export interface DreamConEvent {
  id: string;
  display_name: string;
  avatar_url: string;
  title_en: string;
  title_th: string;
  description: string;
  location: string;
  date: string;
  target_group: string;
  participants: number;
  news_link: string;
  document_link: string;
  organizers: string[];
  target_group_types: string[];
  topic_counts: number;
  created_at: Date;
  updated_at: Date;
  index?: number; // use only in admin page
}

export const defaultAddOrEditEventPayload: AddOrEditEventPayload = {
  display_name: '',
  avatar_url: '',
  title_en: '',
  title_th: '',
  description: '',
  location: '',
  date: '',
  target_group: '',
  participants: null,
  news_link: '',
  document_link: '',
  organizers: [],
  target_group_types: [],
};

export interface AddOrEditEventPayload {
  id?: string;
  display_name: string;
  avatar_url: string;
  title_en: string;
  title_th: string;
  description: string;
  location: string;
  date: string;
  target_group: string;
  participants: number | null;
  news_link: string;
  document_link: string;
  organizers: string[];
  target_group_types: string[];
}

export type CreateEventDBPayload = Omit<DreamConEvent, 'id' | 'topic_counts'>;

export type DreamConEventDB = Omit<DreamConEvent, 'topic_counts'>;
