import { strToU8, zipSync } from 'fflate';
import {
  asNumber,
  asString,
  Column,
  formatToCsv,
  Object,
  type TObject,
} from 'sheethuahua';
import {
  commentSchema,
  loadConversations,
  topicSchema,
  type Comment,
} from './conversations';
import { eventSchema, loadEvents } from './events';
import { groupQuestionSchema, loadGroupQuestions } from './group-questions';

const BOM = String.fromCharCode(0xfeff);

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

const toCsv = <T extends TObject>(
  rows: Parameters<typeof formatToCsv<T>>[0],
  schema: T
) => strToU8(BOM + formatToCsv(rows, schema));

/**
 * Packs every published dataset into one ZIP of normalized CSVs, starting with
 * a BOM so spreadsheet apps read Thai as UTF-8. Runs at build time.
 *
 * @returns ZIP bytes with the same topics, groups and events the site shows
 */
export const createDatasetZip = async () => {
  const [conversations, events, categories] = await Promise.all([
    loadConversations(),
    loadEvents(),
    loadGroupQuestions(),
  ]);
  const comments = conversations.flatMap(({ comments }) =>
    flattenComments(comments)
  );

  return zipSync({
    'category.csv': toCsv(
      categories.flatMap(({ category, groups }) =>
        groups.map(({ phrase }, group) => ({ category, group, phrase }))
      ),
      groupQuestionSchema
    ),
    'events.csv': toCsv(events, eventSchema),
    'topics.csv': toCsv(conversations, topicSchema),
    'comments.csv': toCsv(comments, commentSchema),
    'topic_category.csv': toCsv(
      conversations.flatMap(({ id, groups }) =>
        groups.map(group => ({ topicId: id, ...group }))
      ),
      Object({
        topicId: Column('topic_id', asString()),
        category: Column('category', asString()),
        group: Column('group', asNumber()),
        distanceToPhrase: Column('distance_to_phrase', asNumber()),
      })
    ),
    'topic_event.csv': toCsv(
      conversations.flatMap(({ id, eventIds }) =>
        eventIds.map(eventId => ({ topicId: id, eventId }))
      ),
      Object({
        topicId: Column('topic_id', asString()),
        eventId: Column('event_id', asString()),
      })
    ),
    'comment_event.csv': toCsv(
      comments.flatMap(({ id, eventIds }) =>
        eventIds.map(eventId => ({ commentId: id, eventId }))
      ),
      Object({
        commentId: Column('comment_id', asString()),
        eventId: Column('event_id', asString()),
      })
    ),
  });
};
