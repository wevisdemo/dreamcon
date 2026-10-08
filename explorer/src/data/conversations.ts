import {
  asNumber,
  asOneOf,
  asString,
  Column,
  fetchCsv,
  Object,
  type StaticDecode,
} from 'sheethuahua';
import { commentViews } from '../constants/comment-views';
import { asStrings, csvUrl, once } from './shared';

/** Topic columns without `event_ids`, which the dataset ZIP moves to a join table */
export const topicSchema = Object({
  id: Column('id', asString()),
  title: Column('title', asString()),
});

/** Comment columns without `event_ids`, which the dataset ZIP moves to a join table */
export const commentSchema = Object({
  id: Column('id', asString()),
  view: Column('comment_view', asOneOf(commentViews)),
  reason: Column('reason', asString()),
  parentTopicId: Column('parent_topic_id', asString()),
  parentCommentId: Column('parent_comment_id', asString().optional()),
});

const eventIdsColumn = Column('event_ids', asStrings());

const topicWithEventsSchema = Object({
  ...topicSchema.properties,
  eventIds: eventIdsColumn,
});

const commentWithEventsSchema = Object({
  ...commentSchema.properties,
  eventIds: eventIdsColumn,
});

const topicGroupSchema = Object({
  id: Column('id', asString()),
  category: Column('category', asString()),
  group: Column('group', asNumber()),
  distanceToPhrase: Column('embedded_distance_to_phrase', asNumber()),
});

export type TopicGroup = Omit<StaticDecode<typeof topicGroupSchema>, 'id'>;
export type Comment = StaticDecode<typeof commentWithEventsSchema> & {
  comments: Comment[];
};
export type Conversation = StaticDecode<typeof topicWithEventsSchema> & {
  groups: TopicGroup[];
  comments: Comment[];
};

export const loadConversations = once(async (): Promise<Conversation[]> => {
  const [topics, topicGroups, comments] = await Promise.all([
    fetchCsv(csvUrl('dreamcon', 'topics'), topicWithEventsSchema),
    fetchCsv(csvUrl('dreamcon-data', 'topic_groups'), topicGroupSchema),
    fetchCsv(csvUrl('dreamcon', 'comments'), commentWithEventsSchema),
  ]);
  const groupsByTopic = Map.groupBy(topicGroups, ({ id }) => id);
  const commentsByParent = Map.groupBy(comments, comment =>
    comment.parentCommentId
      ? `comment:${comment.parentCommentId}`
      : `topic:${comment.parentTopicId}`
  );
  const nest = (parentKey: string): Comment[] =>
    (commentsByParent.get(parentKey) ?? []).map(comment => ({
      ...comment,
      comments: nest(`comment:${comment.id}`),
    }));

  return topics.flatMap(topic => {
    const groups = groupsByTopic.get(topic.id);
    return groups
      ? [
          {
            ...topic,
            groups: groups.map(({ category, group, distanceToPhrase }) => ({
              category,
              group,
              distanceToPhrase,
            })),
            comments: nest(`topic:${topic.id}`),
          },
        ]
      : [];
  });
});
