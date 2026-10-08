import {
  asDate,
  asNumber,
  asString,
  Column,
  fetchCsv,
  Object,
  type StaticDecode,
} from 'sheethuahua';
import { asStrings, csvUrl, once } from './shared';

export const eventSchema = Object({
  id: Column('id', asString()),
  displayName: Column('display_name', asString()),
  title: Object({
    en: Column('title_en', asString()),
    th: Column('title_th', asString().optional()),
  }),
  description: Column('description', asString()),
  date: Column('date', asDate({ format: 'YYYY-MM-DD' })),
  location: Column('location', asString()),
  participantCount: Column('participants', asNumber()),
  targetGroup: Object({
    description: Column('target_group', asString()),
    types: Column('target_group_types', asStrings().optional([])),
  }),
  organizers: Column('organizers', asStrings().optional([])),
  newsLink: Column('news_link', asString().optional()),
  documentLink: Column('document_link', asString().optional()),
});

export type Event = StaticDecode<typeof eventSchema>;

export const loadEvents = once(() =>
  fetchCsv(csvUrl('dreamcon', 'events'), eventSchema)
);
