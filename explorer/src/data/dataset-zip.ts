import { strToU8, zipSync } from 'fflate';
import {
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
import { asStrings } from './shared';

const BOM = String.fromCharCode(0xfeff);

const flattenComments = (comments: Comment[]): Comment[] =>
  comments.flatMap(comment => [comment, ...flattenComments(comment.comments)]);

const toCsv = <T extends TObject>(
  rows: Parameters<typeof formatToCsv<T>>[0],
  schema: T
) => strToU8(BOM + formatToCsv(rows, schema));

/**
 * Packs every published dataset into one ZIP of CSVs, starting with a BOM so
 * spreadsheet apps read Thai as UTF-8. Topics and comments reference events,
 * and topics reference categories, through comma-separated id columns. Runs at
 * build time.
 *
 * @returns ZIP bytes with the same topics, groups and events the site shows
 */
export const createDatasetZip = async () => {
  const [conversations, events, categories] = await Promise.all([
    loadConversations(),
    loadEvents(),
    loadGroupQuestions(),
  ]);

  return zipSync({
    'categories.csv': toCsv(
      categories.flatMap(({ category, groups }) =>
        groups.map(group => ({ category, ...group }))
      ),
      Object({
        id: Column('id', asString()),
        ...groupQuestionSchema.properties,
      })
    ),
    'events.csv': toCsv(events, eventSchema),
    'topics.csv': toCsv(
      conversations.map(conversation => ({
        ...conversation,
        categoryIds: conversation.groups.map(({ id }) => id),
      })),
      Object({
        ...topicSchema.properties,
        categoryIds: Column('category_ids', asStrings()),
      })
    ),
    'comments.csv': toCsv(
      conversations.flatMap(({ comments }) => flattenComments(comments)),
      commentSchema
    ),
  });
};
