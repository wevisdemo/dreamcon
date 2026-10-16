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
import { asStrings, csvUrl, once, toGroupId } from './shared';

export const topicSchema = Object({
  id: Column('id', asString()),
  title: Column('title', asString()),
  eventIds: Column('event_ids', asStrings()),
});

export const commentSchema = Object({
  id: Column('id', asString()),
  view: Column('comment_view', asOneOf(commentViews)),
  reason: Column('reason', asString()),
  parentTopicId: Column('parent_topic_id', asString()),
  parentCommentId: Column('parent_comment_id', asString().optional()),
  eventIds: Column('event_ids', asStrings()),
});

const topicGroupSchema = Object({
  topicId: Column('id', asString()),
  category: Column('category', asString()),
  group: Column('group', asNumber()),
  distanceToPhrase: Column('embedded_distance_to_phrase', asNumber()),
});

export type TopicGroup = {
  id: string;
  category: string;
  distanceToPhrase: number;
};
export type Comment = StaticDecode<typeof commentSchema> & {
  comments: Comment[];
};
export type Conversation = StaticDecode<typeof topicSchema> & {
  groups: TopicGroup[];
  comments: Comment[];
};

/** Own event ids plus those of every reply below, without repeats */
const withReplyEvents = (eventIds: string[], replies: Comment[]) => [
  ...new Set([...eventIds, ...replies.flatMap(reply => reply.eventIds)]),
];

export const loadConversations = once(async (): Promise<Conversation[]> => {
  const [topics, topicGroups, comments] = await Promise.all([
    fetchCsv(csvUrl('dreamcon', 'topics'), topicSchema),
    fetchCsv(csvUrl('dreamcon-data', 'topic_groups'), topicGroupSchema),
    fetchCsv(csvUrl('dreamcon', 'comments'), commentSchema),
  ]);
  const groupsByTopic = Map.groupBy(topicGroups, ({ topicId }) => topicId);
  const commentsByParent = Map.groupBy(comments, comment =>
    comment.parentCommentId
      ? `comment:${comment.parentCommentId}`
      : `topic:${comment.parentTopicId}`
  );
  const nest = (parentKey: string): Comment[] =>
    (commentsByParent.get(parentKey) ?? []).map(comment => {
      const replies = nest(`comment:${comment.id}`);
      return {
        ...comment,
        eventIds: withReplyEvents(comment.eventIds, replies),
        comments: replies,
      };
    });

  return topics.flatMap(topic => {
    const groups = groupsByTopic.get(topic.id);
    const topicComments = nest(`topic:${topic.id}`);
    return groups
      ? [
          {
            ...topic,
            eventIds: withReplyEvents(topic.eventIds, topicComments),
            groups: groups.map(({ category, group, distanceToPhrase }) => ({
              id: toGroupId(category, group),
              category,
              distanceToPhrase,
            })),
            comments: topicComments,
          },
        ]
      : [];
  });
});
