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
  topic_counts: number;
}

export const defaultAddOrEditEventPayload: AddOrEditEventPayload = {
  display_name: "",
  avatar_url: "",
  title_en: "",
  title_th: "",
  description: "",
  location: "",
  date: "",
  target_group: "",
  participants: null,
  news_link: "",
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
}
